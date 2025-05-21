import { Op } from "sequelize";
import db from "../database/models/model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { catchError } from "../utils/catchError.js";

const getDataDosen = catchAsync (async (req, res, next) => {
    const {fakultas, prodi, nidn, limit = 10, offset = 0, sort = 'nidn', order = 'ASC', search} = req.query;
    
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
        whereDosen.nama = {
            [Op.iLike]: `%${search}%`
        };
    }

    const include = [];
    
    if (fakultas){
        include.push({
            model: db.Fakultas,
            as: 'DosenbyFak',
            attributes: [], 
            where: fakultas ? { kode: { [Op.iLike]: `%${fakultas}%` } } : undefined,
            required: !!fakultas
        })
    }

    if (prodi){
        include.push({
            model: db.ProgramStudi,
            as: 'DosenbyProdi',
            attributes: [], 
            where: prodi ? { kode: { [Op.iLike]: `%${prodi}%` } } : undefined,
            required: !!prodi
        })
    }

    const dataDosen = await db.DataDosen.findAll({
        where: whereDosen,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort, order.toUpperCase()]],
        include: include
    });

    if (dataDosen.length === 0) {
        return next (new catchError('Data not found', 400))
    }

    return res.json({
        status: 'success',
        dataDosen : dataDosen
    });
});


export { getDataDosen }