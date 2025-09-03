require('dotenv').config();
const path = require('path');

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": process.env.DB_DIALECT,

    "migrationStorageTabelName": "SequelizeMeta",
    "migrationStorage": "sequelize",
    "migrationStoragePath": path.resolve('src/database/migrations'),
    "migrationFileExtension": ".mjs",
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": process.env.DB_DIALECT,
  }
}