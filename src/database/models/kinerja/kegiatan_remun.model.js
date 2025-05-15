import { sequelize } from "../../../config/database.js";
import { DataTypes, literal } from "sequelize";
// import { KinSwmp } from "./kin_swmp.model.js";

export default (sequelize, DataTypes) => {
    const KegiatanRemun = sequelize.define('KegiatanRemun', {
        kode: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            defaultValue: literal(`nextval('"kinerja".kegiatan_remun_kode_seq'::regclass)`)
        },
        kode_kegiatan: {
            type: DataTypes.CHAR(5),
            allowNull: true
        },
        nm_kegiatan: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        kode_unsur_kegiatan: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        setara_sister: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        metode_perhitungan: {
            type: DataTypes.CHAR(1),
            allowNull: true
        },
        sks: {
            type: DataTypes.DECIMAL(5,3),
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
        metode_entri: {
            type: DataTypes.CHAR(3),
            allowNull: true
        },
        aktif: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        schema: 'kinerja',
        tableName: 'kegiatan_remun',
        freezeTableName: true,
        timestamps: false,
        paranoid: true
    });
    KegiatanRemun.associate = (models) => {
        KegiatanRemun.belongsTo(models.UnsurKegiatanRemun, {
            foreignKey: 'kode_unsur_kegiatan'
        });
        KegiatanRemun.hasMany(models.KinSwmp, {
            foreignKey: 'id_kegiatan'
        });
    }
    return KegiatanRemun;
}

// One-to-Many: KegiatanRemun has many KinSWMP
// KegiatanRemun.hasMany(KinSwmp, {foreignKey: 'id_kegiatan'});
// KinSwmp.belongsTo(KegiatanRemun, {foreignKey: 'id_kegiatan'});

// export { KegiatanRemun }