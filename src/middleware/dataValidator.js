import db from "../database/models/model.js";
import { Op } from "sequelize";

// Validasi fakultas
export async function validateFakultas(kode) {
    if (!kode) return true;
    const found = await db.Fakultas.findOne({ where: { kode: kode }});
    return !!found;
}

// Validasi prodi
export async function validateProdi(kode) {
    if (!kode) return true;
    const found = await db.ProgramStudi.findOne({ where: { kode: kode } });
    return !!found;
}

// Validasi dosen (nidn)
export async function validateNidn(nidn) {
    if (!nidn) return true;
    const found = await db.DataDosen.findOne({ where: { nidn } });
    return !!found;
}
