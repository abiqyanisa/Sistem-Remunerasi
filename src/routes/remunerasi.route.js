import express from 'express';
import authorizeScope from '../middleware/authorizeScope.js';

import { getAllBidangKinerjaRemun, getDataFakultas } from '../controllers/fakultas.controller.js';
import { getDaftarProdi, getDataProdi } from '../controllers/program_studi.controller.js';
import { authentication, restrictToRole} from '../controllers/auth.controller.js';
import { getDaftarDosen, getDataDosen } from '../controllers/data_dosen.controller.js';

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

remunerasiRouter.route('/dosen/:nidn')
    .get(authentication, restrictToRole('dekan', 'kaprodi', 'dosen'), authorizeScope(), getDataDosen)

export { remunerasiRouter }