const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate.js');
const enoseDeviceCtrl = require('../controllers/enose-device.controller.js');
const enoseControlCtrl = require('../controllers/enose-control.controller.js');
const retention = require('../enose-retention.js');
const peltierLimits = require('../controllers/enose-peltier-limits.controller.js');

// All endpoints require auth token of WebManage (authenticate middleware)
router.use(authenticate);

router.get('/devices', enoseDeviceCtrl.listDevices);
router.get('/devices/:id/latest', enoseDeviceCtrl.getLatestSensor);
router.get('/devices/:id/history', enoseDeviceCtrl.getHistory);
router.get('/devices/:id/summary', async (req, res) => {
  const { id } = req.params;
  const { from, to, metric = 'Temperature' } = req.query;
  const start = Date.parse(from) / 1000;
  const end = Date.parse(to) / 1000;
  if (!/^[^/]+$/.test(id) || !retention.metrics.includes(metric) || !Number.isFinite(start) ||
      !Number.isFinite(end) || start >= end || end - start > retention.summaryDays * 86400) {
    return res.status(400).json({ message: 'Chọn chỉ số và khoảng thời gian hợp lệ, tối đa 365 ngày.' });
  }
  try {
    return res.json({ result: await retention.history(id, metric, start, end) });
  } catch (error) {
    console.error('[E-Nose summary]', error.message);
    return res.status(503).json({ message: 'Chưa lấy được dữ liệu tổng hợp.' });
  }
});
router.get('/devices/:id/status', enoseDeviceCtrl.getStatus);
router.route('/devices/:id/peltier-limits').get(peltierLimits).post(peltierLimits);
router.get('/devices/:id/measurements', enoseDeviceCtrl.getMeasurementFiles);
router.get('/devices/measurements/active', enoseDeviceCtrl.getActiveMeasurement);
router.get('/devices/measurements/files', enoseDeviceCtrl.getAllMeasurementFiles);

// AirSENSE integration routes
router.get('/devices/airsense/latest', enoseDeviceCtrl.getLatestSensorDataFromAirSENSE);
router.get('/devices/:id/airsense/latest', enoseDeviceCtrl.getLatestSensorDataFromAirSENSE);
router.get('/devices/airsense/devices', enoseDeviceCtrl.getDeviceListFromAirSENSE);

// File download
router.get('/devices/files/download', enoseDeviceCtrl.downloadFileFromESP32);

router.post('/devices/:id/start', enoseControlCtrl.startMeasurement);
router.post('/devices/:id/heating', enoseControlCtrl.setHeating);
router.post('/devices/:id/air-pump', enoseControlCtrl.setAirPump);
router.post('/devices/:id/environment-control', enoseControlCtrl.controlEnvironment);

// Control routes (không cần device_id)
router.get('/control/status', enoseControlCtrl.getSystemStatus);
router.post('/control/measurement/start', enoseControlCtrl.startMeasurementGlobal);
router.get('/control/measurement/last', enoseControlCtrl.getLastMeasurement);

module.exports = router;
