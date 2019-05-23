const mongoose = require('mongoose');
const { Schema } = mongoose;

const dataSterling = new Schema({
    no_loc_vta: String,
    mesaevento: String,
    fecha_em: String,
    remision: String,
    edo_cabe: String,
    fecha_prom: String,
    fecha_prom_1: String,
    a: String
});

module.exports = mongoose.model('DataSterling', dataSterling);
