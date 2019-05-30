const mongoose = require('mongoose');
const { Schema } = mongoose;

const tiendasLogs = new Schema({
    sku: String,
    zipCode: String,
    ubicacion: String,
    piezas: String
});

module.exports = mongoose.model('TiendasLogs', tiendasLogs);
