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

  login: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }),

  storeEnterprise: Joi.object({
    name: Joi.string().required(),
    token: Joi.string().required(),
  }),

  storeGroup: Joi.object({
    name: Joi.string().required(),
    enterprise_id: Joi.required(),
  }),

  commentTopic: Joi.object({
    topic:Joi.string().required(),
  }),
  
  commentUser: Joi.object(
    {
      user_id: Joi.string().required(),
    }
  ),

  comment: Joi.object(
    {
      topic: Joi.string().required(),
      comment: Joi.string().required(),
      comment_atack: Joi.string(),
      comment_reply_id: Joi.string(),
    }
  ),
  commentId: Joi.object(
    {
      id: Joi.string().required(),
    }
  ),


};
