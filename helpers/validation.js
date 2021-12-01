const Joi = require('@hapi/joi')

const registerValidataion = (data) =>{
  const schema = Joi.object({
    email : Joi.string().email().min(5).max(40).required(),
    password : Joi.string().alphanum().min(5).max(20).required(),
  })
  
  return Joi.validate(data, schema)
}

const loginValidation = (data) =>{
  const schema = Joi.object({
    email : Joi.string().email().min(5).max(40).required(),
    password : Joi.string().alphanum().min(5).max(20).required(),
  })

  return Joi.validate(data, schema)
}

module.exports.registerValidataion = registerValidataion;
module.exports.loginValidation = loginValidation;
