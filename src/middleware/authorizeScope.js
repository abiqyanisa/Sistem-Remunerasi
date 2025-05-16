import { Op } from 'sequelize';
import db from '../database/models/model.js';
import { catchError } from '../utils/catchError.js';

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

        // ✅ Dosen hanya bisa akses datanya sendiri
        if (role === 'dosen') {
            if (!reqNidn || reqNidn !== nidn) {
                return next(new catchError('Access Denied: Back to your profile', 403));
            }
            return next();
        }

        const foundDosenbyFak = await db.DataDosen.findOne({
            where: { nidn: reqNidn },
            include: {
                model: db.Fakultas,
                as: 'DosenbyFak'
            }
        })
        // console.log('foundDosenbyFak', foundDosenbyFak)
        
        // ✅ Kaprodi akses ke program studi yang ia pimpin
        if (role === 'kaprodi') {
            if (reqProdi && reqProdi !== prodi.toLowerCase()) {
                return next(new catchError('Access Denied: not your study program', 403));
            }
            // ⚠️ jika ada reqNidn, pastikan dosen tersebut memang milik prodinya
            if (reqNidn) {
                // ‼️ cek apakah params nidn dosen berada di prodi tersebut
                const foundDosenbyProdi = await db.DataDosen.findOne({
                    where: { nidn: reqNidn },
                    include: {
                        model: db.ProgramStudi,
                        as: 'DosenbyProdi'
                    }
                })
                if (!foundDosenbyProdi){
                    return next (new catchError('Lecturer not found', 404))
                }
                // ‼️ cek apakah prodi dosen sama dengan prodinya
                const DosenfromProdi = foundDosenbyProdi.DosenbyProdi.nm_prodi
                if (prodi != DosenfromProdi){
                    console.log(prodi, DosenfromProdi)
                    return next (new catchError('Lecturer outside your Study Program', 403))
                }
            }
            return next();
        }

        // ✅ Dekan akses ke fakultas yang ia pimpin
        if (role === 'dekan') {
            if (reqFak && reqFak !== fakultas.toLowerCase()) {
                return next(new catchError('Access Denied: not your faculty', 403));
            }
            // ⚠️ jika ada reqProdi, pastikan prodi tersebut memang milik fakultasnya
            if (reqProdi) {
                const foundProdibyFak = await db.ProgramStudi.findOne({
                    where: { nm_prodi: {[Op.iLike]: reqProdi }},
                    include: {
                        model: db.Fakultas,
                        as: 'ProdibyFak',
                    }
                });
                console.log('foundProdibyFak', foundProdibyFak)
                // ‼️ cek apakah params prodi berada di fakultas tersebut
                if (!foundProdibyFak || reqProdi !== foundProdibyFak.nm_prodi.toLowerCase()) {
                    return next(new catchError('Study program not found', 404));
                }
                // ‼️ cek apakah fakultas dari prodi tersebut sama dengan fakultas pengguna
                const prodiFromFak = foundProdibyFak.ProdibyFak.singkatan;
                if (fakultas !== prodiFromFak) {
                    return next(new catchError('Study program outside your faculty', 403));
                }
            }
            // ⚠️ jika ada reqNidn, pastikan dosen tersebut memang milik fakultasnya
            if (reqNidn) {
                // ‼️ cek apakah params dosen berada di fakultas tersebut
                // console.log(reqNidn, foundDosenbyFak.nidn.trim(), nidn)
                if (!foundDosenbyFak || reqNidn !== foundDosenbyFak.nidn.trim()) {
                    return next(new catchError('Lecturer not found', 404));
                }
                console.log('foundDosenbyFak',foundDosenbyFak)
                // ‼️ cek apakah fakultas dari dosen tersebut sama dengan fakultas pengguna
                const dosenFromFak = foundDosenbyFak.DosenbyFak.singkatan;
                // console.log(dosenFromFak)
                if (fakultas !== dosenFromFak) {
                    return next(new catchError('Access Denied: Lecturer outside your faculty', 403));
                }
            }
            return next();
        }
        return next(new catchError('Access Denied: unknown role', 403));
    };
};

export default authorizeScope;
