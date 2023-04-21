const express = require('express');
const authenticated = require('../middlewares/authenticate');
const router = express.Router();
const AuthenticationController = require('../app/controllers/authentication.controller')

router.post('/login',AuthenticationController.login)

module.exports = router;
