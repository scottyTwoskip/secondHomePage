const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
require('dotenv').config()

const app = express()
const logsRouter = require('./routes/logs')//importing router here
const totalTimeRouter = require('./routes/totalTime')

//middleware
app.use(cors());
app.use(express.json())//for parsing application/json
app.use('/api/logs', logsRouter)//using router here
app.use('/api/totalTime', totalTimeRouter)
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