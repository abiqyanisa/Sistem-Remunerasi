import { Op } from "sequelize";
import db from "../database/models/model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { catchError } from "../utils/catchError.js";

const getDataProdi = catchAsync (async (req, res, next) => {
    const {fakultas, prodi, nidn, limit = 10, offset = 0, sort = 'nm_prodi', order = 'ASC', search} = req.query;
    
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
        whereProdi.nm_prodi = {
            [Op.iLike]: `%${search}%`
        };
    }

    const include = [];

    if (fakultas){
        include.push({
            model: db.Fakultas,
            as: 'ProdibyFak',
            attributes: [], 
            where: fakultas ? { kode: { [Op.iLike]: `%${fakultas}%` } } : undefined,
            required: !!fakultas
        })
    }

    if (nidn){
        include.push({
            model: db.DataDosen,
            as: 'DosenbyProdi',
            where: whereDosen,
            required: true
        })
    }

    const dataProdi = await db.ProgramStudi.findAll({
        where : whereProdi,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort, order.toUpperCase()]],
        include: include
    });

    if (dataProdi.length === 0) {
        return next (new catchError('Data not found', 400))
    }

    return res.json({
        status: 'success',
        dataProdi : dataProdi
    });
});

export { getDataProdi }