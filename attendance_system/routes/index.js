const express = require("express");
const router = express.Router();
const attendanceController = require('../app/controllers/attendance.controller')
router.post("/attendance",attendanceController.checkLocation, attendanceController.attendance);
router.get("/",(req,res)=>{
    res.json("ok")
})

module.exports = router;
