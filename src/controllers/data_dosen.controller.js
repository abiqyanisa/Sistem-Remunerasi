import { Op } from "sequelize";
import db from "../database/models/model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { catchError } from "../utils/catchError.js";

import crypto from "crypto";
import { getCache, setCache } from "../middleware/nodeCache.js"; // ganti dari redis ke node-cache

const getDataDosen = catchAsync (async (req, res, next) => {
    const {fakultas, prodi, nidn, limit = 10, offset = 0, sort = 'nidn', order = 'ASC', search} = req.query;
    
    // 🔐 Buat cache key unik berbasis query
    const cacheKeyRaw = `Dosen:${JSON.stringify(req.query)}`;
    const cacheKey = crypto.createHash('md5').update(cacheKeyRaw).digest('hex');

    // 🔍 1. Cek cache lokal
    const cachedData = getCache(cacheKey);
    if (cachedData) {
        console.log("✅ Serve Get Dosen from node-cache");
        return res.json(cachedData);
    }

    // 🔄 2. Query database kalau belum ada cache
    let whereFakultas = {};
    let whereProdi = {};
    let whereDosen = {};

    if (fakultas){
        whereFakultas.kode = {
            [Op.iLike]: `%${fakultas}%`
        };
    }

    if (prodi){
        whereProdi.kode = {
            [Op.iLike]: `%${prodi}%`
        };
    } 

    if (nidn){
        whereDosen.nidn = nidn;
    }

    if (search){
        whereDosen.nama = {
            [Op.iLike]: `%${search}%`
        };
    }

    const include = [];
    
    if (fakultas){
        include.push({
            model: db.Fakultas,
            as: 'DosenbyFak',
            attributes: [], 
            where: fakultas ? { kode: { [Op.iLike]: `%${fakultas}%` } } : undefined,
            required: !!fakultas
        })
    }

    if (prodi){
        include.push({
            model: db.ProgramStudi,
            as: 'DosenbyProdi',
            attributes: [], 
            where: prodi ? { kode: { [Op.iLike]: `%${prodi}%` } } : undefined,
            required: !!prodi
        })
    }

    const dataDosen = await db.DataDosen.findAll({
        where: whereDosen,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort, order.toUpperCase()]],
        include: include
    });

    if (dataDosen.length === 0) {
        return next (new catchError('Dosen not found', 400))
    }

    const responseData = {
        status: 'success',
        dataDosen: dataDosen
    };

    // 💾 3. Simpan hasil ke cache (TTL: detik)
    setCache(cacheKey, JSON.parse(JSON.stringify(responseData)), 3600);

    // 🟢 4. Kirim response
    return res.json(responseData);
});

export { getDataDosen }