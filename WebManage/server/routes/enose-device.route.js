const express = require("express");
const enoseDeviceCtrl = require("../controllers/enose-device.controller");
const isAuthenticated = require("../middlewares/authenticate.js");
const router = express.Router();

// Get latest sensor data
router.get("/data/latest", isAuthenticated, (req, res) => {
  enoseDeviceCtrl.getLatestSensorData(req, res);
});

// Get measurement history
router.get("/data/history", isAuthenticated, (req, res) => {
  enoseDeviceCtrl.getMeasurementHistory(req, res);
});

// Get all devices
router.get("/", isAuthenticated, (req, res) => {
  enoseDeviceCtrl.getDevices(req, res);
});

// Create device
router.post("/", isAuthenticated, (req, res) => {
  enoseDeviceCtrl.createDevice(req, res);
});

// Get device by ID
router.get("/:id", isAuthenticated, (req, res) => {
  enoseDeviceCtrl.getDeviceById(req, res);
});

// Update device
router.put("/:id", isAuthenticated, (req, res) => {
  enoseDeviceCtrl.updateDevice(req, res);
});

// Delete device
router.delete("/:id", isAuthenticated, (req, res) => {
  enoseDeviceCtrl.deleteDevice(req, res);
});

// Get device status
router.get("/:id/status", isAuthenticated, (req, res) => {
  enoseDeviceCtrl.getDeviceStatus(req, res);
});

module.exports = router;
