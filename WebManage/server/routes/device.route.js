const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');
const {validate} = require("../config/joi.validate.js")
const schema = require("../utils/validator.js");

router.get('/',deviceController.getHomesByUserId)
module.exports = router