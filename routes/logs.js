const express = require('express');
const router = express.Router();
const Log = require('../models/Log')
// get all logs
router.get('/', async (req, res) => {
    try {
        const logs = await Log.find()
        res.json(logs)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
//post a new log
router.post('/', async (req, res) => {
    const log = new Log({
        hours: req.body.hours,
        minutes: req.body.minutes,
        seconds: req.body.seconds,
    })

    try {
        const newLog = await log.save()
        res.status(201).json(newLog)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router