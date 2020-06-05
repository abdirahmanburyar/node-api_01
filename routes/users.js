const router = require('express').Router()
const Users = require("../models/User")
require('dotenv').config()
const { sign } = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../utils/validations')
const { uploadImg } = require('../multer')
const passport = require('passport')

const { handleSignIn, createSession, getAuthTokenId } = require('./controllers/sign')

const getToken = async (payload) => {
    return await sign(payload, 'thisissecret', { expiresIn: '1 h'})
}


module.exports = {
    registerUser: () => {
        return router.post('/register', async (req, res) => {
            const { errors, isValid } = registerValidation(req.body)
            if(!isValid) return res.status(400).json(errors)
            const checkUser = await Users.findOne({ email: req.body.email })
            if(checkUser) return res.status(400).json({ Err: 'Email already in use' })
            const userData = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                createdAt: Date.now()
            }
            const user = await new Users(userData)
            const saveUser = await user.save();
            const payload = {
                userId: saveUser._id
            }
            const token = await getToken(payload)
            return res.status(200).json({ access: true, authenticate: `Bearer ${token}`, userId: saveUser._id })
        })
    },
    login: () => {
        return router.post('/login', async (req, res) => {
            const { errors, isValid } = loginValidation(req.body)
            if(!isValid) return res.status(400).json(errors)
            const { authorization } = req.headers
            return await authorization ? getAuthTokenId(req, res) : 
                handleSignIn(req, res)
                    .then(data => {
                        return data._id && data.email ? createSession(data) : Promise.reject(data)
                    })
                    .then(data => {
                        return res.status(200).json(data)
                    })
                    .catch(err => res.status(400).json(err))
        })
    },
    fetchAllUsers: () => {
        return router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
            try {
                const users = await Users.find()
                if(users.length < 0) return res.status(400).json({ msg: 'Zero Users'})
                return res.status(200).json({ users })
            }catch(e){
                console.log(e)
            }
        })
    },
    profile: () => {
        return router.post('/profile', passport.authenticate('jwt', { session: false }), uploadImg(), async (req, res) => {
            const userPrfile = await Users.findOneAndUpdate({_id: req.user._id}, { $set: { photo: req.file.filename }})
            if(userPrfile){
                const user = await Users.findById({ _id: req.user._id})
                return res.status(200).json({ userProfile: user })
            }
        })
    }
}