const mongoose = require('mongoose');
const { Schema } = mongoose;

const processSchema = new Schema({
    createdAt: { type: Date, required: 'Date cannot be null or empty' },
    request: Object,
    sterling: Object,
    soms: Object,
    ga1: Object,
    ga: Object
});

module.exports = mongoose.model('ProcessLog', processSchema);
