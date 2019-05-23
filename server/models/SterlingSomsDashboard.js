const mongoose = require('mongoose');
const { Schema } = mongoose;

const SrterlingSomsDashboard = new Schema({
    // STERLING SOMS
    No_Orden_PQ: String,
    ID_de_articulo: String,
    Nombre_Alm_Aprovisiona: String,
    Zona_Alm_Aprovisiona: String,
    NO_Alm_Entrega_C_and_C: String,
    Enviar_a_Codigo_Postal: String,
    Piezas_Linea: String,
    Proceso_de_Linea: String,
    remision: String,
    fecha_prom_1: String,
    // Dashboard
    canal: String,
    fechaEstimada_1: String,
    fechaEstimada_2: String,
    fecha: String,
    noPedido: String,
    sku: String,
    cp: String,
    canal: String,
    cantidad: String
});

module.exports = mongoose.model('SrterlingSomsDashboard', SrterlingSomsDashboard);
