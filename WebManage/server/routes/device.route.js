const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');
const {validate} = require("../config/joi.validate.js")
const schema = require("../utils/validator.js");

router.get('/home',deviceController.getHomesByUserId)
router.get('/',deviceController.getDevicesByHomeId)
router.get('/devices-by-user',deviceController.getListDevicesByUserId)
router.get('/users-by-home',deviceController.getCustomerByHomeId)
router.get('/devices-by-id',deviceController.getDeviceById)
router.post('/',deviceController.postDevice)
module.exports = router