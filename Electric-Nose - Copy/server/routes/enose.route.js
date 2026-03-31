const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate.js');
const enoseDeviceCtrl = require('../controllers/enose-device.controller.js');
const enoseControlCtrl = require('../controllers/enose-control.controller.js');

// All endpoints require auth token of WebManage (authenticate middleware)
router.use(authenticate);

router.get('/devices', enoseDeviceCtrl.listDevices);
router.get('/devices/:id/latest', enoseDeviceCtrl.getLatestSensor);
router.get('/devices/:id/history', enoseDeviceCtrl.getHistory);
router.get('/devices/:id/status', enoseDeviceCtrl.getStatus);
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

// Control routes (không cần device_id)
router.get('/control/status', enoseControlCtrl.getSystemStatus);
router.post('/control/measurement/start', enoseControlCtrl.startMeasurementGlobal);
router.get('/control/measurement/last', enoseControlCtrl.getLastMeasurement);

module.exports = router;

