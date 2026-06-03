import jwt from 'jsonwebtoken';
import { tokenBlacklist } from '../models/blacklist.model.js';

export const authUser = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided",
            success: false,
        })
    }

    const isTokenBlacklisted = await tokenBlacklist.findOne({ token })

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: 'Token is invalid',
            success: false,
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETS)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token',
            success: false,
        })
    }
}