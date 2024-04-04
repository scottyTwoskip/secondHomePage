const mongoose = require('mongoose');

// Schema defines the structure of the document
const logSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    hours: Number,
    minutes: Number,
    seconds: Number,
});

// Model is a wrapper around the schema providing an interface to the database
const Log = mongoose.model('Log', logSchema);

module.exports = Log;
