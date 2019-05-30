const mongoose = require('mongoose');
const { Schema } = mongoose;

const jsonMayo = new Schema({
    mesaevento: String,
    fecha_em: String,
    remision: String,
    sku: String,
    edo_reng: String,
    fecha_prom_1: String,
    fecha_prom_2: String,
    fecha_fin: String,
    no_tienda: String,
    comentario: String
});

module.exports = mongoose.model('JsonMayo', jsonMayo);
