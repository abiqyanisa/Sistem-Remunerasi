import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { authRouter } from './routes/auth.route.js';
import { userRouter } from './routes/user.route.js';
import { remunerasiRouter } from './routes/remunerasi.route.js';
import { catchAsync } from './utils/catchAsync.js';
import { catchError } from './utils/catchError.js';
import { globalErrorHandler } from './controllers/error.controller.js';
import trimResponse from './middleware/trimResponse.js';
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(trimResponse);
app.use(cookieParser())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api', remunerasiRouter)

// Server
app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running at PORT ${process.env.APP_PORT}`)
});

// Error Handling
app.use(catchAsync (async(req, res, next) => {
    throw new catchError(`can't find ${req.originalUrl} on this server`, 404);
}));

app.use(globalErrorHandler);