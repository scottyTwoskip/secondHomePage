
const mongoose = require('mongoose');

const SessionsSchema = new mongoose.Schema({
    totalTimeInSeconds: { type: Number, required: true },
    startedAt: { type: Date, required: true }
});

module.exports = mongoose.model('Sessions', SessionsSchema);
