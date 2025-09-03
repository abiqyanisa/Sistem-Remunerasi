import db from "../database/models/model.js";

const filterDosenByFakultas = async (req, res, next) => {
    try {
        const { fakultas } = req.query;

        if (!fakultas) return next(); // jika tidak ada lanjutkan ke handler

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
