import express from 'express';
import { getMeController, loginUserController, logoutUserController, registerUserController, verifyOtpController } from '../contollers/auth.controller.js';
import { authUser } from '../middlewares/auth.middleware.js'

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Handle user registration
 * @access Public
 */

router.post('/register', registerUserController);

/**
 * @route POST /api/auth/verify-otp
 * @desc Handle otp verification and creating new user
 * @access Public
 */
router.post("/verify-otp", verifyOtpController);

/**
 * @route POST /api/auth/login
 * @desc Handle user login with email and password
 * @access Public
 */
router.post('/login', loginUserController);

/**
 * @route GET /api/auth/logout
 * @desc Clear token from the user cookie and add the token in the blacklist
 * @access Public
 */
router.get('/logout', logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @desc Get the current logged-in user details
 * @access Private
 */
router.get('/get-me', authUser, getMeController)


export default router;