const express = require("express");
const shrimpLake = require("../controllers/shrimpLake.controller.js");

const router = express.Router();



router
  .route("/getMeasureStation")
  .get((req, res) => shrimpLake.getAllStation(req, res));


router
  .route("/dataSensor")
  .post((req, res) => shrimpLake.getDataStation(req, res));

  router
  .route("/getReportStations")
  .post((req, res) => shrimpLake.getReportStations(req, res));

module.exports = router;
