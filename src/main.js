import dotenv from 'dotenv';
dotenv.config();

import serverless from 'serverless-http'
import express from 'express';
import cors from "cors";
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import trimResponse from './middleware/trimResponse.js';
import { sequelize } from './config/database.js';
import { authRouter } from './routes/auth.route.js';
import { userRouter } from './routes/user.route.js';
import { remunerasiRouter } from './routes/remunerasi.route.js';
import { catchAsync } from './utils/catchAsync.js';
import { catchError } from './utils/catchError.js';
import { globalErrorHandler } from './controllers/error.controller.js';

const app = express();
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(trimResponse);
app.use(cookieParser());
app.use(helmet());
app.disable('x-powered-by');

// Routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api', remunerasiRouter)
app.get('/', (req, res) => {
    res.json({ message: 'Hello from API' });
});

// Server
sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Database connection error:', err));
// Development mode
if (process.env.NODE_ENV !== 'production') {
    app.listen(process.env.APP_PORT, () => {
        console.log(`Server is running locally at PORT ${process.env.APP_PORT}`);
    });
}
// Production mode
else {
    app.listen(process.env.APP_PORT, '0.0.0.0', () => {
        console.log(`Server is running in production at http://${process.env.AWS_HOST || '0.0.0.0'}:${process.env.APP_PORT}`);
    });
}

// Error Handling
app.use(catchAsync (async(req, res, next) => {
    throw new catchError(`URL ${req.originalUrl} tidak ditemukan`, 404);
}));
app.use(globalErrorHandler);

// Serverless
export const handler = serverless(app);
