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
    const user = await db.User.findByPk(nidn);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new catchError('Nidn atau kata sandi salah', 401));
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
    // Fakultas
    const dosenFak = await db.Fakultas.findOne({
        where: { kode: dosen.fakultas } 
    })
    // Prodi
    const dosenProdi = await db.ProgramStudi.findOne({
        where: { kode: dosen.prodi }
    })
    // Generate token dengan kode fakultas dan prodi
    const token = generateToken({
        nidn: user.nidn,
        role: user.role,
        fakultas: dosenFak.kode,
        prodi: dosenProdi.kode
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
                fakultas: dosenFak.kode,
                prodi: dosenProdi.kode
            }
        });
});

const authentication = catchAsync (async (req, res, next) => {
    let token;
    // 1. Try from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(' ')[1];
    }
    // 2. Fallback to cookie
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // 3. error handling if token was empty
    if (!token) {
        return next(new catchError("Silakan log in terlebih dahulu", 401));
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const tokenUser = await db.User.findByPk(decoded.nidn);
        // Simpan payload token ke req.user
        req.user = decoded;
        req.db = { User: tokenUser };
        next();
    } catch (err) {
        return next (new catchError('Sesi Anda telah berakhir. Silakan masuk kembali', 401));
    }
});

const restrictToRole = (...role) => {
    const checkPermission = (req, res, next) => {
        if (!role.includes(req.db.User.role)) {
            return next (new catchError ('Akses ditolak. Peran Anda tidak diizinkan mengakses fitur ini', 403));
        }
        return next();
    };
    return checkPermission;
};

export { login, authentication, restrictToRole }