import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

import db from '../database/models/model.js';
import { catchAsync } from "../utils/catchAsync.js";
import { catchError } from "../utils/catchError.js";

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};

const login = catchAsync(async (req, res, next) => {
    const { nidn, password } = req.body;
    if (!nidn || !password) {
        return next(new catchError('Nidn dan kata sandi harus diisi', 400));
    }
    // cek user
    const user = await db.User.findOne({ where: { nidn } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new catchError('Nidn atau kata sandi tidak sesuai', 401));
    }
    // Ambil data dosen dan relasinya
    const dosen = await db.DataDosen.findOne({
        where: { nidn },
        include: [
            {
                model: db.Fakultas,
                as: 'DosenbyFak',
            },
            {
                model: db.ProgramStudi,
                as: 'DosenbyProdi',
            }
        ]
    });
    // Cek data dosen
    if (!dosen) {
        return next(new catchError('Data dosen tidak ditemukan', 404));
    }
    let redirectPath = '';
    // Dosen
    if (user.role === 'dosen') {
        redirectPath = `/api/dosen?nidn=${dosen.nidn}`;
    }
    // Admin
    if (user.role === 'admin') {
        redirectPath = '/api/users';
    }
    // Dekan
    const dekanFak = await db.Fakultas.findOne({
        where: { kode: dosen.fakultas } 
    })
    if (user.role === 'dekan') {
        redirectPath = `/api/fakultas?fakultas=${dekanFak.kode}`
    }
    // Kaprodi
    const kaProdi = await db.ProgramStudi.findOne({
        where: { kode: dosen.prodi }
    })
    if (user.role === 'kaprodi') {
        redirectPath = `/api/programstudi?prodi=${kaProdi.kode}`
    }
    // Generate token dengan kode fakultas dan prodi
    const token = generateToken({
        nidn: user.nidn,
        role: user.role,
        fakultas: dekanFak.kode,
        prodi: kaProdi.kode,
    });
    return res
        .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax", // or 'None' if cross-site over HTTPS
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        })
        .status(200).json({
            status: 'success',
            token,
            user: {
                nidn: user.nidn,
                role: user.role,
                fakultas: dekanFak.kode,
                prodi: kaProdi.kode
            },
            redirectPath
        });
});

const authentication = catchAsync (async (req, res, next) => {
    let token;
    // 1. Try from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }
    // 2. Fallback to cookie
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // 3. error handling if token was empty
    if (!token) {
        return next(new catchError("Unauthorized: No token provided", 401));
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const freshUser = await db.User.findByPk(decoded.nidn);
        // Simpan payload token ke req.user
        req.user = decoded;
        req.db = { User: freshUser };
        next();
    } catch (err) {
        return next (new catchError('Invalid or expired token', 401));
    }
});

const restrictToRole = (...role) => {
    const checkPermission = (req, res, next) => {
        if (!role.includes(req.db.User.role)) {
            return next (new catchError ('You dont have permission to perform this action', 403));
        }
        return next();
    };
    return checkPermission;
};

export { login, authentication, restrictToRole }