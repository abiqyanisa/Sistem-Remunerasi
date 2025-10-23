import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000, // hindari idle timeout
    },
    dialectOptions: {
        ssl:
            process.env.DB_SSL === 'true'
            ? { require: true, rejectUnauthorized: false }
            : false,
    },
});

export { sequelize }