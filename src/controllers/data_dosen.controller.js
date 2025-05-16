import { Op } from "sequelize";
import db from "../database/models/model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { catchError } from "../utils/catchError.js";

const reverseSlugify = (slug) => {
    if (typeof slug !== 'string') return '';
    return slug.replace(/-/g, ' ');
};

const getDaftarDosen = catchAsync (async (req, res, next) => {
    const namaProdi = reverseSlugify(req.params.prodi);
    const dataProdi = await db.ProgramStudi.findOne({
        where: {nm_prodi: {[Op.iLike]: namaProdi}}
    });

    if (!dataProdi) {
        return next (new catchError('Program Studi not found', 400))
    }

    const daftarDosen = await db.DataDosen.findAll({ 
        where: {prodi: dataProdi.kode}, 
    });

    return res.json({
        status: 'success',
        daftarDosen: daftarDosen
    });
});

const getDataDosen = catchAsync (async (req, res, next) => {
    const nidnDosen = reverseSlugify(req.params.nidn);
    const dataDosen = await db.DataDosen.findOne({
        where: {nidn: nidnDosen}
    });

    if (!dataDosen) {
        return next (new catchError('Lecturer not found', 400))
    }

    return res.json({
        status: 'success',
        dataDosen: dataDosen
    });
});

export { getDaftarDosen, getDataDosen }