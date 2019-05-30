const mongoose = require('mongoose');
const { Schema } = mongoose;

const DashboardSomsFull = new Schema({
    // Soms Full
    sku: String,
    remision: String,
    fecha_prom_1: String,
    fecha_prom_2: String,
    fecha_em: String,
    fecha_fin: String,
    no_tienda: String,
    comentario: String,
    mesaevento: String,
    // Dashboard
    sku_dash: String,
    remision_dash: String,
    fechaEstimada_1_dash: String,
    fechaEstimada_2_dash: String,
    fecha_consulta_dash: String,
    cp_dash: String,
    cantidad_dash: String,
    canal_dash: String,
    tipoPago_dash: String
});

module.exports = mongoose.model('DashboardSomsFull', DashboardSomsFull);