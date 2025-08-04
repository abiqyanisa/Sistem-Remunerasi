import 'dotenv/config';
import db from '../database/models/model.js';
import { catchAsync } from "../utils/catchAsync.js";
import { catchError } from "../utils/catchError.js";

const validRoles = db.User.getAttributes().role.values;

const getAllUser = catchAsync(async (req, res, next) => {
    const { nidn: userNidn, role, limit = 10, offset = 0, sort = 'nidn', order = 'ASC' } = req.query;
    // get user by nidn
    if (userNidn) {
        const dataUser = await db.User.findByPk(userNidn, {
            include: {
                model: db.DataDosen,
                as: 'dataDosen'
            }
        });
        if (!dataUser) {
            return next(new catchError('Pengguna tidak ditemukan', 404));
        }
        return res.json({
            status: 'sukses',
            dataUser
        });
    }
    // get user by role
    const whereCondition = {};
    if (role) {
        whereCondition.role = role; 
    }
    // get user
    const Users = await db.User.findAll({
        where: whereCondition,
        include: {
            model: db.DataDosen,
            as: 'dataDosen',
            required: true
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort, order.toUpperCase()]] 
    });
    const daftarUser = Users.map(user => user.toJSON());
    return res.json({
        status: 'sukses',
        daftarUser
    });
});

const addUser = catchAsync (async (req, res, next) => {
    const body = req.body;
    if (!body) {
        return next(new catchError('Silakan isi formulir dengan lengkap', 400))
    };
    // cek apakah nidn yang dimasukkan sesuai dengan nidn data dosen
    const checkNidn = await db.DataDosen.findByPk(body.nidn)
    if (!checkNidn) {
        return next (new catchError('Silakan masukkan NIDN yang sesuai dengan data dosen', 400))
    }
    // cek apakah role sesuai opsi
    if(!['admin', 'dekan', 'kaprodi', 'dosen'].includes(body.role)) {
        throw new catchError(`Peran tidak valid. Opsi: ${validRoles.join(', ')}`, 400)
    };
    // create new user
    const newUser = await db.User.create({
        nidn: body.nidn,
        role: body.role,
        password: body.password,
        confirmPassword: body.confirmPassword,
    });
    return res.status(201).json({
        status: 'sukses',
        newUser
    })
});

const updateUser = catchAsync (async (req, res, next) => {
    const userNidn = req.query.nidn;
    const body = req.body;
    // get user by nidn
    const dataUser = await db.User.findByPk(userNidn);
    // cek data user
    if (!dataUser) {
        return next (new catchError('Pengguna tidak ditemukan', 404));
    }
    // cek apakah role terbaru sesuai opsi
    if (!validRoles.includes(body.role)) {
        return next(new catchError(`Peran tidak valid. Opsi: ${validRoles.join(', ')}`, 400));
    }
    // ganti menjadi role terbaru
    dataUser.role = body.role;
    // Jika password diisi, validasi dan update
    if (body.password || body.confirmPassword) {
        dataUser.password = body.password;
        dataUser.confirmPassword = body.confirmPassword;
    }
    const updatedDataUser = await dataUser.save();
    return res.status(200).json({
        status: 'sukses',
        updatedDataUser
    })
});

const deleteUser = catchAsync (async (req, res, next) => {
    const userNidn = req.query.nidn;
    // get user by nidn
    const dataUser = await db.User.findByPk(userNidn);
    // cek data user
    if (!dataUser) {
        return next (new catchError('Pengguna tidak ditemukan', 404));
    }
    // hapus user
    await dataUser.destroy();
    return res.status(200).json({
        status: 'sukses',
        message: 'Pengguna berhasil dihapus'
    })
});

export { getAllUser, addUser, updateUser, deleteUser }