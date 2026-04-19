import dotenv from 'dotenv';
dotenv.config();

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import passport from 'passport';
import User from '../models/User.js';

const getBaseUrl = (url, fallback) => (url || fallback).replace(/\/+$/, '');
const backendBaseUrl = getBaseUrl(process.env.BACKEND_URL, 'http://localhost:3000');
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL || `${backendBaseUrl}/api/auth/google/callback`;
const githubCallbackUrl = process.env.GITHUB_CALLBACK_URL || `${backendBaseUrl}/api/auth/github/callback`;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: googleCallbackUrl,
    proxy: true
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        user = await User.create({
            username: profile.displayName || profile.emails[0].value.split('@')[0],
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar: profile.photos[0].value
        });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: githubCallbackUrl,
    proxy: true
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id });
        if (user) return done(null, user);

        user = await User.create({
            username: profile.username || profile.displayName,
            email: profile.emails ? profile.emails[0].value : `${profile.username}@github.com`,
            githubId: profile.id,
            avatar: profile.photos[0].value
        });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

// We don't need serialize/deserialize if we use JWT, but passport might complain
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});

export default passport;
