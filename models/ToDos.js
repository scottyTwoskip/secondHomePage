
const mongoose = require('mongoose');

const ToDossSchema = new mongoose.Schema({
    date: { type: Number, required: false },
    toDo: { type: String, required: true }
});



module.exports = mongoose.model('ToDos', ToDossSchema);
