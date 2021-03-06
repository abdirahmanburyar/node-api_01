const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const controller = require('./routes/users')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
app.use(express.static(path.join(__dirname, './assets')))
const passport = require('passport')
app.use(passport.initialize())
require('./auth/passport')(passport)
require('dotenv').config()
const logger = require('morgan')

//connecting to the mongo database
mongoose.connect(process.env.MONGO_URI,
{ useNewUrlParser: true, useUnifiedTopology: true },
 () => {
    console.log('database has been connected');
})

app.use(bodyParser.json())
app.use(cors())
app.get('/', (req, res) => {
    res.send('<h1>hellow-world</h1>')
})
app.use(logger("dev"))
//users route
app.use('/api/users/', controller.registerUser())
app.use('/api/users/', controller.login())
app.use('/api/users/', controller.profile())
app.use('/api/users/', controller.fetchAllUsers())

const PORT = 5000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})