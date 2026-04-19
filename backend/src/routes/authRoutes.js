import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();
const getBaseUrl = (url, fallback) => (url || fallback).replace(/\/+$/, '');
const backendBaseUrl = getBaseUrl(process.env.BACKEND_URL, 'http://localhost:3000');
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL || `${backendBaseUrl}/api/auth/google/callback`;

// Helper to generate token after social login
const sendTokenResponse = (user, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
};

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Google OAuth
router.get('/google', (req, res, next) => {
    console.log('[DEBUG] Google Auth Triggered. Expected callback URL to match Google Console:', googleCallbackUrl);
    next();
}, passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' 
}));
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => sendTokenResponse(req.user, res)
);

export default router;
