const Joi = require('joi');
const { errorHandler } = require('./i18n.js')

const registerValidation = (data) =>{
  const schema = Joi.object({
    email : Joi.string().required().email().min(10).max(30).error(errors=>{
      return errorHandler(errors);
    }),
    password : Joi.string().required().alphanum().min(10).max(30).error(errors=>{
      return errorHandler(errors);
    }),
  })
  return schema.validate(data);
}

const loginValidation = (data) =>{
  const schema = Joi.object({
    email : Joi.string().required().email().min(10).max(30).error(errors=>{
      return errorHandler(errors);
    }),
    password : Joi.string().required().alphanum().min(10).max(30).error(errors=>{
      return errorHandler(errors);
    }),
  })
  return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
