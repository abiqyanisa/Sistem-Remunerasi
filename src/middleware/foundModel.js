import db from "../database/models/model.js";
import { catchError } from "../utils/catchError.js";
import { validateFakultas, validateNidn, validateProdi } from "./dataValidator.js";

const filterDosenByFakultas = async (req, res, next) => {
    try {
        const { fakultas } = req.query;

        if (!fakultas) return next(); // jika tidak ada lanjutkan ke handler

        if (!(await validateFakultas(fakultas))) {
            return next(new catchError(`Faculty's code '${fakultas}' not found`, 404));
        }

        const foundDosenbyFak = await db.DataDosen.findAll({
            where: { fakultas },
            include: {
                model: db.Fakultas,
                as: 'DosenbyFak',
            },
        });

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

        if (!prodi) return next(); // jika tidak ada lanjutkan ke handler

        if (!(await validateProdi(prodi))) {
            return next(new catchError(`Study Program's code '${prodi}' not found`, 404));
        }

        const foundDosenbyProdi = await db.DataDosen.findAll({
            where: { prodi },
            include: {
                model: db.ProgramStudi,
                as: 'DosenbyProdi',
            },
        });

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

        if (!nidn) return next(); // jika tidak ada lanjutkan ke handler

        if (!(await validateNidn(nidn))) {
            return next(new catchError(`Lecturer's NIDN '${nidn}' not found`, 404));
        }

        const foundDosenbyKin = await db.DataDosen.findOne({
            where: { nidn },
            include: {
                model: db.KinSwmp,
                as: 'Dosen_Kin',
            },
        });

        req.foundDosenbyKin = foundDosenbyKin;
        req.nidnListByKin = foundDosenbyKin.nidn.trim();

        next();
    } catch (error) {
        next(error);
    }
};

export { filterDosenByFakultas, filterDosenByProdi, filterDosenByKin };
