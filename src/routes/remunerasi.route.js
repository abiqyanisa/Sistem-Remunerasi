import express from 'express';

import { 
    getAllBidangKinerjaRemun, 
    getDataFakultas 
} from '../controllers/fakultas.controller.js';
import { getDaftarProdi, getDataProdi } from '../controllers/program_studi.controller.js';
import { authentication, restrictToRole} from '../controllers/auth.controller.js';
import authorizeScope from '../middleware/authorizeScope.js';
import { getDaftarDosen } from '../controllers/data_dosen.controller.js';

const remunerasiRouter = express.Router();

remunerasiRouter.route('/bidang-kinerja')
    .get(getAllBidangKinerjaRemun)
    
remunerasiRouter.route('/fakultas/:fak')
    .get(authentication, restrictToRole('dekan'), authorizeScope(), getDataFakultas)
    
remunerasiRouter.route('/fakultas/:fak/programstudi')
    .get(authentication, restrictToRole('dekan'), authorizeScope(), getDaftarProdi)

remunerasiRouter.route('/programstudi/:prodi')
    .get(authentication, restrictToRole('dekan', 'kaprodi'), authorizeScope(), getDataProdi)

remunerasiRouter.route('/programstudi/:prodi/dosen')
    .get(authentication, restrictToRole('dekan', 'kaprodi'), authorizeScope(), getDaftarDosen)

// remunerasiRouter.get(
//     '/fakultas/:fak',
//     authentication,
//     restrictToRole('dekan'),
//     authorizeScope(),
//     getDataFakultas
// );

// remunerasiRouter.get(
//     '/fakultas/:fak/programstudi',
//     authentication,
//     restrictToRole('dekan'),
//     authorizeScope(),
//     getDaftarProdi
// );

// remunerasiRouter.get(
//     '/fakultas/:fak/programstudi/:prodi',
//     authentication,
//     restrictToRole('dekan'),
//     authorizeScope(),
//     getDataProdi
// );

// remunerasiRouter.get(
//     '/fakultas/:fak/programstudi/:prodi/dosen/:nidn',
//     authentication,
//     restrictToRole('dekan'),
//     authorizeScope(),
//     getDaftarDosen
// );

remunerasiRouter.get(
    '/programstudi/:prodi',
    authentication,
    restrictToRole('kaprodi'),
    authorizeScope(),
    getDataProdi
);

export { remunerasiRouter }