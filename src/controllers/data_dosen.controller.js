import { Op } from "sequelize";
import db from "../database/models/model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { catchError } from "../utils/catchError.js";

const reverseSlugify = (slug) => {
    if (typeof slug !== 'string') return '';
    return slug.replace(/-/g, ' ');
};

const getDataDosen = catchAsync (async (req, res, next) => {
    const {fakultas, prodi, nidn, nama, limit = 10, offset = 0, sort = 'nidn', order = 'ASC', search} = req.query;
    
    let whereFakultas = {};
    let whereProdi = {};
    let whereDosen = {};

    if (fakultas){
        whereFakultas.nm_fakultas = {
            [Op.iLike]: `%${fakultas}%`
        };
    }

    if (prodi){
        whereProdi.nm_prodi = {
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
            as: 'ProdibyFak',
            where: whereFakultas,
            required: true
        })
    }

    if (prodi){
        include.push({
            model: db.ProgramStudi,
            as: 'ProdibyFak',
            where: whereProdi,
            required: true
        })
    }
    
    const dataDosen = await db.DataDosen.findAll({
        where : whereDosen,
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