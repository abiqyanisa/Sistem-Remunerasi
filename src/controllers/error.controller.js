import dotenv from 'dotenv';
dotenv.config();

import { catchError } from "../utils/catchError.js";

const sendErrorDev = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    return res.status(statusCode).json({
        status,
        message,
        stack,
    });
};

const sendErrorProd = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    if (error.isOperational) {
        return res.status(statusCode).json({
            status,
            message,
        });
    };

    console.log(error.name, error.message, stack);
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
    });
    
};

const globalErrorHandler = (err, req, res, next) => {
    if (err.name === 'JsonWebTokenError') {
        err = new catchError('Invalid token', 401);
    };
    if (err.name === 'SequelizeValidationError') {
        err = new catchError(err.errors[0].message, 400);
    };
    if (err.name === 'SequelizeUniqueConstraintError') {
        err = new catchError(err.errors[0].message, 400);
    };
    if (process.env.NODE_ENV.trim() === 'development') {
        return sendErrorDev(err, res);
    };
    sendErrorProd(err, res);
};

export { globalErrorHandler }