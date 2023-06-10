const Joi = require("joi");

module.exports = {
  storeUser: Joi.object({
    fullname: Joi.string().min(6).required(),
    phone: Joi.string()
      .pattern(new RegExp("^(09|03|07|08|05)+([0-9]{8})$"))
      .required(),
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
    avatar: Joi.string(),
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
    userName: Joi.string().required(),
    fullName: Joi.string().min(4).required(),
    email: Joi.string().required(),
    // contact: Joi.string().required(),
    phoneNumber: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    address: Joi.string().required(),
    // avatar: Joi.string().required(),
  }),

  storeEnterprise: Joi.object({
    name: Joi.string().required(),
    token: Joi.string().required(),
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  newResetPassword: Joi.object({
    password: Joi.string().required(),
    token: Joi.string().required(),
    userId: Joi.string().required(),
  }),

  storeGroup: Joi.object({
    name: Joi.string().required(),
    enterprise_id: Joi.required(),
  }),
  registerCustomer: Joi.object({
    fullName: Joi.string().required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    phoneNumber: Joi.string().min(6).required(),
    contact: Joi.string().required(),
    userName: Joi.string().required(),
    // avatar: Joi.string().required(),
  }),

  //validate customer info before update
  updateCustomerInfo: Joi.object({
    customer_id: Joi.number(),
    // email: Joi.string(),
    userName: Joi.string(),
    fullName: Joi.string(),
    contact: Joi.string(),
    address: Joi.string(),
    phoneNumber: Joi.string(),
    updated_at: Joi.date()
  }),

  //validate user info
  updateUserInfo: Joi.object({
    user_id: Joi.number(),
    userName: Joi.string(),
    fullName: Joi.string(),
    address: Joi.string(),
    phoneNumber: Joi.string(),
    updated_at: Joi.date()
  }),


  //validate password after changing
  changeCusPass: Joi.object({
    email: Joi.string(),
    old_password: Joi.string(),
    new_password: Joi.string()
  })
};
