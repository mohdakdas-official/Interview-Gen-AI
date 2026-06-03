import { User } from '../models/users.model.js'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { tokenBlacklist } from '../models/blacklist.model.js'

/**
 * @name registerUserController
 * @route POST /api/auth/register
 * @desc Register a new user, expects username, email and password in the request body
 * @access Public 
 */
export const registerUserController = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
            success: false,
        })
    }

    const isUserAlreadyExists = await User.findOne({ $or: [{ email }, { username }] })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already registered with this email or username.",
            success: false,
        })
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPass,
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRETS,
        { expiresIn: '1d' }
    )

    return res.status(201).cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    }).json({
        message: "Account created successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })
}

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