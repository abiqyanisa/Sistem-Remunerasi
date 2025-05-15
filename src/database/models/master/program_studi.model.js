import { sequelize } from "../../../config/database.js";
import { DataTypes, literal } from "sequelize";
// import { DataDosen } from "../kinerja/data_dosen.model.js";

export default (sequelize, DataTypes) => {
const ProgramStudi = sequelize.define('ProgramStudi', {
    kode: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false
    },
    id_fak: {
        type: DataTypes.CHAR(3),
        allowNull: true
    },
    nm_prodi: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    id_remun: {
        type: DataTypes.CHAR(5),
        allowNull: true
    },
    kaprodi: {
        type: DataTypes.CHAR(30),
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
    tableName: 'program_studi',
    freezeTableName: true,
    timestamps: false,
    paranoid: true
});
ProgramStudi.associate = (models) => {
    ProgramStudi.belongsTo(models.Fakultas, {
        foreignKey: 'id_fak',
        as: 'FakProdi',
    });
    ProgramStudi.hasMany(models.DataDosen, {
        foreignKey: 'prodi'
    });
}
return ProgramStudi
}

// One-to-Many: ProgramStudi has many DataDosen
// ProgramStudi.hasMany(DataDosen, {foreignKey: 'prodi'});
// DataDosen.belongsTo(ProgramStudi, {foreignKey: 'prodi'});

// export { ProgramStudi };