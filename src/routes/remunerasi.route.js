import express from 'express';
import authorizeScope from '../middleware/authorizeScope.js';

import { authentication, restrictToRole} from '../controllers/auth.controller.js';
import { getDataFakultas } from '../controllers/fakultas.controller.js';
import { getDataProdi } from '../controllers/program_studi.controller.js';
import { getDataDosen } from '../controllers/data_dosen.controller.js';
import { getKinerja } from '../controllers/bidang.controller.js';
import { filterDosenByFakultas, filterDosenByKin, filterDosenByProdi } from '../middleware/foundModel.js';

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

const setKodeBidang = (kode) => {
    return (req, res, next) => {
        req.kodeBidang = kode;
        next();
    };
};

remunerasiRouter.route('/pendidikan')
.get(
    authentication, 
    restrictToRole('admin', 'dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    filterDosenByFakultas,
    filterDosenByProdi,
    filterDosenByKin,
    setKodeBidang(1),
    getKinerja
)

remunerasiRouter.route('/pelaksanaan-pendidikan')
.get(
    authentication, 
    restrictToRole('admin', 'dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    filterDosenByFakultas,
    filterDosenByProdi,
    filterDosenByKin,
    setKodeBidang(2),
    getKinerja
)

remunerasiRouter.route('/penelitian')
.get(
    authentication, 
    restrictToRole('admin', 'dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    filterDosenByFakultas,
    filterDosenByProdi,
    filterDosenByKin,
    setKodeBidang(3),
    getKinerja
)

remunerasiRouter.route('/pengabdian')
.get(
    authentication, 
    restrictToRole('admin', 'dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    filterDosenByFakultas,
    filterDosenByProdi,
    filterDosenByKin,
    setKodeBidang(4),
    getKinerja
)

remunerasiRouter.route('/penunjang')
.get(
    authentication, 
    restrictToRole('admin', 'dekan', 'kaprodi', 'dosen'), 
    authorizeScope(), 
    filterDosenByFakultas,
    filterDosenByProdi,
    filterDosenByKin,
    setKodeBidang(5),
    getKinerja
)

export { remunerasiRouter }