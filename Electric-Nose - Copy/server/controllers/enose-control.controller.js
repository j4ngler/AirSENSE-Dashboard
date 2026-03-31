const mqtt = require('mqtt');
const knex = require('../config/knex.js');
const { returnOK, returnFalse, returnNotFound } = require('../utils/returnResponse.js');
const EnoseDeviceStatus = require('../models/schemaMongo/enoseDeviceStatus');
const EnoseMeasurementData = require('../models/schemaMongo/enoseMeasurementData');
const DataSensor = require('../models/schemaMongo/dataSensor');

const safeMongo = async (fn, fallback = null) => {
  try {
    return await fn();
  } catch (err) {
    console.warn('Mongo warning:', err.message);
    return fallback;
  }
};

// MQTT client (dùng chung cấu hình môi trường của WebManage hoặc biến MQTT_* nếu đã có)
let mqttBrokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://127.0.0.1:1883';

// Fix: Nếu URL có format "MQTT_BROKER_URL=mqtt://..." thì strip phần key
if (mqttBrokerUrl && typeof mqttBrokerUrl === 'string') {
  if (mqttBrokerUrl.includes('MQTT_BROKER_URL=')) {
    const parts = mqttBrokerUrl.split('=');
    mqttBrokerUrl = parts[parts.length - 1] || 'mqtt://127.0.0.1:1883';
  }
  mqttBrokerUrl = mqttBrokerUrl.trim();
  
  // Đảm bảo có protocol
  if (!mqttBrokerUrl.startsWith('mqtt://') && !mqttBrokerUrl.startsWith('mqtts://') && !mqttBrokerUrl.startsWith('ws://')) {
    mqttBrokerUrl = `mqtt://${mqttBrokerUrl}`;
  }
}

const mqttPort = parseInt(process.env.MQTT_PORT || '1883', 10);

const mqttClient = mqtt.connect(mqttBrokerUrl, {
  port: mqttPort,
  username: process.env.MQTT_USERNAME || undefined,
  password: process.env.MQTT_PASSWORD || undefined,
  clientId: process.env.MQTT_CLIENT_ID || 'enose_' + Math.random().toString(16).slice(2),
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
});

mqttClient.on('connect', () => {
  console.log('[E-Nose] MQTT connected to', mqttBrokerUrl);
});

mqttClient.on('error', (err) => {
  console.error('[E-Nose] MQTT error:', err.message);
});

// helper publish
const publishCommand = (deviceCode, payload) =>
  mqttClient.publish(`electric-nose/device/${deviceCode}/control`, JSON.stringify(payload));

