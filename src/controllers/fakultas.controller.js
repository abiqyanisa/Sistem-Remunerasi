import { Op } from "sequelize";
import db from "../database/models/model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { catchError } from "../utils/catchError.js";

const getAllBidangKinerjaRemun = catchAsync (async (req, res, next) => {
    const dataBidang = await db.BidangKinerjaRemun.findAll();
    return res.json({
        status: 'success',
        data: dataBidang
    });
});

const getDataFakultas = catchAsync (async (req, res, next) => {
    const singkatanFak = req.params.fak;
    const dataFakultas = await db.Fakultas.findOne({
        where: {singkatan: {[Op.iLike]: singkatanFak}}
    });

    if (!dataFakultas) {
        return next (new catchError('Fakultas not found', 400))
    }

    return res.json({
        status: 'success',
        dataFakultas: dataFakultas
    });
});

export { getAllBidangKinerjaRemun, getDataFakultas };