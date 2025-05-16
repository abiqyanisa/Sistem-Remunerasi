import dotenv from 'dotenv';
dotenv.config();
import db from '../database/models/model.js';

import { catchAsync } from "../utils/catchAsync.js";
import { catchError } from "../utils/catchError.js";

const getAllUser = catchAsync (async (req, res, next) => {
    const dataUser = await db.User.findAll();

    return res.json({
        status: 'success',
        data: dataUser
    });
});

const getUserByNidn = catchAsync (async (req, res, next) => {
    const userNidn = req.params.nidn;
    const dataUser = await db.User.findByPk(userNidn);

    if (!dataUser) {
        return next (new catchError('User not found', 404));
    }

    return res.json({
        status: 'success',
        data: dataUser
    });
});

const addUser = catchAsync (async (req, res, next) => {
    const body = req.body;
    
    const newUser = await db.User.create({
        nidn: body.nidn,
        role: body.role,
        password: body.password,
        confirmPassword: body.confirmPassword,
    });
    
    if (!newUser) {
        return next(new catchError('Failed to create new user', 400))
    };
    
    if(!['admin', 'dekan', 'kaprodi', 'dosen'].includes(body.role)) {
        throw new catchError('Invalid role', 400)
    };

    return res.status(201).json({
        status: 'success',
        data: newUser
    })
});

const updateUser = catchAsync (async (req, res, next) => {
    const userNidn = req.params.nidn;
    const body = req.body;

    const dataUser = await db.User.findByPk(userNidn);

    if (!dataUser) {
        return next (new catchError('User not found', 404));
    }

    const validRoles = db.User.getAttributes().role.values;
    if (!validRoles.includes(body.role)) {
        return next(new catchError(`Invalid role. Options: ${validRoles.join(', ')}`, 400));
    }

    dataUser.role = body.role;

    const updatedDataUser = await dataUser.save();
    return res.status(200).json({
        status: 'success',
        data: updatedDataUser
    })
});

const deleteUser = catchAsync (async (req, res, next) => {
    const userNidn = req.params.nidn;

    const dataUser = await db.User.findByPk(userNidn);

    if (!dataUser) {
        return next (new catchError('User not found', 404));
    }

    await dataUser.destroy();
    return res.status(200).json({
        status: 'success',
        data: 'User deleted successfully'
    })
});

export { getAllUser, getUserByNidn, addUser, updateUser, deleteUser }