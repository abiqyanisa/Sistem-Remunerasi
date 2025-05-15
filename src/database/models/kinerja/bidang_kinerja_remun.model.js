import { sequelize } from "../../../config/database.js";
import { DataTypes, literal } from "sequelize";
// import { UnsurKegiatanRemun } from "./unsur_kegiatan_remun.model.js";

export default (sequelize, DataTypes) => {
    const BidangKinerjaRemun = sequelize.define('BidangKinerjaRemun', {
        kode_bidang: {
            type: DataTypes.CHAR(5),
            allowNull: false
        },
        nm_bidang: {
            type: DataTypes.TEXT,
            allowNull:false
        },
        kode_pertor: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        tahun: {
            type: DataTypes.CHAR(4),
            allowNull: false
        },
        semester: {
            type: DataTypes.CHAR(2),
            allowNull: false
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
        },
        kode: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            defaultValue: literal(`nextval('"kinerja".bidang_kinerja_remun_kode_seq'::regclass)`)
        },
        setara_sister: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        buka_ver: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        schema: 'kinerja',
        tableName: 'bidang_kinerja_remun',
        freezeTableName: true,
        timestamps: false,
        paranoid: true
    });
    BidangKinerjaRemun.associate = (models) => {
        BidangKinerjaRemun.hasMany(models.UnsurKegiatanRemun, {
        foreignKey: 'kode_bidang'
        });
    };
    return BidangKinerjaRemun;
}
// One-to-Many: BidangKinerjaRemun has many UnsurKegiatanRemun
// BidangKinerjaRemun.hasMany(UnsurKegiatanRemun, {foreignKey: 'kode_bidang'});
// UnsurKegiatanRemun.belongsTo(BidangKinerjaRemun, {foreignKey: 'kode_bidang'});

// export { BidangKinerjaRemun }