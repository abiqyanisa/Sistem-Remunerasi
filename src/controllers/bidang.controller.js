import { Op } from "sequelize";
import crypto from "crypto";
import db from "../database/models/model.js";
import removeNulls from "../middleware/removeNulls.js";
import { catchAsync } from "../utils/catchAsync.js";
import { getCache, setCache } from "../middleware/nodeCache.js";

const getKinerja = catchAsync(async (req, res, next) => {
    const kodeBidang = req.kodeBidang;
    const {
        fakultas,
        prodi,
        nidn,
        tahun,
        semester,
        limit = 10,
        offset = 0,
        sort = 'kode',
        order = 'ASC'
    } = req.query;

    // Buat cache key unik berbasis query
    const cacheKeyRaw = `Kinerja:${kodeBidang}:${JSON.stringify(req.query)}`;
    const cacheKey = crypto.createHash('md5').update(cacheKeyRaw).digest('hex');

    // Cek cache lokal
    const cachedData = getCache(cacheKey);
    if (cachedData) {
        console.log("Serve Get Kinerja from node-cache");
        return res.json(cachedData);
    }

    // Query database kalau belum ada cache
    let where = [];
    if (fakultas) where.push({ id_dosen: { [Op.in]: req.nidnListByFak } });
    if (prodi) where.push({ id_dosen: { [Op.in]: req.nidnListByProdi } });
    if (nidn) where.push({ id_dosen: req.nidnListByKin });
    if (tahun) where.push({ tahun });
    if (semester) where.push({ semester });

    const Kinerja = await db.BidangKinerjaRemun.findOne({
        where: { kode: kodeBidang },
        include: [{
            model: db.UnsurKegiatanRemun,
            as: 'Bidang_Unsur',
            include: [{
                model: db.KegiatanRemun,
                as: 'Unsur_Kegiatan',
                include: [{
                    model: db.KinSwmp,
                    as: 'Kegiatan_Kin',
                    where: where.length ? where : undefined,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    order: [[sort, order.toUpperCase()]],
                }]
            }]
        }]
    });


    const kinerjaPlain = Kinerja.toJSON();
    kinerjaPlain.Bidang_Unsur = (kinerjaPlain.Bidang_Unsur ?? [])
        .map(unsur => {
            const filtered = (unsur.Unsur_Kegiatan ?? []).filter(k => (k.Kegiatan_Kin ?? []).length > 0);
            if (!filtered.length) return null;
            return { ...unsur, Unsur_Kegiatan: filtered };
        })
        .filter(Boolean);

    const responseData = {
        status: 'success',
        bidang: removeNulls(kinerjaPlain)
    };

    // Simpan hasil ke cache (TTL: detik)
    setCache(cacheKey, responseData, 3600); //be
    res.set('Cache-Control', 'public, max-age=3600'); //fe

    // Kirim response
    return res.json(responseData);
});

export { getKinerja };