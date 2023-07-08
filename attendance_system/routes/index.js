const express = require("express");
const router = express.Router();
const attendanceController = require('../app/controllers/attendance.controller')
router.post("/attendance", attendanceController.attendance);

module.exports = router;
