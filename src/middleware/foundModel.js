import db from "../database/models/model.js";
import { catchError } from "../utils/catchError.js";

const filterDosenByFakultas = async (req, res, next) => {
    try {
        const { fakultas } = req.query;

        if (!fakultas) return next(); // jika tidak ada fakultas, lanjutkan ke handler

        const foundDosenbyFak = await db.DataDosen.findAll({
        where: { fakultas },
        include: {
            model: db.Fakultas,
            as: 'DosenbyFak',
        },
        });

        // console.log(foundDosenbyFak)

        if (!foundDosenbyFak || foundDosenbyFak.length === 0) {
        return next(new catchError('Dosen in that Fakultas not found', 404));
        }

        req.foundDosenbyFak = foundDosenbyFak;
        req.nidnListByFak = foundDosenbyFak.map(dosen => dosen.nidn.trim());

        next();
    } catch (error) {
        next(error);
    }
};

const filterDosenByProdi = async (req, res, next) => {
    try {
        const { prodi } = req.query;

        if (!prodi) return next(); // jika tidak ada fakultas, lanjutkan ke handler

        const foundDosenbyProdi = await db.DataDosen.findAll({
        where: { prodi },
        include: {
            model: db.ProgramStudi,
            as: 'DosenbyProdi',
        },
        });

        // console.log(foundDosenbyProdi)

        if (!foundDosenbyProdi || foundDosenbyProdi.length === 0) {
        return next(new catchError('Dosen in that Prodi not found', 404));
        }

        req.foundDosenbyProdi = foundDosenbyProdi;
        req.nidnListByProdi = foundDosenbyProdi.map(dosen => dosen.nidn.trim());

        next();
    } catch (error) {
        next(error);
    }
};

const filterDosenByKin = async (req, res, next) => {
    try {
        const { nidn } = req.query;

        if (!nidn) return next(); // jika tidak ada fakultas, lanjutkan ke handler

        const foundDosenbyKin = await db.DataDosen.findOne({
            where: { nidn },
            include: {
                model: db.KinSwmp,
                as: 'Dosen_Kin',
            },
        });

        if (!foundDosenbyKin || foundDosenbyKin.length === 0) {
        return next(new catchError('Dosen not found', 404));
        }

        req.foundDosenbyKin = foundDosenbyKin;
        req.nidnListByKin = foundDosenbyKin.nidn.trim();

        next();
    } catch (error) {
        next(error);
    }
};

export { filterDosenByFakultas, filterDosenByProdi, filterDosenByKin };
