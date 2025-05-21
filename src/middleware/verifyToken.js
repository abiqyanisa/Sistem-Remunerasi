import jwt from "jsonwebtoken";
import { catchError } from "../utils/catchError.js";

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new catchError("Unauthorized: No token provided", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return next(new catchError("Unauthorized: Invalid token", 401));
    }
};

export default verifyToken;
