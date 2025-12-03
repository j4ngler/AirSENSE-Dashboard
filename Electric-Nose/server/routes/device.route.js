const express = require("express");
const deviceCtrl = require("../controllers/device.controller");
const isAuthenticated = require("../middlewares/authenticate.js");
const router = express.Router();

// Get latest sensor data
router.get("/data/latest", isAuthenticated, (req, res) => {
  deviceCtrl.getLatestSensorData(req, res);
});

// Get measurement history
router.get("/data/history", isAuthenticated, (req, res) => {
  deviceCtrl.getMeasurementHistory(req, res);
});

// Get all devices
router.get("/", isAuthenticated, (req, res) => {
  deviceCtrl.getDevices(req, res);
});

// Create device
router.post("/", isAuthenticated, (req, res) => {
  deviceCtrl.createDevice(req, res);
});

// Get device by ID
router.get("/:id", isAuthenticated, (req, res) => {
  deviceCtrl.getDeviceById(req, res);
});

// Update device
router.put("/:id", isAuthenticated, (req, res) => {
  deviceCtrl.updateDevice(req, res);
});

// Delete device
router.delete("/:id", isAuthenticated, (req, res) => {
  deviceCtrl.deleteDevice(req, res);
});

// Get device status
router.get("/:id/status", isAuthenticated, (req, res) => {
  deviceCtrl.getDeviceStatus(req, res);
});

module.exports = router;

