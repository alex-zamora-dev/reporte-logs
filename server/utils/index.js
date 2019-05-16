const path = require('path');
const multer = require('multer');

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/csv/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

// Init Upload instance and receive a single file
const upload = multer({
    storage: storage
  });
  
  module.exports = {
    upload
  }