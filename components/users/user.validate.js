const Joi = require('joi')
const schemas = {
  userPost: Joi.object().keys({
    username: Joi.string()
      .empty()
      .required(),
    userForWeb: Joi.boolean(),
    email: Joi.string().email(),
    password: Joi.string()
      .min(8)
      .required()
  }),
  userDelete: Joi.object().keys({
    id: Joi.string().required()
  }),
  
  loginFB: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string()
  }),
  setUsername: Joi.object().keys({
    newName: Joi.string()
      .empty()
      .required(),
    password: Joi.string()
      .required()
  })
}
module.exports = schemas
