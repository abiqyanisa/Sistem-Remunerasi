import { literal } from "sequelize";

export default (sequelize, DataTypes) => {
    const DataDosen = sequelize.define("DataDosen", {
        nidn: {
            type: DataTypes.CHAR(15),
            primaryKey: true,
            allowNull: false
        },
        ambil_alih: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
        },
        nip: {
            type: DataTypes.CHAR(25),
            allowNull: true
        },
        nama: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tempat_lahir: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tanggal_lahir: {
            type: DataTypes.DATE,
            allowNull: true
        },
        bidang_ilmu: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fakultas: {
            type: DataTypes.CHAR(3),
            allowNull: true
        },
        prodi: {
            type: DataTypes.CHAR(10),
            allowNull: true
        },
        nomor_hp: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        blog: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        id_peg_simpeg: {
            type: DataTypes.CHAR(6),
            allowNull: true
        },
        alamat: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        id_remun: {
            type: DataTypes.INTEGER,
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
        aktif: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 1
        },
        foto: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        jns_pegawai: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 1
        },
    },
    {
        schema: 'kinerja',
        tableName: 'data_dosen',
        freezeTableName: true,
        timestamps: false,
        paranoid: true
    });
    DataDosen.associate = (models) => {
        DataDosen.hasMany(models.KinSwmp, {
            foreignKey: 'id_dosen',
            as: 'DataDosen_KinSwmp'
        });
        DataDosen.belongsTo(models.Fakultas, { 
            foreignKey: 'fakultas',
            sourceKey: 'kode',
            as: 'DosenbyFak'
        });
        DataDosen.belongsTo(models.ProgramStudi, {
            foreignKey: 'prodi',
            sourceKey: 'kode',
            as: 'DosenbyProdi'
        });
        DataDosen.hasOne(models.User, {
            foreignKey: 'nidn',
            sourceKey: 'nidn',
            as: 'Pengguna'
        });
    }
    return DataDosen;
}