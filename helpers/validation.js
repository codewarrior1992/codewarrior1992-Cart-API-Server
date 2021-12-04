const Joi = require('joi');

const registerValidation = (data) =>{
  const schema = Joi.object({
    email : Joi.string().min(14).max(35).email().required(),
    password : Joi.string().alphanum().min(5).max(20).required()
  })
  return schema.validate(data);
}

const loginValidation = (data) =>{
  const schema = Joi.object({
    email : Joi.string().min(14).max(35).email().required(),
    password : Joi.string().alphanum().min(5).max(20).required(),
  })

  return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
