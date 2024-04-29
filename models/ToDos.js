const mongoose = require('mongoose');

const ToDosSchema = new mongoose.Schema({
    date: { type: Date, required: false },
    toDo: { type: String, required: true },
    important: { type: Boolean, default: false }
});

module.exports = mongoose.model('ToDos', ToDosSchema);
