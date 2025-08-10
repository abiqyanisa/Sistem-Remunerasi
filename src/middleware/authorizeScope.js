import db from '../database/models/model.js';
import { catchError } from '../utils/catchError.js';

const authorizeScope = () => {
    return async (req, res, next) => {
        const { role, fakultas, prodi, nidn } = req.user;

        const reqFak = req.query.fakultas;
        const reqProdi = req.query.prodi;
        const reqNidn = req.query.nidn;

        // Dosen hanya bisa akses datanya sendiri
        if (role === 'dosen') {
            if (!reqNidn || reqNidn !== nidn) {
                return next(new catchError('Akses Ditolak: Kembali ke halaman profil', 403));
            }
            return next();
        }
        
        // Kaprodi akses ke program studi yang ia pimpin
        if (role === 'kaprodi') {
            // cek apakah params nidn dosen berada di prodi tersebut
            if (reqProdi){
                if (reqProdi !== prodi.trim()) {
                    return next(new catchError('Akses Ditolak: bukan program studi Anda', 403));
                }
            }
            // jika ada reqNidn, pastikan dosen tersebut memang milik prodinya
            if (reqNidn) {
                const foundDosenbyProdi = await db.DataDosen.findOne({
                    where: { nidn: reqNidn },
                    include: {
                        model: db.ProgramStudi,
                        as: 'DosenbyProdi',
                        required: true
                    }
                })
                if (!foundDosenbyProdi ){
                    return next (new catchError('Dosen tidak ditemukan', 404))
                }
                // cek apakah prodi dosen sama dengan prodinya
                const DosenfromProdi = foundDosenbyProdi.DosenbyProdi.kode
                if (prodi != DosenfromProdi && foundDosenbyProdi.prodi.trim() !== prodi.trim()){
                    return next (new catchError('Dosen di luar Program Studi Anda', 403))
                }
            }
            // tidak bisa akses fakultas selain miliknya
            if (reqFak) {
                if (reqFak !== fakultas.trim()) {
                    return next (new catchError('Akses Ditolak: Anda tidak dapat mengakses fakultas', 403))
                }
            }
            return next();
        }
        
        // Dekan akses ke fakultas yang ia pimpin
        if (role === 'dekan') {
            if (reqFak) {
                if (reqFak !== fakultas.trim()) {
                    return next(new catchError('Akses Ditolak: bukan fakultas Anda', 403));
                }
            }

            // jika ada reqProdi, pastikan prodi tersebut memang milik fakultasnya
            if (reqProdi) {
                const foundProdibyFak = await db.ProgramStudi.findOne({
                    where: { kode: reqProdi },
                    include: {
                        model: db.Fakultas,
                        as: 'ProdibyFak',
                        required: true
                    }
                });

                // cek apakah params prodi berada di fakultas tersebut
                if (!foundProdibyFak || reqProdi !== foundProdibyFak.kode.trim()) {
                    return next(new catchError('Program studi tidak ditemukan', 404));
                }
                // cek apakah fakultas dari prodi tersebut sama dengan fakultas pengguna
                const prodiFromFak = foundProdibyFak.ProdibyFak.kode;
                if (fakultas !== prodiFromFak) {
                    return next(new catchError('Program studi di luar fakultas Anda', 403));
                }
            }

            // jika ada reqNidn, pastikan dosen tersebut memang milik fakultasnya
            if (reqNidn) {
                const foundDosenbyFak = await db.DataDosen.findOne({
                    where: { nidn: reqNidn },
                    include: {
                        model: db.Fakultas,
                        as: 'DosenbyFak',
                        required: true
                    }
                })

                // cek apakah params dosen berada di fakultas tersebut
                if (!foundDosenbyFak) {
                    return next(new catchError('Dosen tidak ditemukan', 404));
                }
                
                // cek apakah fakultas dari dosen tersebut sama dengan fakultas pengguna
                const dosenFromFak = foundDosenbyFak.DosenbyFak.kode;
                if (fakultas !== dosenFromFak || reqNidn !== foundDosenbyFak.nidn.trim()) {
                    return next(new catchError('Dosen di luar fakultas Anda', 403));
                }
            }
            return next();
        }
        if (role === 'admin') {
            return next();
        }
        return next(new catchError('Akses Ditolak: peran tidak diketahui', 403));
    };
};

export default authorizeScope;