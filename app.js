const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const controller = require('./routes/users')
const mongoose = require('mongoose')
const path = require('path')
app.use(express.static(path.join(__dirname, './assets')))
const passport = require('passport')
app.use(passport.initialize())
require('./auth/passport')(passport)
//connecting to the mongo database
mongoose.connect('mongodb://mongo:27017/digitaloccean-docker',
{useNewUrlParser: true, useUnifiedTopology: true},
 () => {
    console.log('database has been connected');
    
})

app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.send('hellow-world')
})

//users route
app.use('/api/users/', controller.registerUser())
app.use('/api/users/', controller.login())
app.use('/api/users/', controller.profile())

const PORT = process.env.PORT | 5000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})