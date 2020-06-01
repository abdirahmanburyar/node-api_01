const Validator = require("validator")

module.exports = {
    registerValidation: ({ name, email, password }) => {
        const errors = {}
        if(Validator.isEmpty(name)){
            errors.name = "name is required"
        }else if(!Validator.isLength(name, { min: 3, max: 30 })){
            errors.name = "name must be atleast 3 charecters"
        }

        if(Validator.isEmpty(email)){
            errors.email = "Email is required"
        }else if(!Validator.isEmail(email)){
            errors.email = "invalid Email "
        }

        if(Validator.isEmpty(password)){
            errors.password = "Password is required"
        }else if(!Validator.isLength(password, { min: 6, max: 256 })){
            errors.password = "password must be atleast 6 charecters long"
        }

        return {
            errors,
            isValid: Object.keys(errors) < 1
        }

    },
    loginValidation: ({ email, password }) => {
        const errors = {}

        if(Validator.isEmpty(email)){
            errors.email = "Email is required"
        }else if(!Validator.isEmail(email)){
            errors.email = "invalid Email "
        }

        if(Validator.isEmpty(password)){
            errors.password = "Password is required"
        }

        return {
            errors,
            isValid: Object.keys(errors) < 1
        }

    }
}