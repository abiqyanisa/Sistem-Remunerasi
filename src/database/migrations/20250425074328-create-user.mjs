import { DataTypes, literal } from 'sequelize';

export async function up({ context: queryInterface }) {
  await queryInterface.createTable('User', {
    nidn: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'dekan', 'kaprodi', 'dosen'),
      allowNull: false,
      defaultValue: 'dosen',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP'),
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('User');
}
