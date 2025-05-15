import { Sequelize } from 'sequelize';

import config from '../config/config.cjs';
import * as seedFn from '../database/seeders/20250508033159-admin-user.mjs';

const sequelize = new Sequelize(config.development);
const queryInterface = sequelize.getQueryInterface();

await seedFn.up(queryInterface, Sequelize);
console.log('Seeder executed successfully');
