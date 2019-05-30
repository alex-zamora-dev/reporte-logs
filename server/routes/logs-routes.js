const express = require('express');
const router = express.Router();
// Controllers
const logsController = require('../controllers/logsController');
const convertJsonController = require('../controllers/convertJsonController');
const cleanDataLogs = require('../controllers/cleanDataLogs');

const convertJsonMayo = require('../controllers/convertJsonMayo');
const compareLogsMayo = require('../controllers/compareLogsMayo');
const dashboardMayo = require('../controllers/convertDashJson');
const Tiendas_Logs = require('../controllers/Tiendas_Logs');

// Compare
const Compare_Dashboard_Soms_Sterling_Logs = require('../controllers/Compare_Dashboard_Soms_Sterling_Logs');
const Compare_Dashboard_Soms_Sterling = require('../controllers/Compare_Dashboard_Soms_Sterling');
const Compare_Dashboard_SomsFull = require('../controllers/Compare_Dashboard_SomsFull');
const Compare_Dashboard_SomsFull_Logs = require('../controllers/Compare_Dashboard_SomsFull_Logs');
const Compare_Dashboard_Logs = require('../controllers/Compare_Dashboard_Logs');

// File Upload
const { upload } = require('../utils/index');

router.get('/logs/:fechaInicio/:fechaFin/:filename', logsController.index);
router.post('/upload', upload.single('csv'), logsController.upload);

router.get('/convertjson', convertJsonController.index);
router.get('/cleandatalogs', cleanDataLogs.index);
router.get('/jsonMayo', convertJsonMayo.index );
router.get('/compareLogsMayo', compareLogsMayo.index );
router.get('/dashboardJson', dashboardMayo.index );
router.get('/tiendas', Tiendas_Logs.index );

// Compare
router.get('/CompareDashSomsSterlingLogs', Compare_Dashboard_Soms_Sterling_Logs.index);
router.get('/CompareDashSomsSterling', Compare_Dashboard_Soms_Sterling.index );
router.get('/CompareDashSomsFull', Compare_Dashboard_SomsFull.index );
router.get('/CompareDashSomsFullLogs', Compare_Dashboard_SomsFull_Logs.index );
router.get('/CompareDashboardLogs', Compare_Dashboard_Logs.index );

module.exports = router;

