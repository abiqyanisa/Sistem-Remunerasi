import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {
  sequelize,
  Sequelize,
};

const modelDirs = ['master', 'kinerja', 'public'];
const modelDefiners = [];

// 1. Baca semua model di subfolder dan simpan definisinya
for (const dir of modelDirs) {
  const dirPath = path.join(__dirname, dir);
  const files = fs.readdirSync(dirPath).filter(file =>
    file.endsWith('.js') || file.endsWith('.mjs')
  );

  for (const file of files) {
    const modelPath = path.join(dirPath, file);
    const modelURL = pathToFileURL(modelPath).href;
    const { default: defineModel } = await import(modelURL);
    modelDefiners.push({ defineModel, name: file, filePath: modelPath });
  }
}

// 2. Inisialisasi semua model
for (const { defineModel } of modelDefiners) {
  const model = defineModel(sequelize, DataTypes);
  db[model.name] = model;
}

// 3. Setup semua relasi
for (const modelName of Object.keys(db)) {
  const model = db[modelName];
  if (model.associate) {
    model.associate(db);
  }
}

export default db;
