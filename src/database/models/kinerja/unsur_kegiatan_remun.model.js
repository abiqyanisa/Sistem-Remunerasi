import { literal } from "sequelize";

export default (sequelize, DataTypes) => {
    const UnsurKegiatanRemun = sequelize.define('UnsurKegiatanRemun', {
        kode: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            defaultValue: literal(`nextval('"kinerja".unsur_kegiatan_remun_kode_seq'::regclass)`)
        },
        kode_unsur: {
            type: DataTypes.CHAR(5),
            allowNull: true
        },
        nm_unsur_kegiatan: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        kode_bidang: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        setara_sister: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sks: {
            type: DataTypes.DECIMAL(5,3),
            allowNull: true
        },
        metode_perhitungan: {
            type: DataTypes.CHAR(1),
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
        tableName: 'unsur_kegiatan_remun',
        freezeTableName: true,
        timestamps: false,
        paranoid: true
    });
    UnsurKegiatanRemun.associate = (models) => {
        UnsurKegiatanRemun.belongsTo(models.BidangKinerjaRemun, {
        foreignKey: 'kode_bidang'
        });
        UnsurKegiatanRemun.hasMany(models.KegiatanRemun, {
            foreignKey: 'kode_unsur_kegiatan'
        });
    };
    return UnsurKegiatanRemun;
}