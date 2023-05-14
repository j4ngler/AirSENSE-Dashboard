const express = require('express');
const isAuthenticated = require('../middlewares/authenticate');
const isAuthenticatedCustomer = require('../middlewares/authenticateCustomer')
const router = express.Router();
const AuthenticationController = require('../app/controllers/authentication.controller')
const {validate} = require("../config/joi.validate.js")
const schema = require("../utils/validator.js");

router.post('/login',validate(schema.login),AuthenticationController.login)
router.post('/login/customer', validate(schema.login), AuthenticationController.loginCustomer)
router.get('/user',isAuthenticated, AuthenticationController.getUserInformation)
router.get('/customer',isAuthenticatedCustomer, AuthenticationController.getCustomerInformation)

module.exports = router;
