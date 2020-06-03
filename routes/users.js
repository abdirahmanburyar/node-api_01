const router = require('express').Router()
const Users = require("../models/User")
require('dotenv').config()
const { sign } = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../utils/validations')
const { uploadImg } = require('../multer')
const passport = require('passport')
const redis = require('redis')
const redisClient = redis.createClient(process.env.REDIS_URI || { host: '127.0.0.1'})
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
            console.log(req.headers.authorization)
            try {
                const { errors, isValid } = loginValidation(req.body)
                if(!isValid) return res.status(400).json(errors)
                const checkUser = await Users.findOne({ email: req.body.email })
                if(!checkUser) return res.status(400).json({ Err: 'User not found' })
                const checkUserPass = await checkUser.checkPassword(req.body.password)
                if(!checkUserPass) return res.status(400).json({ Err: 'Email/Password incorrent' })
                const payload = {
                    userId: checkUser._id
                }
                const token = await getToken(payload)
                // await redisClient.set(token, checkUser._id)
                return res.status(200).json({ access: true, authenticate: `Bearer ${token}`, userId: checkUser._id })
            }catch(e){ console.log(e)}
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