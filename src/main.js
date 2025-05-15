import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { authRouter } from './routes/auth.route.js';
import { userRouter } from './routes/user.route.js';
import { remunerasiRouter } from './routes/remunerasi.route.js';
import { catchAsync } from './utils/catchAsync.js';
import { catchError } from './utils/catchError.js';
import { globalErrorHandler } from './controllers/error.controller.js';
import trimResponseMiddleware from './middleware/trimResponse.js';

const app = express();
app.use(express.json());
app.use(trimResponseMiddleware);

// Routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api', remunerasiRouter)

// Error Handling
app.use(catchAsync (async(req, res, next) => {
    throw new catchError(`can't find ${req.originalUrl} on this server`, 404);
}));

app.use(globalErrorHandler);

// Server
app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running at PORT ${process.env.APP_PORT}`)
});