import express from 'express';
import authorizeScope from '../middleware/authorizeScope.js';

import { getAllBidangKinerjaRemun, getDataFakultas } from '../controllers/fakultas.controller.js';
import { getDaftarProdi, getDataProdi } from '../controllers/program_studi.controller.js';
import { authentication, restrictToRole} from '../controllers/auth.controller.js';
import { getDaftarDosen, getDataDosen } from '../controllers/data_dosen.controller.js';
import { getPelaksanaanPendidikan, getPendidikan, getPenelitian, getPengabdian, getPenunjang } from '../controllers/bidang.controller.js';

const remunerasiRouter = express.Router();

remunerasiRouter.route('/fakultas/:fak')
.get(
    authentication, 
    restrictToRole('dekan'), 
    authorizeScope(), 
    getDataFakultas
)
    
remunerasiRouter.route('/fakultas/:fak/programstudi')
.get(
    authentication, 
    restrictToRole('dekan'), 
    authorizeScope(), 
    getDaftarProdi
)

remunerasiRouter.route('/programstudi/:prodi')
.get(
    authentication, 
    restrictToRole('dekan', 'kaprodi'), 
    authorizeScope(), 
    getDataProdi
)

remunerasiRouter.route('/programstudi/:prodi/dosen')
.get(
    authentication, 
    restrictToRole('dekan', 'kaprodi'), 
    authorizeScope(), 
    getDaftarDosen
)

remunerasiRouter.route('/dosen/:nidn')
.get(
    authentication, 
    restrictToRole('dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    getDataDosen
)

remunerasiRouter.route('/dosen/:nidn/pendidikan')
.get(
    authentication, 
    restrictToRole('dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    getPendidikan
)

remunerasiRouter.route('/dosen/:nidn/pelaksanaan-pendidikan')
.get(
    authentication, 
    restrictToRole('dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    getPelaksanaanPendidikan
)

remunerasiRouter.route('/dosen/:nidn/penelitian')
.get(
    authentication, 
    restrictToRole('dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    getPenelitian
)

remunerasiRouter.route('/dosen/:nidn/pengabdian')
.get(
    authentication, 
    restrictToRole('dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    getPengabdian
)

remunerasiRouter.route('/dosen/:nidn/penunjang')
.get(
    authentication, 
    restrictToRole('dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    getPenunjang
)

export { remunerasiRouter }