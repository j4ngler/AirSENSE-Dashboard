const express = require("express");
const enoseControlCtrl = require("../controllers/enose.controller");
const isAuthenticated = require("../middlewares/authenticate.js");
const router = express.Router();

// Control device
router.post("/device/:id", isAuthenticated, (req, res) => {
  enoseControlCtrl.controlDevice(req, res);
});

// Get control history
router.get("/history", isAuthenticated, (req, res) => {
  enoseControlCtrl.getControlHistory(req, res);
});

// Get system status
router.get("/status", isAuthenticated, (req, res) => {
  enoseControlCtrl.getSystemStatus(req, res);
});

// Start measurement
router.post("/measurement/start", isAuthenticated, (req, res) => {
  enoseControlCtrl.startMeasurement(req, res);
});

// Get settings
router.get("/settings", isAuthenticated, (req, res) => {
  enoseControlCtrl.getSettings(req, res);
});

// Update settings
router.put("/settings", isAuthenticated, (req, res) => {
  enoseControlCtrl.updateSettings(req, res);
});

// Get last measurement info
router.get("/measurement/last", isAuthenticated, (req, res) => {
  enoseControlCtrl.getLastMeasurement(req, res);
});

module.exports = router;
