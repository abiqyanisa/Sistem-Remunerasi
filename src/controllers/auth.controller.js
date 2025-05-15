import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import slugify from 'slugify';

import db from '../database/models/model.js';
import { catchAsync } from "../utils/catchAsync.js";
import { catchError } from "../utils/catchError.js";

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};

const reverseSlugify = (slug) => {
    if (typeof slug !== 'string') return '';
    return slug.replace(/-/g, ' ');
};

const login = catchAsync(async (req, res, next) => {
    const { nidn, password } = req.body;

    if (!nidn || !password) {
        return next(new catchError('Please provide nidn and password', 400));
    }

    const user = await db.User.findOne({ where: { nidn } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new catchError('Incorrect nidn or password', 401));
    }
    
    // 🟢 Jika admin langsung return
    if (user.role === 'admin') {
        const token = generateToken({
            nidn: user.nidn,
            role: user.role,
        });
        return res.json({
            status: 'success',
            token,
            redirectPath: '/api/users'
        });
    }

    // Ambil data dosen dan relasinya
    const dosen = await db.DataDosen.findOne({
        where: { nidn },
        include: [
            {
                model: db.Fakultas,
                as: 'Fakultas-Dekan',
            },
            {
                model: db.ProgramStudi,
                as: 'Prodi-Kaprodi',
            }
        ]
    });

    if (!dosen) {
        return next(new catchError('Data dosen tidak ditemukan', 404));
    }

    // 🔁 Dosen
    let redirectPath = '/api/dosen';

    // 🔁 Dekan
    const dekanFak = await db.Fakultas.findOne({
        where: { kode: dosen.fakultas } 
    })
    const slugFak = dekanFak.singkatan 
    if (user.role === 'dekan') {
        redirectPath = `/api/fakultas/${slugify(slugFak || '', { lower: true })}`;
    }
    
    // 🔁 Kaprodi
    const kaProdi = await db.ProgramStudi.findOne({
        where: { kode: dosen.prodi }
    })
    const slugProdi = kaProdi.nm_prodi
    if (user.role === 'kaprodi') {
        redirectPath = `/api/programstudi/${slugify(slugProdi || '', { lower: true })}`;
    }

    // ⬇️ Generate token dengan kode fakultas dan prodi
    const token = generateToken({
        nidn: user.nidn,
        role: user.role,
        fakultas: slugFak,
        prodi: slugProdi,
    });

    return res.status(200).json({
        status: 'success',
        token,
        user: {
            nidn: user.nidn,
            role: user.role,
            fakultas: slugFak,
            prodi: slugProdi
        },
        redirectPath
    });
});


const authentication = catchAsync (async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return next(new catchError('Unauthorized: No token provided', 401))
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const freshUser = await db.User.findByPk(decoded.nidn);
        // ✅ Simpan payload token ke req.user
        req.user = decoded;
        req.db = { User: freshUser };
        next();
    } catch (err) {
        return next (new catchError('Invalid or expired token', 403));
    }
});

const restrictToRole = (...role) => {
    const checkPermission = (req, res, next) => {
        if (!role.includes(req.db.User.role)) {
            return next (new catchError (
                'You dont have permission to perform this action', 
                403
            ));
        }
        return next();
    };
    return checkPermission;
};

const authorizeScope = (options) => {
    return (req, res, next) => {
        const { role, fakultas, prodi } = req.user;

        // Ambil parameter dari URL
        const reqFak = reverseSlugify(req.params.fak);     
        const reqProdi = reverseSlugify(req.params.prodi);

        // Batasi akses dekan ke fakultas-nya saja
        if (role === 'dekan') {
            if (!reqFak || reqFak !== fakultas.toLowerCase()) {
                return next(new catchError('Access Denied: you cannot access another faculties', 403));
            }
        }

        // Batasi akses kaprodi ke prodi-nya saja
        if (role === 'kaprodi') {
        if (!reqProdi || reqProdi !== prodi.toLowerCase()) {
            return next(new catchError('Access Denied: you cannot access another study programs', 403));
        }
        }

        // Admin atau user valid, lanjut
        next();
    };
};

export { 
    login, 
    authentication, 
    restrictToRole, 
    //authorizeScope
}