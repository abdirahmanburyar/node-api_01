const router = require('express').Router()
const Users = require("../models/User")
const { sign } = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../utils/validations')
const passport = require('passport')
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
            return res.status(200).json({ access: true, authenticate: token })
        })
    },
    login: () => {
        return router.post('/login', async (req, res) => {
            const { errors, isValid } = loginValidation(req.body)
            const checkUser = await Users.findOne({ email: req.body.email })
            if(!checkUser) return res.status(400).json({ Err: 'User not found' })
            const checkUserPass = await checkUser.checkPassword(req.body.password)
            if(!checkUserPass) return res.status(400).json({ Err: 'Email/Password incorrent' })
            const payload = {
                userId: checkUser._id
            }
            const token = await getToken(payload)
            return res.status(200).json({ access: true, authenticate: `Bearer ${token}` })
        })
    },
    profile: () => {
        return router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
            res.status(200).json({ user: req.user._id})
        })
    }
}