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

// Get device status from MongoDB (real-time)
router.get("/:id/status/mongo", isAuthenticated, (req, res) => {
  deviceCtrl.getDeviceStatusFromMongo(req, res);
});

// Get measurement files
router.get("/measurements/files", isAuthenticated, (req, res) => {
  deviceCtrl.getMeasurementFiles(req, res);
});

// Get measurement file detail
router.get("/measurements/files/:file_name", isAuthenticated, (req, res) => {
  deviceCtrl.getMeasurementFileDetail(req, res);
});

// Get active measurement (đang chạy)
router.get("/measurements/active", isAuthenticated, (req, res) => {
  deviceCtrl.getActiveMeasurement(req, res);
});

// Get sensor data by time range
router.get("/data/time-range", isAuthenticated, (req, res) => {
  deviceCtrl.getSensorDataByTimeRange(req, res);
});

// ========== ROUTES ĐỌC TỪ COLLECTION 'sensor' CHUNG CỦA AIRSENSE ==========

// Lấy dữ liệu sensor mới nhất từ collection 'sensor' (AirSENSE common collection)
router.get("/airsense/latest", isAuthenticated, (req, res) => {
  deviceCtrl.getLatestSensorDataFromAirSENSE(req, res);
});

// Lấy dữ liệu sensor mới nhất theo device ID từ collection 'sensor'
router.get("/:id/airsense/latest", isAuthenticated, (req, res) => {
  deviceCtrl.getLatestSensorDataFromAirSENSE(req, res);
});

// Lấy lịch sử đo từ collection 'sensor'
router.get("/airsense/history", isAuthenticated, (req, res) => {
  deviceCtrl.getMeasurementHistoryFromAirSENSE(req, res);
});

// Lấy lịch sử đo theo device ID từ collection 'sensor'
router.get("/:id/airsense/history", isAuthenticated, (req, res) => {
  deviceCtrl.getMeasurementHistoryFromAirSENSE(req, res);
});

// Lấy danh sách devices có dữ liệu trong collection 'sensor'
router.get("/airsense/devices", isAuthenticated, (req, res) => {
  deviceCtrl.getDeviceListFromAirSENSE(req, res);
});

// Download file từ ESP32 file server (proxy)
router.get("/files/download", isAuthenticated, (req, res) => {
  deviceCtrl.downloadFileFromESP32(req, res);
});

module.exports = router;

