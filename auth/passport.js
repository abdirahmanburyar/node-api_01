const Users = require('../models/User')
const { Strategy, ExtractJwt } = require('passport-jwt')

const opt = {}

opt.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opt.secretOrKey = 'thisissecret'

module.exports = passport => {
    passport.use(new Strategy(opt, async (payload, done) => {
        const user = await Users.findById(payload.userId)
        if(user){
            return done(null, user)
        }
        done(null, false)
    }))
}