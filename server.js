const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
require('dotenv').config()

const app = express()
const sessionsRouter = require('./routes/sessions')
const toDosRouter = require('./routes/toDos')

//middleware
app.use(cors());
app.use(express.json())//for parsing application/json
app.use('/api/sessions', sessionsRouter)
app.use('/api/toDos', toDosRouter)
app.use(express.static('public'))

//mongoDB connection
async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to MongoDB')
    } catch (err) {
        console.error('could not connect to MongoDB', err)
    }
}
connectToMongoDB()

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on ${port}`))