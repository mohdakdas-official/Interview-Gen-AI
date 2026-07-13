import { User } from '../models/users.model.js'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { tokenBlacklist } from '../models/blacklist.model.js'
import OTP from "../models/otp.model.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpEmail } from "../services/email.service.js";


/**
 * @name registerUserController
 * @route POST /api/auth/register
 * @desc Register a new user, expects username, email and password in the request body
 * @access Public 
 */
export const registerUserController = async (req, res) => {

    try {
        const {
            username,
            email,
            password,
            isAcceptTermsConditions,
        } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }
        if (!isAcceptTermsConditions) {
            return res.status(400).json({
                message: "Please accept to the terms and conditions",
                success: false,
            });
        }

        const isUserAlreadyExists = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already registered with this email or username.",
                success: false,
            });
        }


        // Generate OTP
        const otp = generateOtp();

        // Delete previous OTP if exists
        await OTP.deleteMany({ email });

        // Save OTP
        await OTP.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
        });

        // Send Email
        await sendOtpEmail(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully."
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

/**
 * @name verifyOtpController
 * @route POST /api/auth/verify-otp
 * @desc Register a new user, expects username, email and password in the request body
 * @access Public 
 */
export const verifyOtpController = async (req, res) => {
    try {
        const { username, email, password, isAcceptTermsConditions, otp } = req.body;

        if (!username || !email || !password || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Find OTP
        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }

        // Check expiry
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });

            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        // Check OTP
        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Hash Password
        const hashedPass = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            username,
            email,
            password: hashedPass,
            isVerified: true,
            isAcceptTermsConditions: true,
        });

        // Delete OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_SECRETS,
            {
                expiresIn: "1d",
            }
        );

        return res
            .status(201)
            .cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            })
            .json({
                success: true,
                message: "Account created successfully",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
            });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

/**
 * @name loginUserController
 * @route POST /api/auth/register
 * @desc login a user, expects email and password in the request body
 * @access Public 
 */

export const loginUserController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required",
            success: false,
        })
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
        })
    }

    const isPassMatch = await bcrypt.compare(password, user.password)

    if (!isPassMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
        })
    }


    const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRETS,
        { expiresIn: '1d' }
    )


    return res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    }).json({
        message: "Login Successfull",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })

}

/**
 * @name logoutUserController
 * @desc clear token from user cookie and add the token in blacklist
 * @access public
 */
export const logoutUserController = async (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(400).json({
            message: 'You have already logged out'
        })
    }


    await tokenBlacklist.create({ token })


    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });

    return res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
}

/**
 * @name getMeController
 * @desc get the current logged in user details.
 * @access private
 */
export const getMeController = async (req, res) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        message: 'User details fetched successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Check user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email",
            });
        }

        // Generate OTP
        const otp = generateOtp();

        // Remove previous OTP
        await OTP.deleteMany({ email });

        // Save new OTP
        await OTP.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });

        // Send email
        await sendOtpEmail(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const verifyForgotPasswordOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        // Find OTP
        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        }

        // Check expiry
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });

            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        // Check OTP
        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Check user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const isSamePassword = await bcrypt.compare(password, user.password);

        if (isSamePassword) {
            return res.status(400).json({
                message: "New Password cannot be same as old password",
                success: false
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        user.password = hashedPassword;

        await user.save();

        // Delete OTP
        await OTP.deleteMany({ email });

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};