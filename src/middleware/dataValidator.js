import db from "../database/models/model.js";
import { catchError } from "../utils/catchError.js";

// Validasi fakultas
export default async function validateFakProdiNidn(req, res, next) {
    const { fakultas, prodi, nidn } = req.query;

    if (fakultas) {
        const foundFakultas = await db.Fakultas.findOne({ where: { kode: fakultas } });
        if (!foundFakultas) {
            return next(new catchError(`Kode fakultas '${fakultas}' tidak ditemukan`, 404));
        }
    }

    if (prodi) {
        const foundProdi = await db.ProgramStudi.findOne({ where: { kode: prodi } });
        if (!foundProdi) {
            return next(new catchError(`Kode program studi '${prodi}' tidak ditemukan`, 404));
        }
    }

    if (nidn) {
        const foundNidn = await db.DataDosen.findOne({ where: { nidn } });
        if (!foundNidn) {
            return next(new catchError(`NIDN dosen '${nidn}' tidak ditemukan`, 404));
        }
    }

    next();
}