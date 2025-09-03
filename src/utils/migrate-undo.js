import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import dbConfig from '../config/config.cjs';

// Setup sequelize
const sequelize = new Sequelize(dbConfig.development);

// Umzug migrasi
const umzug = new Umzug({
    migrations: { 
        glob: 'src/database/migrations/*.mjs' 
    },
    storage: new SequelizeStorage({ sequelize }),
    context: sequelize.getQueryInterface(),
    logger: console,
});

await umzug.down({ to: 0 }); // Undo semua migration
console.log('All migrations reverted!');
