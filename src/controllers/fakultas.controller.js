import { Op } from "sequelize";
import crypto from "crypto";
import db from "../database/models/model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { getCache, setCache } from "../middleware/nodeCache.js";

const getDataFakultas = catchAsync (async (req, res, next) => {
    const {fakultas, prodi, nidn, limit = 10, offset = 0, sort = 'kode', order = 'ASC', search} = req.query;

    // Buat cache key unik berbasis query
    const cacheKeyRaw = `Fakultas:${JSON.stringify(req.query)}`;
    const cacheKey = crypto.createHash('md5').update(cacheKeyRaw).digest('hex');

    // Cek cache lokal
    const cachedData = getCache(cacheKey);
    if (cachedData) {
        console.log("Serve Get Fakultas from node-cache");
        return res.json(cachedData);
    }

    // Build kondisi where
    const whereFakultas = {};
    if (fakultas) whereFakultas.kode = fakultas;
    if (search) whereFakultas.nm_fakultas = { [Op.iLike]: `%${search}%`};
    
    // Query database kalau belum ada cache
    const include = [];

    if (prodi){
        include.push({
            model: db.ProgramStudi,
            as: 'ProdibyFak',
            where: { kode: prodi },
            required: true
        });
    }

    if (nidn){
        include.push({
            model: db.DataDosen,
            as: 'DosenbyFak',
            where: { nidn: nidn },
            required: true
        })
    }

    const dataFakultas = await db.Fakultas.findAll({
        where : whereFakultas,
        include,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort, order.toUpperCase()]],
    });
    
    const responseData = {
        status: 'success',
        dataFakultas
    };

    // Simpan hasil ke cache (TTL: detik)
    setCache(cacheKey, JSON.parse(JSON.stringify(responseData)), 3600);
    res.set('Cache-Control', 'public, max-age=3600');

    // Kirim response
    return res.json(responseData);
});

export { getDataFakultas }; 