const mongoose = require('mongoose');
const { Schema } = mongoose;

const dashBoard = new Schema({
    canal: String,
    fechaEstimada_1: String,
    fechaEstimada_2: String,
    fecha: String,
    noPedido: String,
    sku: String,
    cp: String,
    cantidad: String,
    tipoPago: String
});

module.exports = mongoose.model('DashBoard', dashBoard);