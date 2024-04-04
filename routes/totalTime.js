// routes/totalTime.js
const express = require('express');
const router = express.Router();
const TotalTime = require('../models/TotalTime'); // Assuming you have a TotalTime model

// POST route to update total time
router.post('/', async (req, res) => {
    try {
        // Assuming a single document approach. You might want to find and update the existing total time document
        const updatedTotalTime = await TotalTime.findOneAndUpdate({}, { $set: { totalTimeInSeconds: req.body.totalTime } }, { new: true, upsert: true });
        res.json(updatedTotalTime);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET route to fetch total time
router.get('/', async (req, res) => {
    try {
        const totalTimeDocument = await TotalTime.findOne({});
        res.json(totalTimeDocument);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
