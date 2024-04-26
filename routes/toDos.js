const express = require('express')
const router = express.Router()
const ToDos = require('../models/ToDos')
//create a new session with a start time
router.post('/', async (req, res) => {
    try {
        const { date, toDoData } = req.body
        if (!startedAt) {
            return res.status(400).json({ message: "ToDo is required" })
        }
        const toDo = await ToDos.create({ date, toDoData })
        res.status(201).json(session)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
})
//update an existing session with an end time
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { endedAt } = req.body


        if (!endedAt) {
            return res.status(400).json({ message: "endedAt is required" })
        }

        const session = await Sessions.findByIdAndUpdate(id, { endedAt }, { new: true })

        if (!session) {
            return res.status(404).send('Session not found')
        }

        res.json(session)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
});



router.get('/', async (req, res) => {
    try {
        const sessions = await Sessions.find({})
        res.json(sessions)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})
//delete a given session by id
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const session = await Sessions.findByIdAndDelete(id)
        if (!session) {
            return res.status(404).send('Session not found')
        }
        res.status(204).send()
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
});
module.exports = router