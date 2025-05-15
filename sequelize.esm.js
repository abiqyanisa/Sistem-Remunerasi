// sequelize.esm.js
import { Sequelize } from 'sequelize';
import configFile from './src/config/config.cjs'; // load config manual

const env = process.env.NODE_ENV || development;
const config = configFile[env];

export const sequelize = new Sequelize(config.database, config.username, config.password, config);
