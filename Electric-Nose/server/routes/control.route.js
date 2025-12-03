const express = require("express");
const controlCtrl = require("../controllers/control.controller");
const isAuthenticated = require("../middlewares/authenticate.js");
const router = express.Router();

// Control device
router.post("/device/:id", isAuthenticated, (req, res) => {
  controlCtrl.controlDevice(req, res);
});

// Get control history
router.get("/history", isAuthenticated, (req, res) => {
  controlCtrl.getControlHistory(req, res);
});

// Get system status
router.get("/status", isAuthenticated, (req, res) => {
  controlCtrl.getSystemStatus(req, res);
});

// Start measurement
router.post("/measurement/start", isAuthenticated, (req, res) => {
  controlCtrl.startMeasurement(req, res);
});

// Get settings
router.get("/settings", isAuthenticated, (req, res) => {
  controlCtrl.getSettings(req, res);
});

// Update settings
router.put("/settings", isAuthenticated, (req, res) => {
  controlCtrl.updateSettings(req, res);
});

// Last measurement info
router.get("/measurement/last", isAuthenticated, (req, res) => {
  controlCtrl.getLastMeasurement(req, res);
});

module.exports = router;

