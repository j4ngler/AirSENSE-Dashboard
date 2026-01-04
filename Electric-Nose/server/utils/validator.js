const Joi = require("joi");

module.exports = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  register: Joi.object({
    userName: Joi.string().required(),
    fullName: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    address: Joi.string().required(),
  }),

  changePassword: Joi.object({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
  }),

  updateInfoUser: Joi.object({
    fullname: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string(),
  }),
};

