const express = require('express');
const router = express.Router();
// Controllers
const logsController = require('../controllers/logsController')
// File Upload
const { upload } = require('../utils/index');

// router.get('/logs', logsController.index);
router.get('/logs/:fechaInicio/:fechaFin/:filename', logsController.index);
router.post('/upload', upload.single('csv'), logsController.upload);

module.exports = router;

