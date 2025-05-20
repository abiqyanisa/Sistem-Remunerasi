import express from 'express';
import authorizeScope from '../middleware/authorizeScope.js';

import { getDataFakultas } from '../controllers/fakultas.controller.js';
import { getDataProdi } from '../controllers/program_studi.controller.js';
import { authentication, restrictToRole} from '../controllers/auth.controller.js';
import { getDataDosen } from '../controllers/data_dosen.controller.js';
import { getPelaksanaanPendidikan, getPendidikan, getPenelitian, getPengabdian, getPenunjang } from '../controllers/bidang.controller.js';

const remunerasiRouter = express.Router();

remunerasiRouter.route('/fakultas')
.get(
    authentication, 
    restrictToRole('admin', 'dekan'), 
    authorizeScope(), 
    getDataFakultas
)
    
remunerasiRouter.route('/programstudi')
.get(
    authentication, 
    restrictToRole('admin', 'dekan', 'kaprodi'), 
    authorizeScope(), 
    getDataProdi
)

remunerasiRouter.route('/dosen')
.get(
    authentication, 
    restrictToRole('admin', 'dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    getDataDosen
)

remunerasiRouter.route('/pendidikan')
.get(
    authentication, 
    restrictToRole('admin','dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    getPendidikan
)

remunerasiRouter.route('/pelaksanaan-pendidikan')
.get(
    authentication, 
    restrictToRole('admin', 'dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    getPelaksanaanPendidikan
)

remunerasiRouter.route('/penelitian')
.get(
    authentication, 
    restrictToRole('admin', 'dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    getPenelitian
)

remunerasiRouter.route('/pengabdian')
.get(
    authentication, 
    restrictToRole('admin', 'dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    getPengabdian
)

remunerasiRouter.route('/penunjang')
.get(
    authentication, 
    restrictToRole('admin', 'dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    getPenunjang
)

export { remunerasiRouter }