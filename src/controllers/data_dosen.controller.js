import { Op } from "sequelize";
import crypto from "crypto";
import db from "../database/models/model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { getCache, setCache } from "../middleware/nodeCache.js"; 

const getDataDosen = catchAsync (async (req, res, next) => {
    const {fakultas, prodi, nidn, limit = 10, offset = 0, sort = 'nidn', order = 'ASC', search} = req.query;
    
    // Buat cache key unik berbasis query
    const cacheKeyRaw = `Dosen:${JSON.stringify(req.query)}`;
    const cacheKey = crypto.createHash('md5').update(cacheKeyRaw).digest('hex');

    // Cek cache lokal
    const cachedData = getCache(cacheKey);
    if (cachedData) {
        console.log("Serve Get Dosen from node-cache");
        return res.json(cachedData);
    }

    // Build kondisi where
    const whereDosen = {};
    if (nidn) whereDosen.nidn = nidn;
    if (search) whereDosen.nama = { [Op.iLike]: `%${search}%` };

    // Query database kalau belum ada cache
    const include = [];
    if (fakultas) {
        include.push({
            model: db.Fakultas,
            as: 'DosenbyFak',
            attributes: [],
            where: { kode: fakultas },
            required: true
        });
    }

    if (prodi) {
        include.push({
            model: db.ProgramStudi,
            as: 'DosenbyProdi',
            attributes: [],
            where: { kode: prodi },
            required: true
        });
    }

    // Query data dosen
    const dataDosen = await db.DataDosen.findAll({
        where: whereDosen,
        include,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort, order.toUpperCase()]],
    });

    const responseData = {
        status: 'success',
        dataDosen
    };

    // Simpan hasil ke cache (TTL: detik)
    setCache(cacheKey, JSON.parse(JSON.stringify(responseData)), 3600);
    res.set('Cache-Control', 'public, max-age=3600');

    // Kirim response
    return res.json(responseData);
});

export { getDataDosen }