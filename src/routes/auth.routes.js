import express from 'express';
import { loginUserController, logoutUserController, registerUserController } from '../contollers/auth.controller.js';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Handle user registration
 * @access Public
 */

router.post('/register', registerUserController);

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


export default router;