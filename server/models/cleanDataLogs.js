const mongoose = require('mongoose');
const { Schema } = mongoose;

const cleanDataLogs = new Schema({
    sku: String,
    clickCollect: String,
    zipCode: String,
    edd1: String,
    edd2: String,
    fecConsulta: String,
    ubicacion: String,
    piezas: String,
    apventa: String,
    bdubicacion: String,
    fecbloqueo: String,
    finbloqueo: String,
    factseguridad: String,
    capacidadtienda: String,
    dias: String,
    rechazo: String
});

module.exports = mongoose.model('CleanDataLogs', cleanDataLogs);
