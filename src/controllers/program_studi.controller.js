import { Op } from "sequelize";
import crypto from "crypto";
import db from "../database/models/model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { getCache, setCache } from "../middleware/nodeCache.js";

const getDataProdi = catchAsync (async (req, res, next) => {
    const {fakultas, prodi, nidn, limit = 10, offset = 0, sort = 'kode', order = 'ASC', search} = req.query;
    
    // Buat cache key unik berbasis query
    const cacheKeyRaw = `Prodi:${JSON.stringify(req.query)}`;
    const cacheKey = crypto.createHash('md5').update(cacheKeyRaw).digest('hex');

    // Cek cache lokal
    const cachedData = getCache(cacheKey);
    if (cachedData) {
        console.log("Serve Get Prodi from node-cache");
        return res.json(cachedData);
    }

    // Build kondisi where
    const whereProdi = {};
    if (prodi) whereProdi.kode = prodi;
    if (search) whereProdi.nm_prodi = { [Op.iLike]: `%${search}%` };
    
    // Query database kalau belum ada cache
    const include = [];

    if (fakultas){
        include.push({
            model: db.Fakultas,
            as: 'ProdibyFak',
            attributes: [],
            where: { kode: fakultas },
            required: true
        });
    }

    if (nidn){
        include.push({
            model: db.DataDosen,
            as: 'DosenbyProdi',
            where: { nidn: nidn },
            required: true
        })
    }

    const dataProdi = await db.ProgramStudi.findAll({
        where : whereProdi,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort, order.toUpperCase()]],
        include: include,
    });

    const responseData = {
        status: 'success',
        dataProdi
    };

    // Simpan hasil ke cache (TTL: detik)
    setCache(cacheKey, JSON.parse(JSON.stringify(responseData)), 3600);
    res.set('Cache-Control', 'public, max-age=3600');

    // Kirim response
    return res.json(responseData);
});

export { getDataProdi }