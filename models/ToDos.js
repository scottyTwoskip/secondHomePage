
const mongoose = require('mongoose');

const ToDossSchema = new mongoose.Schema({
    date: { type: Date, required: false },
    toDo: { type: String, required: true }
});



module.exports = mongoose.model('ToDos', ToDossSchema);
