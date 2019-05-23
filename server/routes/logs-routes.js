const express = require('express');
const router = express.Router();
// Controllers
const logsController = require('../controllers/logsController');
const convertJsonController = require('../controllers/convertJsonController');
const cleanDataLogs = require('../controllers/cleanDataLogs');
const compareData = require('../controllers/compareData');
const compareSomsSterlingDashboard = require('../controllers/Compare_Soms_Sterling_Dashboard');
// File Upload
const { upload } = require('../utils/index');

router.get('/logs/:fechaInicio/:fechaFin/:filename', logsController.index);
router.post('/upload', upload.single('csv'), logsController.upload);

router.get('/convertjson', convertJsonController.index);
router.get('/cleandatalogs', cleanDataLogs.index);
router.get('/comparedata', compareData.index);
router.get('/compareSSD', compareSomsSterlingDashboard.index );

module.exports = router;