// GET /api/enose/control/status
exports.getSystemStatus = async (req, res) => {
  try {
    const totalDevices = await knex('enose_devices')
      .where({ delete_flag: 0 })
      .count('device_id as count')
      .first();

    const onlineDevices = await knex('enose_devices')
      .where({ delete_flag: 0, status: 'online' })
      .count('device_id as count')
      .first();

    const recentControls = await knex('enose_control_history')
      .where('created_at', '>', knex.raw('DATE_SUB(NOW(), INTERVAL 1 HOUR)'))
      .count('id as count')
      .first();

    // Lấy WiFi status và storage từ MongoDB device status (device mới nhất)
    let wifiStatus = 'disconnected';
    let wifiSSID = '--';
    let wifiSignal = 0;
    let wifiIP = null;
    let storage = {
      total: 0,
      used: 0,
      free: 0
    };

    try {
      const latestDeviceStatus = await safeMongo(() =>
        EnoseDeviceStatus.findOne().sort({ last_seen: -1 }).limit(1).lean()
      );

      if (latestDeviceStatus) {
        wifiStatus = latestDeviceStatus.wifi_status || (latestDeviceStatus.wifi_ssid ? 'connected' : 'disconnected');
        wifiSSID = latestDeviceStatus.wifi_ssid || '--';
        wifiSignal = latestDeviceStatus.wifi_signal || 0;
        wifiIP = latestDeviceStatus.wifi_ip || null;
        
        if (latestDeviceStatus.storage) {
          storage = {
            total: latestDeviceStatus.storage.total || 0,
            used: latestDeviceStatus.storage.used || 0,
            free: latestDeviceStatus.storage.free || 0
          };
        } else if (latestDeviceStatus.storage_total || latestDeviceStatus.storage_used) {
          // Backward compatibility: nếu có storage_total/storage_used cũ
          storage = {
            total: latestDeviceStatus.storage_total || 0,
            used: latestDeviceStatus.storage_used || 0,
            free: (latestDeviceStatus.storage_total || 0) - (latestDeviceStatus.storage_used || 0)
          };
        }
      }
    } catch (mongoError) {
      console.warn('⚠️ MongoDB not available for device status, using defaults');
    }

    return returnOK(res, {
      total_devices: totalDevices.count || 0,
      online_devices: onlineDevices.count || 0,
      offline_devices: (totalDevices.count || 0) - (onlineDevices.count || 0),
      recent_controls: recentControls.count || 0,
      wifi_status: wifiStatus,
      wifi_ssid: wifiSSID,
      wifi_signal: wifiSignal,
      wifi_ip: wifiIP,
      storage: storage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get system status error:', error);
    return returnFalse(res, { success: false, message: 'Lỗi khi lấy trạng thái hệ thống' });
  }
};

// POST /api/enose/control/measurement/start (không cần device_id, tự lấy device đầu tiên)
exports.startMeasurementGlobal = async (req, res) => {
  try {
    const userId = req.currentUser?.user_id || null;
    
    // Get default device or first device
    const device = await knex('enose_devices')
      .where({ delete_flag: 0 })
      .first();

    if (!device) {
      return returnNotFound(res, { success: false, message: 'Không tìm thấy thiết bị' });
    }

    const deviceIdForMongo = device.device_code || device.device_id.toString();
    
    // Kiểm tra xem có measurement đang chạy không
    try {
      const activeMeasurement = await safeMongo(() =>
        EnoseMeasurementData.findOne({
          device_id: deviceIdForMongo,
          status: { $in: ['started', 'in_progress'] }
        }).lean()
      );
      
      if (activeMeasurement) {
        const now = new Date();
        const startedAt = new Date(activeMeasurement.started_at);
        const elapsed = now - startedAt;
        const maxDuration = 40 * 60 * 1000; // 40 phút
        
        if (elapsed > maxDuration) {
          // Đánh dấu failed
          await safeMongo(() =>
            EnoseMeasurementData.updateOne(
              { _id: activeMeasurement._id },
              {
                $set: {
                  status: 'failed',
                  completed_at: new Date(),
                  failure_reason: 'Measurement timeout - replaced by new measurement'
                }
              }
            )
          );
        } else {
          // Measurement đang chạy và chưa quá thời gian
          return returnFalse(res, {
            success: false,
            message: `Đang có measurement đang chạy: ${activeMeasurement.file_name}. Vui lòng đợi measurement hoàn thành.`,
            active_measurement: {
              file_name: activeMeasurement.file_name,
              started_at: activeMeasurement.started_at,
              elapsed_minutes: Math.round(elapsed / 60000)
            }
          });
        }
      }
    } catch (activeCheckError) {
      console.warn('⚠️ Error checking active measurement:', activeCheckError.message);
    }

    // QUAN TRỌNG: Kiểm tra xem ESP32 có online không trước khi cho phép start measurement
    // Chỉ cho phép start khi ESP32 đang bật và có dữ liệu sensor gửi lên trong 2 phút gần đây
    try {
      const currentTime = Math.floor(Date.now() / 1000);
      const offlineThresholdSeconds = 2 * 60; // 2 phút
      
      // QUAN TRỌNG: Không dùng .lean() để có thể dùng _id.getTimestamp()
      const recentSensorData = await safeMongo(() =>
        DataSensor.findOne({
          topic: { $regex: new RegExp(`electric-nose/device/${deviceIdForMongo}/sensor`) }
        })
        .sort({ _id: -1 }) // Sort theo _id để lấy record mới nhất (không phụ thuộc timestamp)
      );
      
      if (recentSensorData) {
        // QUAN TRỌNG: Luôn dùng _id timestamp để check age (không dùng time field vì ESP32 có thể gửi timestamp sai)
        let recordAge = offlineThresholdSeconds + 1; // Default: offline
        
        if (recentSensorData._id) {
          // Dùng _id timestamp (thời gian insert vào DB) - đáng tin cậy nhất
          try {
            const idTimestamp = Math.floor(recentSensorData._id.getTimestamp().getTime() / 1000);
            recordAge = currentTime - idTimestamp;
            console.log(`[Start Measurement] Device check: _id timestamp=${idTimestamp}, currentTime=${currentTime}, age=${recordAge}s`);
          } catch (idError) {
            console.warn('⚠️ Could not get _id timestamp:', idError.message);
            // Nếu không lấy được _id timestamp, thử dùng time field nhưng validate
            const timeValue = recentSensorData.time;
            // Nếu timestamp là tương lai hoặc quá cũ, coi như không hợp lệ
            if (Math.abs(currentTime - timeValue) <= 3600) {
              recordAge = currentTime - timeValue;
            }
            // Nếu không hợp lệ, recordAge vẫn là offlineThresholdSeconds + 1
          }
        } else {
          // Không có _id → không thể xác định age chính xác → coi như offline
          console.warn('⚠️ Sensor data không có _id, không thể xác định age chính xác');
        }
        
        if (recordAge > offlineThresholdSeconds) {
          // ESP32 không có sensor data mới trong 2 phút → có thể đã tắt
          return returnFalse(res, {
            success: false,
            message: `ESP32 chưa được khởi động hoặc đã tắt. Không có dữ liệu sensor trong ${Math.round(recordAge/60)} phút gần đây. Vui lòng kiểm tra và khởi động thiết bị trước khi bắt đầu đo.`,
            device_offline: true,
            last_sensor_data_age_seconds: recordAge
          });
        }
      } else {
        // Không có sensor data nào → ESP32 chưa từng gửi data hoặc chưa được khởi động
        return returnFalse(res, {
          success: false,
          message: `ESP32 chưa được khởi động. Thiết bị chưa gửi dữ liệu sensor. Vui lòng kiểm tra thiết bị có đang hoạt động và kết nối MQTT không.`,
          device_offline: true,
          no_sensor_data: true
        });
      }
    } catch (deviceCheckError) {
      console.warn('⚠️ Could not check device online status:', deviceCheckError.message);
      // Nếu không kiểm tra được, vẫn cho phép start (fallback)
    }

    const startedAt = new Date();
    // Convert sang timezone Việt Nam (UTC+7)
    // getTimezoneOffset() trả về offset tính bằng phút, dấu ngược lại (UTC+7 = -420)
    // Để convert sang UTC+7: thêm 7 giờ vào UTC time
    const utcTime = startedAt.getTime() + (startedAt.getTimezoneOffset() * 60000);
    const vietnamTime = new Date(utcTime + (7 * 60 * 60000)); // UTC+7 = +420 phút
    
    const fileName = `ENose_${vietnamTime.getFullYear()}${String(vietnamTime.getMonth()+1).padStart(2,'0')}${String(vietnamTime.getDate()).padStart(2,'0')}_${String(vietnamTime.getHours()).padStart(2,'0')}${String(vietnamTime.getMinutes()).padStart(2,'0')}${String(vietnamTime.getSeconds()).padStart(2,'0')}.csv`;

    const measurementPayload = {
      command: 'start_measurement',
      file_name: fileName,
      timestamp: startedAt.toISOString(),
    };

    // Send MQTT command
    const topic = `electric-nose/device/${device.device_code || device.device_id}/measurement/start`;
    const message = JSON.stringify(measurementPayload);
    mqttClient.publish(topic, message, (err) => {
      if (err) {
        console.error('MQTT publish error:', err);
      }
    });

    // Log control action
    await knex('enose_control_history').insert({
      device_id: device.device_id,
      user_id: userId,
      command: 'start_measurement',
      value: JSON.stringify(measurementPayload),
      status: 'sent',
      created_at: startedAt,
    });

    // Lưu measurement vào MongoDB
    try {
      let measurement = await safeMongo(() =>
        EnoseMeasurementData.findOne({
          device_id: deviceIdForMongo,
          file_name: fileName
        })
      );
      
      if (!measurement) {
        measurement = new EnoseMeasurementData({
          device_id: deviceIdForMongo,
          file_name: fileName,
          status: 'started',
          progress: 0,
          samples_count: 0,
          started_at: startedAt,
          completed_at: null,
          measurement_data: null
        });
        await measurement.save();
      } else {
        measurement.status = 'started';
        measurement.started_at = startedAt;
        measurement.progress = 0;
        measurement.samples_count = 0;
        await measurement.save();
      }
    } catch (mongoError) {
      console.warn('⚠️ Could not save measurement to MongoDB (non-critical):', mongoError.message);
    }

    return returnOK(res, {
      success: true,
      message: 'Đã bắt đầu đo',
      device_id: device.device_code || device.device_id,
      file_name: fileName,
      started_at: startedAt,
    });
  } catch (error) {
    console.error('Start measurement error:', error);
    return returnFalse(res, { success: false, message: 'Lỗi khi bắt đầu đo' });
  }
};

// POST /api/enose/devices/:id/start
exports.startMeasurement = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await knex('enose_devices')
      .where(function () {
        this.where({ device_id: id }).orWhere({ device_code: id }).orWhere({ name: id });
      })
      .first();
    if (!device) return returnNotFound(res, { message: 'device not found' });

    const payload = { command: 'start_measurement', ts: Date.now() };
    publishCommand(device.device_code, payload);

    const userId = req.currentUser?.user_id || null;
    await knex('enose_control_history').insert({
      device_id: device.device_id,
      user_id: userId,
      command: 'start_measurement',
      value: JSON.stringify(payload),
      status: 'sent',
      created_at: new Date(),
    });

    return returnOK(res, { success: true, message: 'command sent' });
  } catch (err) {
    console.error('startMeasurement error:', err);
    return returnFalse(res, 'error');
  }
};

