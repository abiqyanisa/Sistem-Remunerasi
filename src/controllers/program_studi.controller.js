import { Op } from "sequelize";
import db from "../database/models/model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { catchError } from "../utils/catchError.js";

const reverseSlugify = (slug) => {
    if (typeof slug !== 'string') return '';
    return slug.replace(/-/g, ' ');
};

const getDaftarProdi = catchAsync (async (req, res, next) => {
    const singkatanFak = req.params.fak;
    const dataFakultas = await db.Fakultas.findOne({
        where: {singkatan: {[Op.iLike]: singkatanFak}}
    });

    if (!dataFakultas) {
        return next (new catchError('Fakultas not found', 400))
    }

    const daftarProdi = await db.ProgramStudi.findAll({ 
        where: {id_fak: dataFakultas.kode}, 
    });

    return res.json({
        status: 'success',
        daftarProdi: daftarProdi
    });
});

const getDataProdi = catchAsync (async (req, res, next) => {
    const namaProdi = reverseSlugify(req.params.prodi);
    const dataProdi = await db.ProgramStudi.findOne({
        where: {nm_prodi: {[Op.iLike]: namaProdi}}
    });

    if (!dataProdi) {
        return next (new catchError('Program studi not found', 400))
    }

    return res.json({
        status: 'success',
        dataProdi: dataProdi
    });
});

export { getDaftarProdi, getDataProdi }