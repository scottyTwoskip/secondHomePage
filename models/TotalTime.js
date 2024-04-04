// models/TotalTime.js
const mongoose = require('mongoose');

const TotalTimeSchema = new mongoose.Schema({
    totalTimeInSeconds: { type: Number, default: 0 },
});

module.exports = mongoose.model('TotalTime', TotalTimeSchema);
