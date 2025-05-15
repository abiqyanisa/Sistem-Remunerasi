import { sequelize } from "../../../config/database.js";
import { DataTypes, literal } from "sequelize";
// import ProgramStudi from "./program_studi.model.js";
// import DataDosen from "../kinerja/data_dosen.model.js";

export default (sequelize, DataTypes) => {
    const Fakultas = sequelize.define('Fakultas', {
        kode: {
            type: DataTypes.CHAR(3),
            primaryKey: true,
            allowNull: false
        },
        nm_fakultas: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        singkatan: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        dekan: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        wd_1: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        wd_2: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        wd_3: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        first_create: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: literal('CURRENT_TIMESTAMP')
        },
        user_create: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        last_update: {
            type: DataTypes.DATE(6),
            allowNull: true
        },
        user_update: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        asal_koneksi: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        aktif: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 1
        },
        panggil: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        block_dosen: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
        },
        block_op: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
        },
    },
    {
        schema: 'master',
        tableName: 'fakultas',
        freezeTableName: true,
        timestamps: false,
        paranoid: true
    });
    Fakultas.associate = (models) => {
        Fakultas.hasMany(models.ProgramStudi, {
            foreignKey: 'id_fak',
            as: 'FakProdi'
        });
        Fakultas.hasMany(models.DataDosen, {
            foreignKey: 'fakultas'
        });
    }
    return Fakultas;
}

// One-to-Many: Fakultas has many ProgramStudi
// Fakultas.hasMany(ProgramStudi, {foreignKey: 'id_fak'});
// ProgramStudi.belongsTo(Fakultas, {foreignKey: 'id_fak'});

// One-to-Many: Fakultas has many DataDosen
// Fakultas.hasMany(DataDosen, {foreignKey: 'fakultas'});
// DataDosen.belongsTo(Fakultas, {foreignKey: 'fakultas'})

// export { Fakultas };