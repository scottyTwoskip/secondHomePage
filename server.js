const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const logsRouter = require('./routes/logs')//importing router here

//middleware
app.use(express.json())//for parsing application/json
app.use('/api/logs', logsRouter)//using router here

//mongoDB connection
async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology })
        console.log('connected to MongoDB')
    } catch (err) {
        console.error('could not connect to MongoDB', err)
    }
}
connectToMongoDB()

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on ${port}`))