const express = require("express");
const powerCtrl = require("../controllers/power.controller.js");

const router = express.Router();



router
  .route("/getPowerMeasureStation")
  .get((req, res) => powerCtrl.getAllStation(req, res));


router
  .route("/dataSensor")
  .post((req, res) => powerCtrl.getDataStation(req, res));


router
  .route("/getReportStations")
  .post((req, res) => powerCtrl.getReportStations(req, res));

module.exports = router;
