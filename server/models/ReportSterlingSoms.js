const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSterlingSoms = new Schema({
    No_Orden_PQ: String,
    ID_de_articulo: String,
    Nombre_Alm_Aprovisiona: String,
    Zona_Alm_Aprovisiona: String,
    NO_Alm_Entrega_C_and_C: String,
    Enviar_a_Codigo_Postal: String,
    Piezas_Linea: String,
    remision: String,
    fecha_prom_1: String,
    Proceso_de_Linea: String
});

module.exports = mongoose.model('ReportSterlingSoms', reportSterlingSoms);
