import { Op } from 'sequelize';
import db from '../database/models/model.js';
import { catchError } from '../utils/catchError.js';
import slugify from 'slugify';

const reverseSlugify = (slug) => {
    if (typeof slug !== 'string') return '';
    return slug.replace(/-/g, ' ');
};

const authorizeScope = () => {
    return async (req, res, next) => {
        const { role, fakultas, prodi, nidn } = req.user;

        const reqFak = req.params.fak ? reverseSlugify(req.params.fak).toLowerCase() : null;
        const reqProdi = req.params.prodi ? reverseSlugify(req.params.prodi).toLowerCase() : null;
        const reqNidn = req.params.nidn || null;

        // Dosen hanya bisa akses datanya sendiri
        if (role === 'dosen') {
            if (!reqNidn || reqNidn !== nidn) {
                return next(new catchError('Access Denied: not your profile', 403));
            }
            return next();
        }
        // console.log("reqProdi",reqProdi)

        // const allProdi = await db.ProgramStudi.findAll({
        //     include: {
        //         model: db.Fakultas,
        //         as: 'FakProdi',
        //     }
        // });

        // console.log(allProdi)

        // const slugProdi = ''

        // const foundProdi = allProdi.find((prodi) => {
        //     const slug = slugify(prodi.nm_prodi, { lower: true, strict: true });
        //     console.log(slug)
        //     return slug === reqProdi;
        // });
        // console.log("foundProdi", foundProdi)
        // console.log("reqProdi", reqProdi)

        const foundProdi = await db.ProgramStudi.findOne({
            where: { nm_prodi: {[Op.iLike]: reqProdi }},
            include: {
            model: db.Fakultas,
            as: 'FakProdi',
            }
        });

        // console.log(foundProdi)
        
        // Kaprodi akses ke program studi yang ia pimpin
        if (role === 'kaprodi') {
            if (!foundProdi || reqProdi !== prodi.toLowerCase()) {
                return next(new catchError('Access Denied: not your study program', 403));
            }

            // Jika akses ke dosen, tidak perlu validasi nidn karena semua dosen dalam prodi
            return next();
        }

        // ✅ Dekan cek fakultas
        if (role === 'dekan') {
            if (reqFak && reqFak !== fakultas.toLowerCase()) {
                return next(new catchError('Access Denied: not your faculty', 403));
            }

            
            // ✅ Jika ada reqProdi, pastikan prodi tersebut memang milik fakultasnya
            if (reqProdi) {

                // console.log(reqProdi, foundProdi.nm_prodi)
                // console.log(fakultas, foundProdi.FakProdi.singkatan)

                // ✅ cek apakah params prodi berada di fakultas tersebut
                if (!foundProdi || reqProdi !== foundProdi.nm_prodi.toLowerCase()) {
                    return next(new catchError('Study program not found or unlinked', 404));
                }

                // ✅ cek apakah fakultas dari prodi tersebut sama dengan fakultas pengguna
                const prodiFromFak = foundProdi.FakProdi.singkatan;
                if (fakultas !== prodiFromFak) {
                    return next(new catchError('Access Denied: Study program outside your faculty', 403));
                }
            }

            return next();
        }

        return next(new catchError('Access Denied: unknown role', 403));
    };
};

export default authorizeScope;
