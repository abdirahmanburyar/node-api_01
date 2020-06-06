require('dotenv').config()
const redis = require('redis')
const Users = require('../../models/User')
const redisClient = redis.createClient(process.env.REDIS_URI)
const { sign } = require('jsonwebtoken')

const setTokenId = async ({ _id, email }) => {
    const payload = {
        userId: _id,
        email
    }
    return await sign(payload, 'thisissecret', { expiresIn: '1h'})
}

const handleSignIn = async (req, res) => {
        const checkUser = await Users.findOne({ email: req.body.email })
        if(!checkUser) return Promise.reject({ Err: 'User not found'})
        const checkUserPass = await checkUser.checkPassword(req.body.password)
        if(!checkUserPass) return Promise.reject({ Err: 'Email/Password incorrent' })
        return checkUser
}

const setToken = (key, value) => {
    return Promise.resolve(redisClient.set(`${key}`, `${value}`))
};

const createSession = async (data) => {
    const { _id } = data
    const token = await setTokenId(data)
    return await setToken(`Bearer ${token}`, _id)
        .then(() => {
            return { success: 'true', userId: _id, token: `Bearer ${token}` }
        })
        .catch(err => console.log(err))
    
}

const getAuthTokenId = async (req, res) => {
    const { authorization } = req.headers
    console.log(authorization)
    return await redisClient.get(authorization, (err, reply) => {
        if(err || !reply){
            return res.status(400).json('Unathorized')
        }
        return res.status(200).json({ id: reply})
    })
}

module.exports = {
    handleSignIn,
    createSession,
    getAuthTokenId,
    redisClient
}