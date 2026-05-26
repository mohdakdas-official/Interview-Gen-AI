import express from 'express';

const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Handle user registration
 * @access Public
 */

authRouter.post('/register');

export default authRouter;