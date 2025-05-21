import { Op } from "sequelize";
import db from "../database/models/model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { catchError } from "../utils/catchError.js";

const getDataFakultas = catchAsync (async (req, res, next) => {
    const {fakultas, prodi, nidn, limit = 10, offset = 0, sort = 'kode', order = 'ASC', search} = req.query;

    let whereFakultas = {};
    let whereProdi = {};
    let whereDosen = {};

    if (fakultas){
        whereFakultas.kode = {
            [Op.iLike]: `%${fakultas}%`
        };
    }

    if (prodi){
        whereProdi.kode = {
            [Op.iLike]: `%${prodi}%`
        };
    } 

    if (nidn){
        whereDosen.nidn = nidn;
    }

    if (search){
        whereFakultas.nm_fakultas = {
            [Op.iLike]: `%${search}%`
        };
    }

    const include = [];

    if (prodi){
        include.push({
            model: db.ProgramStudi,
            as: 'ProdibyFak',
            where: whereProdi,
            required: true
        })
    }

    if (nidn){
        include.push({
            model: db.DataDosen,
            as: 'DosenbyFak',
            where: whereDosen,
            required: true
        })
    }

    const dataFakultas = await db.Fakultas.findAll({
        where : whereFakultas,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort, order.toUpperCase()]],
        include: include
    });

    if (dataFakultas.length === 0) {
        return next (new catchError('Data not found', 400))
    }

    return res.json({
        status: 'success',
        dataFakultas: dataFakultas
    });
});

export { getDataFakultas }; 