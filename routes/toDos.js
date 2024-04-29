const express = require('express');
const router = express.Router();
const ToDos = require('../models/ToDos');

// Create a new To-Do
router.post('/', async (req, res) => {
    try {
        const { date, toDo, important } = req.body;
        if (!toDo) {
            return res.status(400).json({ message: "ToDo is required" });
        }
        const newToDo = await ToDos.create({ date, toDo, important });
        res.status(201).json(newToDo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update an existing To-Do
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { toDo, important } = req.body;

        if (!toDo) {
            return res.status(400).json({ message: "ToDo data is required" });
        }

        const updatedToDo = await ToDos.findByIdAndUpdate(id, { toDo, important }, { new: true });

        if (!updatedToDo) {
            return res.status(404).send('ToDo not found');
        }

        res.json(updatedToDo);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Get all To-Dos
router.get('/', async (req, res) => {
    try {
        const todos = await ToDos.find({});
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Delete a given To-Do by id
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedToDo = await ToDos.findByIdAndDelete(id);
        if (!deletedToDo) {
            return res.status(404).send('ToDo not found');
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = router;
