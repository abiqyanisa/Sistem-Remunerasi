import { Op } from "sequelize";
import db from "../database/models/model.js";
import removeNulls from "../middleware/removeNulls.js";
import { catchAsync } from "../utils/catchAsync.js";
import { catchError } from "../utils/catchError.js";

const getKinerja = catchAsync (async (req, res, next) => {
    // ambil kode bidang dari controller
    const kodeBidang = req.kodeBidang

    // ambil nidn dari path
    const {fakultas, prodi, nidn, tahun, limit = 10, offset = 0, sort = 'kode', order = 'ASC', search} = req.query;

    let where = [];
    // ambil relasi, cocokkan, dan push
    if (fakultas) {
        where.push({ id_dosen: { [Op.in]: req.nidnListByFak } });
    }
    if (prodi) {
        where.push({ id_dosen: { [Op.in]: req.nidnListByProdi } });
    }
    if (nidn) {
        where.push({ id_dosen: req.nidnListByKin  });
    }
    if(tahun) {
        where.push({ tahun: tahun })
    }
    
    // cetak include Kin_Swmp
    const kegiatanKinInclude = {
        model: db.KinSwmp,
        as: 'Kegiatan_Kin',
        required: true,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort, order.toUpperCase()]],
        // hanya sertakan where jika array-nya tidak kosong
        ...(Object.keys(where).length > 0 ? { where } : {[Op.and]: where})
    };

    // cetak kinerja
    const Kinerja = await db.BidangKinerjaRemun.findOne({
        where: { kode: kodeBidang },
        include: [{
            model: db.UnsurKegiatanRemun,
            as: 'Bidang_Unsur',
            required: false,
            include: [{
                model: db.KegiatanRemun,
                as: 'Unsur_Kegiatan',
                required: false,
                include: // [kegiatanKinInclude]
                [{
                    model: db.KinSwmp,
                    as: 'Kegiatan_Kin',
                    required: false,
                    where: Object.keys(where).length > 0 ? where : undefined,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    order: [[sort, order.toUpperCase()]],
                }]
            }]
        }]
    });

    // // cek apakah kinerjanya ada
    if (!Kinerja) {
        return next(new catchError('Kinerja not found', 404));
    }

    // Ubah ke plain JS object supaya bisa dimodifikasi bebas
    const kinerjaPlain = Kinerja.toJSON();

    kinerjaPlain.Bidang_Unsur = (kinerjaPlain.Bidang_Unsur ?? [])
    .map(unsur => {
        // Filter Unsur_Kegiatan yang punya Kegiatan_Kin
        const filteredUnsurKegiatan = (unsur.Unsur_Kegiatan ?? [])
        .filter(kegiatan =>
            (kegiatan.Kegiatan_Kin ?? []).length > 0
        );

        if (filteredUnsurKegiatan.length === 0) return null;

        return {
            ...unsur,
            Unsur_Kegiatan: filteredUnsurKegiatan
        };
    })
    .filter(Boolean);

    if (kinerjaPlain.Bidang_Unsur.length === 0) {
        return next(new catchError('Kinerja not found', 404));
    }

    // hasil
    return res.json({
        status: 'success',
        penunjang: removeNulls(kinerjaPlain)
    });
});

export { getKinerja }