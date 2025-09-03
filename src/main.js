import dotenv from 'dotenv';
import express from 'express';
import cors from "cors";
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import trimResponse from './middleware/trimResponse.js';
import { authRouter } from './routes/auth.route.js';
import { userRouter } from './routes/user.route.js';
import { remunerasiRouter } from './routes/remunerasi.route.js';
import { catchAsync } from './utils/catchAsync.js';
import { catchError } from './utils/catchError.js';
import { globalErrorHandler } from './controllers/error.controller.js';

dotenv.config();
const app = express();
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
<<<<<<< HEAD
app.use(express.json());
app.use(trimResponse);
app.use(cookieParser());
app.use(helmet());
app.disable('x-powered-by');
=======
app.use(express.json()); //body request JSON
app.use(trimResponse); //Membersihkan output
app.use(cookieParser()) //Membaca cookie dari request
app.use(helmet()); //Menambah keamanan dengan header HTTP
app.disable('x-powered-by'); 
>>>>>>> c0348a3d52d94569a9a92a78f37e6f1deccc9bb3

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
    throw new catchError(`URL ${req.originalUrl} tidak ditemukan`, 404);
}));
<<<<<<< HEAD
app.use(globalErrorHandler);
=======

// Menangani semua error global 
app.use(globalErrorHandler);
>>>>>>> c0348a3d52d94569a9a92a78f37e6f1deccc9bb3
