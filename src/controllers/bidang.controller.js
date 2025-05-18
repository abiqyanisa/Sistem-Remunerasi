import db from "../database/models/model.js";
import { catchAsync } from "../utils/catchAsync.js";

const getPendidikan = catchAsync (async (req, res, next) => {
    // ambil nidn dari path
    const nidnDosen = req.params.nidn;
    // ambil relasi dan cocokkan nidn user dgn data dosen
    const foundDosen = await db.DataDosen.findOne({
        where: {nidn: nidnDosen},
        include: {
            model: db.KinSwmp,
            as: 'DataDosen_KinSwmp'
        }
    });
    // ambil data kinerja pengabdian by kode bidang dan nidn
    const Pendidikan = await db.BidangKinerjaRemun.findOne({
        where: { kode: 1 },
        include: [{
            model: db.UnsurKegiatanRemun,
            as: 'Bidang_Unsur',
            include: [{
                model: db.KegiatanRemun,
                as: 'Unsur_Kegiatan',
                include: [{
                    where: {id_dosen: foundDosen.nidn},
                    model: db.KinSwmp,
                    as: 'Kegiatan_Kin'
                }]
            }]
        }]
    });
    // hasil
    return res.json({
        status: 'success',
        pendidikan: Pendidikan
    });
});

const getPelaksanaanPendidikan = catchAsync (async (req, res, next) => {
    // ambil nidn dari path
    const nidnDosen = req.params.nidn;
    // ambil relasi dan cocokkan nidn user dgn data dosen
    const foundDosen = await db.DataDosen.findOne({
        where: {nidn: nidnDosen},
        include: {
            model: db.KinSwmp,
            as: 'DataDosen_KinSwmp'
        }
    });
    // ambil data kinerja pengabdian by kode bidang dan nidn
    const PelaksanaanPendidikan = await db.BidangKinerjaRemun.findOne({
        where: { kode: 2 },
        include: [{
            model: db.UnsurKegiatanRemun,
            as: 'Bidang_Unsur',
            include: [{
                model: db.KegiatanRemun,
                as: 'Unsur_Kegiatan',
                include: [{
                    where: {id_dosen: foundDosen.nidn},
                    model: db.KinSwmp,
                    as: 'Kegiatan_Kin'
                }]
            }]
        }]
    });
    // hasil
    return res.json({
        status: 'success',
        pelaksanaanPendidikan: PelaksanaanPendidikan
    });
});

const getPenelitian = catchAsync (async (req, res, next) => {
    // ambil nidn dari path
    const nidnDosen = req.params.nidn;
    // ambil relasi dan cocokkan nidn user dgn data dosen
    const foundDosen = await db.DataDosen.findOne({
        where: {nidn: nidnDosen},
        include: {
            model: db.KinSwmp,
            as: 'DataDosen_KinSwmp'
        }
    });
    // ambil data kinerja pengabdian by kode bidang dan nidn
    const Penelitian = await db.BidangKinerjaRemun.findOne({
        where: { kode: 3 },
        include: [{
            model: db.UnsurKegiatanRemun,
            as: 'Bidang_Unsur',
            include: [{
                model: db.KegiatanRemun,
                as: 'Unsur_Kegiatan',
                include: [{
                    where: {id_dosen: foundDosen.nidn},
                    model: db.KinSwmp,
                    as: 'Kegiatan_Kin'
                }]
            }]
        }]
    });
    // hasil
    return res.json({
        status: 'success',
        penelitian: Penelitian
    });
});

const getPengabdian = catchAsync (async (req, res, next) => {
    // ambil nidn dari path
    const nidnDosen = req.params.nidn;
    // ambil relasi dan cocokkan nidn user dgn data dosen
    const foundDosen = await db.DataDosen.findOne({
        where: {nidn: nidnDosen},
        include: {
            model: db.KinSwmp,
            as: 'DataDosen_KinSwmp'
        }
    });
    // ambil data kinerja pengabdian by kode bidang dan nidn
    const Pengabdian = await db.BidangKinerjaRemun.findOne({
        where: { kode: 4 },
        include: [{
            model: db.UnsurKegiatanRemun,
            as: 'Bidang_Unsur',
            include: [{
                model: db.KegiatanRemun,
                as: 'Unsur_Kegiatan',
                include: [{
                    where: {id_dosen: foundDosen.nidn},
                    model: db.KinSwmp,
                    as: 'Kegiatan_Kin'
                }]
            }]
        }]
    });
    // hasil
    return res.json({
        status: 'success',
        pengabdian: Pengabdian
    });
});

const getPenunjang = catchAsync (async (req, res, next) => {
    // ambil nidn dari path
    const nidnDosen = req.params.nidn;
    // ambil relasi dan cocokkan nidn user dgn data dosen
    const foundDosen = await db.DataDosen.findOne({
        where: {nidn: nidnDosen},
        include: {
            model: db.KinSwmp,
            as: 'DataDosen_KinSwmp'
        }
    });
    // ambil data kinerja pengabdian by kode bidang dan nidn
    const Penunjang = await db.BidangKinerjaRemun.findOne({
        where: { kode: 5 },
        include: [{
            model: db.UnsurKegiatanRemun,
            as: 'Bidang_Unsur',
            include: [{
                model: db.KegiatanRemun,
                as: 'Unsur_Kegiatan',
                include: [{
                    where: {id_dosen: foundDosen.nidn},
                    model: db.KinSwmp,
                    as: 'Kegiatan_Kin'
                }]
            }]
        }]
    });
    // hasil
    return res.json({
        status: 'success',
        penunjang: Penunjang
    });
});

export {
    getPendidikan, 
    getPelaksanaanPendidikan, 
    getPenelitian, 
    getPengabdian, 
    getPenunjang 
}