// GET /api/enose/control/measurement/last
exports.getLastMeasurement = async (req, res) => {
  try {
    const lastCompleted = await safeMongo(() =>
      EnoseMeasurementData.findOne({
        status: 'completed'
      })
        .sort({ completed_at: -1 })
        .select('device_id file_name status progress samples_count started_at completed_at duration_ms')
        .lean()
    );

    return returnOK(res, { success: true, data: lastCompleted || null });
  } catch (err) {
    console.error('getLastMeasurement error:', err);
    return returnFalse(res, { success: false, message: 'Lỗi khi lấy measurement gần nhất' });
  }
};

// POST /api/enose/devices/:id/heating  { on: true/false }
exports.setHeating = async (req, res) => {
  const { id } = req.params;
  const { on } = req.body;
  try {
    const device = await knex('enose_devices')
      .where(function () {
        this.where({ device_id: id }).orWhere({ device_code: id }).orWhere({ name: id });
      })
      .first();
    if (!device) return returnNotFound(res, { message: 'device not found' });

    const payload = { command: 'heating', value: !!on, ts: Date.now() };
    publishCommand(device.device_code, payload);

    const userId = req.currentUser?.user_id || null;
    await knex('enose_control_history').insert({
      device_id: device.device_id,
      user_id: userId,
      command: 'heating',
      value: JSON.stringify(payload),
      status: 'sent',
      created_at: new Date(),
    });

    return returnOK(res, { success: true });
  } catch (err) {
    console.error('setHeating error:', err);
    return returnFalse(res, 'error');
  }
};

// POST /api/enose/devices/:id/air-pump  { on: true/false }
exports.setAirPump = async (req, res) => {
  const { id } = req.params;
  const { on } = req.body;
  try {
    const device = await knex('enose_devices')
      .where(function () {
        this.where({ device_id: id }).orWhere({ device_code: id }).orWhere({ name: id });
      })
      .first();
    if (!device) return returnNotFound(res, { message: 'device not found' });

    const payload = { command: 'air_pump', value: !!on, ts: Date.now() };
    publishCommand(device.device_code, payload);

    const userId = req.currentUser?.user_id || null;
    await knex('enose_control_history').insert({
      device_id: device.device_id,
      user_id: userId,
      command: 'air_pump',
      value: JSON.stringify(payload),
      status: 'sent',
      created_at: new Date(),
    });

    return returnOK(res, { success: true });
  } catch (err) {
    console.error('setAirPump error:', err);
    return returnFalse(res, 'error');
  }
};

