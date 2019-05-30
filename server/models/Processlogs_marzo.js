const mongoose = require('mongoose');
const { Schema } = mongoose;

const processSchemaMarzo = new Schema({
    createdAt: { type: Date, required: 'Date cannot be null or empty' },
    request: Object,
    sterling: Object,
    soms: Object,
    ga1: Object,
    ga: Object
},
{ collection : 'processlogs_marzo' });

module.exports = mongoose.model('processlogs_marzo', processSchemaMarzo);