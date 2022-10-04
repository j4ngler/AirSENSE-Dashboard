const Joi = require('joi');

module.exports =  {
  storeUser: Joi.object({
    fullname: Joi.string().min(6).required(),
    phone: Joi.string().pattern(new RegExp('^(09|03|07|08|05)+([0-9]{8})$')).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  updateUser: Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  updateInfoUser: Joi.object({
    table: Joi.string().required(),
    userid: Joi.number().required(),
    name: Joi.string().required(),
    fullname: Joi.string().required(),
    phone: Joi.string().required(),
    contact: Joi.string().required(),
    avartar: Joi.string()
  }),

  changePassword: Joi.object({
    table: Joi.string().required(),
    userid: Joi.number().required(),
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
  }),

  login: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }),

  register: Joi.object({
    name: Joi.string().required(),
    fullname: Joi.string().min(4).required(),
    email: Joi.string().required(),
    contact: Joi.string().required(),
    phoneNumber: Joi.string().min(6).required(),
    password: Joi.string().min(6).required()
  }),

  storeEnterprise: Joi.object({
    name: Joi.string().required(),
    token: Joi.string().required(),
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  newResetPassword: Joi.object({
    password: Joi.string().required(),
    token: Joi.string().required(),
    userId: Joi.string().required()
  }),

  storeGroup: Joi.object({
    name: Joi.string().required(),
    enterprise_id: Joi.required(),
  }),
};
