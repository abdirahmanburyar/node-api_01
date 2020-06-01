const { Schema, model } = require('mongoose')
const { hashSync, compare } = require('bcryptjs')
const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: String,
    photo: String
})

userSchema.pre('save', function(next){
    if (!this.isModified('password')) return next();
    this.password = hashSync(this.password, 12)
    next()
})

userSchema.methods.checkPassword = async function(password) {
    return await compare(password, this.password);
};

module.exports = model("Users", userSchema)