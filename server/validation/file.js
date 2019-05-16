const Validator = require('validator');
const isEmpty = require('./isEmpty');
const path = require('path');
const fs = require('fs');

module.exports = function validateFile(data) {
    let errors = {};

    if (data.file) {
        // Allowed ext
        const filetypes = /csv/;
        // Check ext
        const extname = filetypes.test(path.extname(data.file.originalname).toLowerCase());

        if (!extname) {
            errors.file = 'Only CSV type files are accepted!';
            // Remove file
            fs.unlink(data.file.path, (err) => {
                if (err) {
                    console.log(err);
                    return
                }
                // File removed
            });
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}