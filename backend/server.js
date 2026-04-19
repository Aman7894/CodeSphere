import dotenv from 'dotenv';
// Load env vars FIRST
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { YSocketIO } from 'y-socket.io/dist/server';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import codeRoutes from './src/routes/codeRoutes.js';
import codeforcesRoutes from './src/routes/codeforcesRoutes.js';
import './src/config/passport.js'; // Initialize passport config

const validateHttpUrlEnv = (key) => {
    const value = process.env[key];
    if (!value) return;

    if (!/^https?:\/\//i.test(value)) {
        throw new Error(
            `[ENV CONFIG ERROR] ${key} must start with http:// or https://. Current value: "${value}". ` +
            'If you intended localhost, use http://localhost:<port>.'
        );
    }

    try {
        // eslint-disable-next-line no-new
        new URL(value);
    } catch {
        throw new Error(`[ENV CONFIG ERROR] ${key} is not a valid URL: "${value}"`);
    }
};

const validateAuthConfig = () => {
    const keysToValidate = [
        'FRONTEND_URL',
        'BACKEND_URL',
        'GOOGLE_CALLBACK_URL',
        'GITHUB_CALLBACK_URL'
    ];
    keysToValidate.forEach(validateHttpUrlEnv);
};

validateAuthConfig();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.FRONTEND_URL, 
            'http://localhost:4000', 'http://127.0.0.1:4000',
            'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176',
            'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175', 'http://127.0.0.1:5176'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(cookieParser());
app.use(passport.initialize());

// Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: [
            "http://localhost:4000", "http://127.0.0.1:4000",
            "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176",
            "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175", "http://127.0.0.1:5176",
            process.env.FRONTEND_URL
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

const ySocketIO = new YSocketIO(io);
ySocketIO.initialize();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/cf', codeforcesRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        message: "Server is healthy",
        success: true
    });
});

// Error Handling Middleware

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
