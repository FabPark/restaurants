require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

//this connects to mongoose
mongoose.connect(process.env.DATABASE_URL, {useNewURLParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const restaurantsRouter = require('./routes/restaurants')
app.use('/restaurants', restaurantsRouter)


app.listen(3000, () => console.log('Server Started'))
