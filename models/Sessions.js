
const mongoose = require('mongoose');

const SessionsSchema = new mongoose.Schema({
    startedAt: { type: Number, required: true },
    endedAt: { type: Number, required: false }
});

SessionsSchema.virtual('totalTimeInSeconds').get(function () {
    //to clarify this as a variable
    const session = this
    return Math.floor((session.endedAt - session.startedAt) / 1000)
})

module.exports = mongoose.model('Sessions', SessionsSchema);
