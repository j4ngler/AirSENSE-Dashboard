require('dotenv').config();
const knex = require("../config/knex.js");
const mqtt = require("mqtt");
const {
  returnOK,
  returnFalse,
  returnNotFound,
} = require("../utils/returnResponse.js");
const SensorData = require("../models/mongoDB/sensorData.model.js");
const DeviceStatus = require("../models/mongoDB/deviceStatus.model.js");
const MeasurementData = require("../models/mongoDB/measurementData.model.js");
const Sensor = require("../models/mongoDB/sensor.model.js"); // Collection chung của AirSENSE
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

// Helper function để throttle log (chỉ log mỗi interval giây)
const logThrottle = (() => {
  const lastLogTimes = new Map();
  const LOG_INTERVAL_MS = 10000; // 10 giây
  
  return (key, message, force = false) => {
    const now = Date.now();
    const lastTime = lastLogTimes.get(key) || 0;
    
    if (force || (now - lastTime) >= LOG_INTERVAL_MS) {
      lastLogTimes.set(key, now);
      if (typeof message === 'function') {
        console.log(message());
      } else {
        console.log(message);
      }
      return true;
    }
    return false;
  };
})();

// MQTT Client configuration với username/password từ .env
// Parse MQTT URL và port
let mqttBrokerUrl = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
let mqttPort = parseInt(process.env.MQTT_PORT) || 1883;

// Fix: Nếu URL có chứa "MQTT_BROKER_URL=" thì loại bỏ (do .env parse sai hoặc format sai)
if (mqttBrokerUrl && typeof mqttBrokerUrl === 'string') {
  if (mqttBrokerUrl.includes('MQTT_BROKER_URL=')) {
    // Lấy phần sau dấu = cuối cùng
    const parts = mqttBrokerUrl.split('=');
    mqttBrokerUrl = parts[parts.length - 1] || "mqtt://localhost:1883";
  }
  mqttBrokerUrl = mqttBrokerUrl.trim();
}

// Đảm bảo URL có protocol
if (!mqttBrokerUrl.startsWith('mqtt://') && !mqttBrokerUrl.startsWith('mqtts://') && !mqttBrokerUrl.startsWith('ws://')) {
  mqttBrokerUrl = `mqtt://${mqttBrokerUrl}`;
}

// Nếu URL không có port, thêm port từ env
if (!mqttBrokerUrl.match(/:\d+$/)) {
  // Extract host từ URL
  const host = mqttBrokerUrl.replace(/^mqtt:\/\//, '').replace(/:\d+$/, '');
  mqttBrokerUrl = `mqtt://${host}:${mqttPort}`;
} else {
  // Extract port từ URL nếu có
  const urlMatch = mqttBrokerUrl.match(/:(\d+)$/);
  if (urlMatch) {
    mqttPort = parseInt(urlMatch[1]);
  }
}

console.log('🔧 MQTT Config:', {
  brokerUrl: mqttBrokerUrl,
  port: mqttPort,
  username: process.env.MQTT_USERNAME || "test"
});

const mqttClient = mqtt.connect(mqttBrokerUrl, {
  port: mqttPort,
  username: process.env.MQTT_USERNAME || "test",
  password: process.env.MQTT_PASSWORD || "testadmin",
  clientId: process.env.MQTT_CLIENT_ID || 'enose_' + Math.random().toString(16).substr(2, 8),
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
});

// MQTT Connection handlers
mqttClient.on('connect', () => {
  console.log('✅ MQTT Client connected to broker:', mqttBrokerUrl);
  
  // Subscribe để nhận sensor data từ ESP32
  mqttClient.subscribe('electric-nose/device/+/sensor', (err) => {
    if (err) {
      console.error('❌ MQTT subscribe error (sensor):', err);
    } else {
      console.log('✅ Subscribed to: electric-nose/device/+/sensor');
    }
  });
  
  // Subscribe để nhận status từ ESP32
  mqttClient.subscribe('electric-nose/device/+/status', (err) => {
    if (err) {
      console.error('❌ MQTT subscribe error (status):', err);
    } else {
      console.log('✅ Subscribed to: electric-nose/device/+/status');
    }
  });
  
  // Subscribe để nhận measurement data từ ESP32
  mqttClient.subscribe('electric-nose/device/+/measurement/data', (err) => {
    if (err) {
      console.error('❌ MQTT subscribe error (measurement):', err);
    } else {
      console.log('✅ Subscribed to: electric-nose/device/+/measurement/data');
    }
  });
});

mqttClient.on('error', (error) => {
  console.error('❌ MQTT Client error:', error);
});

mqttClient.on('close', () => {
  console.log('⚠️ MQTT Client disconnected');
});

mqttClient.on('reconnect', () => {
  console.log('🔄 MQTT Client reconnecting...');
});

// Nhận messages từ ESP32
mqttClient.on('message', (topic, message) => {
  try {
    // Chỉ log raw message mỗi 10 giây để tránh spam
    logThrottle(`mqtt_raw_${topic}`, () => `📨 Raw MQTT message received - Topic: ${topic}, Length: ${message.length} bytes`);
    
    const data = JSON.parse(message.toString());
    
    // Chỉ log parsed message mỗi 10 giây
    logThrottle(`mqtt_parsed_${topic}`, () => `📨 Received from ${topic}: ${JSON.stringify(data, null, 2)}`);
    
    // Xử lý sensor data từ ESP32
    if (topic.includes('/sensor')) {
      handleSensorData(topic, data);
    }
    
    // Xử lý status từ ESP32
    if (topic.includes('/status')) {
      console.log(`✅ Processing status message from ${topic}`);
      console.log(`   - wifi_ssid: ${data.wifi_ssid}`);
      console.log(`   - wifi_signal: ${data.wifi_signal}`);
      console.log(`   - wifi_ip: ${data.wifi_ip}`);
      console.log(`   - wifi_status: ${data.wifi_status}`);
      handleDeviceStatus(topic, data);
    }
    
    // Xử lý measurement data từ ESP32
    if (topic.includes('/measurement/data')) {
      handleMeasurementData(topic, data);
    }
  } catch (error) {
    console.error('❌ Error parsing MQTT message:', error);
    console.error('Raw message:', message.toString());
  }
});

// Helper function để extract device_id từ MQTT topic
// Hỗ trợ cả format cũ và mới:
// Format mới: electric-nose/device/{device_id}/sensor
// Format cũ: electric-nose/{device_id}/sensor-data
function extractDeviceIdFromTopic(topic) {
  const parts = topic.split('/');
  if (parts.length >= 3 && parts[1] === 'device') {
    // Format mới: electric-nose/device/{device_id}/sensor
    return parts[2];
  } else if (parts.length >= 2) {
    // Format cũ: electric-nose/{device_id}/sensor-data
    return parts[1];
  } else {
    console.warn(`⚠️ Unknown topic format: ${topic}`);
    return 'unknown';
  }
}

// Helper function để xử lý sensor data
async function handleSensorData(topic, data) {
  try {
    // Extract device_id from topic
    const deviceId = extractDeviceIdFromTopic(topic);
    
    // Lưu vào MongoDB collection 'sensor' chung của AirSENSE (format: topic, time, content)
    try {
      // Convert timestamp: nếu là Date object hoặc ISO string, convert sang epoch seconds
      let timeValue;
      if (data.timestamp) {
        if (typeof data.timestamp === 'number') {
          timeValue = Math.floor(data.timestamp / 1000); // Nếu là milliseconds
        } else if (data.timestamp instanceof Date) {
          timeValue = Math.floor(data.timestamp.getTime() / 1000);
        } else {
          timeValue = Math.floor(new Date(data.timestamp).getTime() / 1000);
        }
      } else {
        timeValue = Math.floor(Date.now() / 1000); // Current epoch seconds
      }
      
      // Build content object theo format AirSENSE
      const content = {
        Temperature: data.temperature || data.sht85_temperature || null,
        Humidity: data.humidity || data.sht85_humidity || null,
      };
      
      // Map ADC values (nếu có)
      if (data.adc && Array.isArray(data.adc)) {
        data.adc.forEach((value, index) => {
          content[`ADC${index}`] = value;
        });
      } else {
        // Fallback: nếu có mems1-8
        if (data.mems1 !== undefined) content.ADC0 = data.mems1;
        if (data.mems2 !== undefined) content.ADC1 = data.mems2;
        if (data.mems3 !== undefined) content.ADC2 = data.mems3;
        if (data.mems4 !== undefined) content.ADC3 = data.mems4;
        if (data.mems5 !== undefined) content.ADC4 = data.mems5;
        if (data.mems6 !== undefined) content.ADC5 = data.mems6;
        if (data.mems7 !== undefined) content.ADC6 = data.mems7;
        if (data.mems8 !== undefined) content.ADC7 = data.mems8;
      }
      
      // Lưu vào collection 'sensor' chung của AirSENSE
      const sensorRecord = new Sensor({
        topic: topic, // electric-nose/device/{device_id}/sensor
        time: timeValue,
        content: content
      });
      
      await sensorRecord.save();
      // Chỉ log mỗi 10 giây để tránh spam
      logThrottle(`saved_sensor_${deviceId}`, () => `✅ Saved sensor data to AirSENSE collection: ${topic}, time: ${timeValue}`);
      
      // Cũng lưu vào collection riêng sensor_data (nếu cần)
      try {
        const sensorData = new SensorData({
          device_id: deviceId,
          temperature: content.Temperature,
          humidity: content.Humidity,
          mems1: content.ADC0,
          mems2: content.ADC1,
          mems3: content.ADC2,
          mems4: content.ADC3,
          mems5: content.ADC4,
          mems6: content.ADC5,
          mems7: content.ADC6,
          mems8: content.ADC7,
          timestamp: new Date(timeValue * 1000)
      });
      await sensorData.save();
      } catch (sensorDataError) {
        // Không critical, chỉ log
        console.warn('⚠️ Could not save to sensor_data collection:', sensorDataError.message);
      }
      
    } catch (mongoError) {
      // MongoDB chưa kết nối, chỉ log warning
      console.warn('⚠️ MongoDB not available, skipping save to MongoDB:', mongoError.message);
    }
    
    // Cập nhật last sensor data trong MySQL (nếu cần)
    try {
      // Kiểm tra và tạo device nếu chưa tồn tại (để tránh foreign key constraint error)
      // Query theo name (lưu deviceId string) hoặc mqtt_topic
      const existingDevice = await knex("devices")
        .where(function() {
          this.where({ name: deviceId })
            .orWhere({ mqtt_topic: `electric-nose/device/${deviceId}` });
        })
        .first();
      
      if (!existingDevice) {
        // Tự động tạo device mới
        // Lưu deviceId string vào field 'name', và device_id sẽ tự động tăng
        await knex("devices").insert({
          name: deviceId, // Lưu deviceId string vào name
          type: "electric_nose",
          status: "online",
          mqtt_topic: `electric-nose/device/${deviceId}`,
          created_at: new Date(),
          updated_at: new Date(),
          delete_flag: 0
        });
        console.log(`✅ Auto-created device ${deviceId} in MySQL`);
      }
      
      // Lấy lại device để có device_id INT (cho foreign key)
      const deviceForData = await knex("devices")
        .where(function() {
          this.where({ name: deviceId })
            .orWhere({ mqtt_topic: `electric-nose/device/${deviceId}` });
        })
        .first();
      
      if (deviceForData) {
        // Insert sensor data - dùng device_id INT cho foreign key
      await knex("device_data").insert({
          device_id: deviceForData.device_id, // INT primary key
        data_type: "temperature",
        value: data.temperature?.toString() || "0",
        unit: "°C",
        created_at: new Date(),
      });
      
      await knex("device_data").insert({
          device_id: deviceForData.device_id, // INT primary key
        data_type: "humidity",
        value: data.humidity?.toString() || "0",
        unit: "%",
        created_at: new Date(),
      });
      }
    } catch (mysqlError) {
      // Ignore MySQL errors if table doesn't exist or other issues
      console.warn('⚠️ MySQL insert warning:', mysqlError.message);
    }
    
    // Log sensor data với format đúng (ESP32 gửi adc array, không phải mems1-8)
    const logData = {
      temperature: data.temperature,
      humidity: data.humidity,
      timestamp: data.timestamp || new Date().toISOString()
    };
    
    // Hiển thị adc array nếu có
    if (data.adc && Array.isArray(data.adc)) {
      logData.adc = data.adc;
      logData.adc_count = data.adc.length;
    } else {
      // Fallback: hiển thị mems1-8 nếu có (format cũ)
      if (data.mems1 !== undefined) logData.mems1 = data.mems1;
      if (data.mems2 !== undefined) logData.mems2 = data.mems2;
      if (data.mems3 !== undefined) logData.mems3 = data.mems3;
      if (data.mems4 !== undefined) logData.mems4 = data.mems4;
      if (data.mems5 !== undefined) logData.mems5 = data.mems5;
      if (data.mems6 !== undefined) logData.mems6 = data.mems6;
      if (data.mems7 !== undefined) logData.mems7 = data.mems7;
      if (data.mems8 !== undefined) logData.mems8 = data.mems8;
    }
    
    // Chỉ log mỗi 10 giây để tránh spam
    logThrottle(`sensor_data_${deviceId}`, () => `📊 Sensor data received from device ${deviceId}: ${JSON.stringify(logData)}`);
  } catch (error) {
    console.error('❌ Error handling sensor data:', error);
  }
}

// Helper function để xử lý device status
async function handleDeviceStatus(topic, data) {
  try {
    const deviceId = extractDeviceIdFromTopic(topic);
    
    // Lưu vào MongoDB (nếu đã kết nối)
    try {
      const deviceStatus = new DeviceStatus({
      device_id: deviceId,
      status: data.status || "online",
      wifi_ssid: data.wifi_ssid || null,
      wifi_signal: data.wifi_signal || null,
      wifi_status: data.wifi_status || (data.wifi_ssid ? "connected" : "disconnected"),
      wifi_ip: data.wifi_ip || null,
      storage: {
        total: data.storage?.total || 0,
        used: data.storage?.used || 0,
        free: data.storage?.free || 0
      },
      heating_enabled: data.heating_enabled || false,
      air_pump_enabled: data.air_pump_enabled || false,
      wifi_enabled: data.wifi_enabled !== undefined ? data.wifi_enabled : true,
      last_seen: new Date()
    });
    
      await deviceStatus.save();
    } catch (mongoError) {
      console.warn('⚠️ MongoDB not available, skipping save to MongoDB:', mongoError.message);
    }
    
    // Cập nhật status trong MySQL
    try {
      // Kiểm tra và tạo device nếu chưa tồn tại
      const existingDevice = await knex("devices")
        .where(function() {
          this.where({ name: deviceId })
            .orWhere({ mqtt_topic: `electric-nose/device/${deviceId}` });
        })
        .first();
      
      if (!existingDevice) {
        // Tự động tạo device mới
        await knex("devices").insert({
          name: deviceId, // Lưu deviceId string vào name
          type: "electric_nose",
          status: data.status || "online",
          mqtt_topic: `electric-nose/device/${deviceId}`,
          last_seen: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          delete_flag: 0
        });
        console.log(`✅ Auto-created device ${deviceId} in MySQL from status`);
      } else {
        // Cập nhật device hiện có
        await knex("devices")
          .where(function() {
            this.where({ name: deviceId })
              .orWhere({ mqtt_topic: `electric-nose/device/${deviceId}` });
          })
          .update({
            status: data.status || "online",
            last_seen: new Date(),
            updated_at: new Date()
          });
      }
    } catch (mysqlError) {
      console.warn('⚠️ MySQL update warning:', mysqlError.message);
    }
    
    // Khi thiết bị gửi status (thường là ngay sau khi khởi động lại),
    // nếu đang có measurement ở trạng thái 'started' hoặc 'in_progress'
    // thì coi như lần đo trước đó đã bị gián đoạn (mất điện / reset).
    // Đánh dấu tất cả measurement đang chạy là 'failed'.
    try {
      const interrupted = await MeasurementData.updateMany(
        {
          device_id: deviceId,
          status: { $in: ['started', 'in_progress'] }
        },
        {
          $set: {
            status: 'failed',
            completed_at: new Date()
          }
        }
      );

      const modified =
        typeof interrupted.modifiedCount === 'number'
          ? interrupted.modifiedCount
          : interrupted.nModified || 0;

      if (modified > 0) {
        console.warn(
          `⚠️ Marked ${modified} active measurement(s) as FAILED due to device restart (status from device ${deviceId})`
        );
      }
    } catch (measurementError) {
      console.error(
        `❌ Error marking interrupted measurements as failed when processing status from device ${deviceId}:`,
        measurementError
      );
    }

    // Chỉ log mỗi 10 giây để tránh spam
    logThrottle(`status_update_${deviceId}`, () => `📡 Status update saved from device ${deviceId}: ${JSON.stringify({
      status: data.status,
      wifi_ssid: data.wifi_ssid,
      wifi_signal: data.wifi_signal,
      wifi_ip: data.wifi_ip,
      wifi_status: data.wifi_status,
      storage: data.storage
    })}`);
  } catch (error) {
    console.error('❌ Error handling device status:', error);
  }
}

// Helper function để xử lý measurement data
async function handleMeasurementData(topic, data) {
  try {
    const deviceId = extractDeviceIdFromTopic(topic);
    
    // Log để debug
    logThrottle(`mqtt_measurement_${deviceId}`, () => `📊 Received measurement status from ${deviceId}: status=${data.status}, file_name=${data.file_name || 'N/A'}`);
    
    // Chỉ xử lý nếu có status và status hợp lệ
    if (!data.status) {
      console.warn(`⚠️ Measurement message from ${deviceId} has no status field, skipping`);
      return;
    }
    
    // Lưu vào MongoDB (nếu đã kết nối)
    try {
      // Nếu có file_name, tìm theo file_name
      // Nếu không có file_name nhưng status = 'started', tìm measurement đang chạy gần nhất
      let measurement = null;
      
      if (data.file_name) {
        // Tìm theo file_name
        measurement = await MeasurementData.findOne({
          device_id: deviceId,
          file_name: data.file_name,
          status: { $in: ['started', 'in_progress'] }
        }).sort({ started_at: -1 });
      } else if (data.status === 'started') {
        // Nếu không có file_name nhưng status = 'started', tìm measurement đang chạy gần nhất
        measurement = await MeasurementData.findOne({
          device_id: deviceId,
          status: { $in: ['started', 'in_progress'] }
        }).sort({ started_at: -1 });
      } else if (data.status === 'completed' || data.status === 'failed') {
        // Nếu status = 'completed' hoặc 'failed' mà không có file_name, tìm measurement đang chạy gần nhất
        measurement = await MeasurementData.findOne({
          device_id: deviceId,
          status: { $in: ['started', 'in_progress'] }
        }).sort({ started_at: -1 });
      }
      
      if (!measurement && data.status === 'started') {
        // Chỉ tạo mới khi status = 'started' và có file_name
        if (!data.file_name) {
          console.warn(`⚠️ Measurement 'started' from ${deviceId} has no file_name, skipping creation`);
          return;
        }
        
        // Tạo mới nếu chưa có
        measurement = new MeasurementData({
          device_id: deviceId,
          file_name: data.file_name,
          status: 'started',
          progress: data.progress || 0,
          measurement_data: data.measurement_data || null,
          samples_count: data.samples_count || 0,
          started_at: data.started_at ? new Date(data.started_at) : new Date()
        });
        
        logThrottle(`mqtt_measurement_new_${deviceId}`, () => `✅ Created new measurement: ${data.file_name}`);
      } else if (measurement) {
        // Cập nhật measurement hiện tại
        measurement.status = data.status || measurement.status;
        measurement.progress = data.progress !== undefined ? data.progress : measurement.progress;
        measurement.samples_count = data.samples_count !== undefined ? data.samples_count : measurement.samples_count;
        
        if (data.measurement_data) {
          measurement.measurement_data = data.measurement_data;
        }
        
        if (data.status === 'completed' || data.status === 'failed') {
          measurement.completed_at = new Date();
          
          // Lưu duration nếu có
          if (data.duration_ms !== undefined && data.duration_ms !== null) {
            measurement.duration_ms = data.duration_ms;
          }
          
          // Nếu measurement completed, chạy script Python xử lý dữ liệu
          if (data.status === 'completed') {
            processMeasurementData(deviceId, data.file_name, measurement.started_at).catch(err => {
              console.error('❌ Error in processMeasurementData:', err);
            });
          }
        }
      }
      
      await measurement.save();
      
      console.log(`📈 Measurement data saved from device ${deviceId}:`, {
        file_name: data.file_name,
        progress: measurement.progress,
        status: measurement.status,
        samples_count: measurement.samples_count
      });
    } catch (mongoError) {
      console.warn('⚠️ MongoDB not available, skipping save to MongoDB:', mongoError.message);
      console.log(`📈 Measurement data received from device ${deviceId}:`, {
        file_name: data.file_name,
        progress: data.progress,
        status: data.status
      });
    }
  } catch (error) {
    console.error('❌ Error handling measurement data:', error);
  }
}

var controlCtrl = {};

controlCtrl.controlDevice = async function (req, res) {
  try {
    const { id } = req.params;
    const { command, value } = req.body;
    const userId = req.currentUser.user_id;

    // Check device exists - query theo name (deviceId string) hoặc mqtt_topic
    const device = await knex("devices")
      .where(function() {
        this.where({ name: id, delete_flag: 0 })
          .orWhere({ mqtt_topic: `electric-nose/device/${id}`, delete_flag: 0 });
      })
      .first();

    if (!device) {
      return returnNotFound(res, {
        success: false,
        message: "Không tìm thấy thiết bị",
      });
    }

    // Send MQTT command - dùng device.name (string) cho MQTT topic
    const topic = `electric-nose/device/${device.name || id}/control`;
    const message = JSON.stringify({
      command,
      value,
      timestamp: new Date().toISOString(),
    });

    mqttClient.publish(topic, message, (err) => {
      if (err) {
        console.error("MQTT publish error:", err);
      }
    });

    // Log control action - dùng device.device_id (INT) cho foreign key
    await knex("control_history").insert({
      device_id: device.device_id, // INT primary key cho foreign key
      user_id: userId,
      command,
      value,
      status: "sent",
      created_at: new Date(),
    });

    return returnOK(res, {
      success: true,
      message: "Lệnh điều khiển đã được gửi",
      device_id: id,
      command,
      value,
    });
  } catch (error) {
    console.error("Control device error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi điều khiển thiết bị",
    });
  }
};

controlCtrl.getControlHistory = async function (req, res) {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const history = await knex("control_history")
      .join("devices", "control_history.device_id", "=", "devices.device_id")
      .join("users", "control_history.user_id", "=", "users.user_id")
      .select(
        "control_history.*",
        "devices.name as device_name",
        "users.fullname as user_name"
      )
      .orderBy("control_history.created_at", "desc")
      .limit(limit)
      .offset(offset);

    return returnOK(res, history);
  } catch (error) {
    console.error("Get control history error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy lịch sử điều khiển",
    });
  }
};

controlCtrl.getSystemStatus = async function (req, res) {
  try {
    const totalDevices = await knex("devices")
      .where({ delete_flag: 0 })
      .count("device_id as count")
      .first();

    const onlineDevices = await knex("devices")
      .where({ delete_flag: 0, status: "online" })
      .count("device_id as count")
      .first();

    const recentControls = await knex("control_history")
      .where("created_at", ">", knex.raw("DATE_SUB(NOW(), INTERVAL 1 HOUR)"))
      .count("id as count")
      .first();

    // Lấy WiFi status và storage từ MongoDB device status (device mới nhất)
    let wifiStatus = "disconnected";
    let wifiSSID = "--";
    let wifiSignal = 0;
    let wifiIP = null;
    let storage = {
      total: 0,
      used: 0,
      free: 0
    };

    try {
      const latestDeviceStatus = await DeviceStatus.findOne()
        .sort({ last_seen: -1 })
        .limit(1);
      
      if (latestDeviceStatus) {
        wifiStatus = latestDeviceStatus.wifi_status || "disconnected";
        wifiSSID = latestDeviceStatus.wifi_ssid || "--";
        wifiSignal = latestDeviceStatus.wifi_signal || 0;
        wifiIP = latestDeviceStatus.wifi_ip || null;
        
        if (latestDeviceStatus.storage) {
          storage = {
            total: latestDeviceStatus.storage.total || 0,
            used: latestDeviceStatus.storage.used || 0,
            free: latestDeviceStatus.storage.free || 0
          };
        }
      }
    } catch (mongoError) {
      console.warn('⚠️ MongoDB not available for device status, using defaults');
    }

    return returnOK(res, {
      total_devices: totalDevices.count,
      online_devices: onlineDevices.count,
      offline_devices: totalDevices.count - onlineDevices.count,
      recent_controls: recentControls.count,
      wifi_status: wifiStatus,
      wifi_ssid: wifiSSID,
      wifi_signal: wifiSignal,
      wifi_ip: wifiIP,
      storage: storage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get system status error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy trạng thái hệ thống",
    });
  }
};

controlCtrl.startMeasurement = async function (req, res) {
  try {
    const userId = req.currentUser.user_id;
    
    // Get default device or first device
    const device = await knex("devices")
      .where({ delete_flag: 0 })
      .first();

    if (!device) {
      return returnNotFound(res, {
        success: false,
        message: "Không tìm thấy thiết bị",
      });
    }

    const startedAt = new Date();
    const fileName = `ENose_${startedAt.getFullYear()}${String(startedAt.getMonth()+1).padStart(2,'0')}${String(startedAt.getDate()).padStart(2,'0')}_${String(startedAt.getHours()).padStart(2,'0')}${String(startedAt.getMinutes()).padStart(2,'0')}${String(startedAt.getSeconds()).padStart(2,'0')}.csv`;

    const measurementPayload = {
      command: "start_measurement",
      file_name: fileName,
      timestamp: startedAt.toISOString(),
    };

    // Send MQTT command to start measurement - dùng device.name (string) cho MQTT topic
    const topic = `electric-nose/device/${device.name || device.device_id}/measurement/start`;
    const message = JSON.stringify(measurementPayload);

    mqttClient.publish(topic, message, (err) => {
      if (err) {
        console.error("MQTT publish error:", err);
      }
    });

    // Log control action - dùng device.device_id (INT) cho foreign key
    await knex("control_history").insert({
      device_id: device.device_id, // INT primary key cho foreign key
      user_id: userId,
      command: "start_measurement",
      value: JSON.stringify(measurementPayload),
      status: "sent",
      created_at: startedAt,
    });

    // Lưu measurement vào MongoDB ngay khi start (để có thể download file đang đo)
    try {
      const deviceIdForMongo = device.name || device.device_id.toString();
      
      // Kiểm tra xem đã có measurement với file_name này chưa
      let measurement = await MeasurementData.findOne({
        device_id: deviceIdForMongo,
        file_name: fileName
      });
      
      if (!measurement) {
        // Tạo mới measurement record
        measurement = new MeasurementData({
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
        console.log(`✅ Created measurement record in MongoDB: ${fileName}`);
      } else {
        // Update nếu đã tồn tại
        measurement.status = 'started';
        measurement.started_at = startedAt;
        measurement.progress = 0;
        measurement.samples_count = 0;
        await measurement.save();
        console.log(`✅ Updated measurement record in MongoDB: ${fileName}`);
      }
    } catch (mongoError) {
      // Không critical, chỉ log warning (MongoDB có thể chưa kết nối)
      console.warn('⚠️ Could not save measurement to MongoDB (non-critical):', mongoError.message);
    }

    return returnOK(res, {
      success: true,
      message: "Đã bắt đầu đo",
      device_id: device.name || device.device_id, // Trả về name (string) cho frontend
      file_name: fileName,
      started_at: startedAt,
    });
  } catch (error) {
    console.error("Start measurement error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi bắt đầu đo",
    });
  }
};

controlCtrl.getSettings = async function (req, res) {
  try {
    // Lấy settings từ MongoDB device status (device mới nhất)
    let settings = {
      wifi_enabled: true,
      heating_enabled: true,
      air_pump_enabled: true,
    };

    try {
      const latestDeviceStatus = await DeviceStatus.findOne()
        .sort({ last_seen: -1 })
        .limit(1);
      
      if (latestDeviceStatus) {
        settings = {
          wifi_enabled: latestDeviceStatus.wifi_enabled !== undefined ? latestDeviceStatus.wifi_enabled : true,
          heating_enabled: latestDeviceStatus.heating_enabled !== undefined ? latestDeviceStatus.heating_enabled : true,
          air_pump_enabled: latestDeviceStatus.air_pump_enabled !== undefined ? latestDeviceStatus.air_pump_enabled : true,
        };
      }
    } catch (mongoError) {
      console.warn('⚠️ MongoDB not available for settings, using defaults');
    }

    return returnOK(res, settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy cài đặt",
    });
  }
};

controlCtrl.updateSettings = async function (req, res) {
  try {
    const { wifi, heating, air_pump } = req.body;
    const userId = req.currentUser.user_id;

    // Get default device
    const device = await knex("devices")
      .where({ delete_flag: 0 })
      .first();

    if (!device) {
      return returnNotFound(res, {
        success: false,
        message: "Không tìm thấy thiết bị",
      });
    }

    // Send MQTT commands for each setting - dùng device.name (string) cho MQTT topic
    const deviceName = device.name || device.device_id;
    
    // WiFi config đã được xóa - chỉ dùng AP mode web interface để cấu hình WiFi

    if (heating !== undefined) {
      const topic = `electric-nose/device/${deviceName}/settings/heating`;
      mqttClient.publish(topic, JSON.stringify({ enabled: heating }));
    }

    if (air_pump !== undefined) {
      const topic = `electric-nose/device/${deviceName}/settings/air_pump`;
      mqttClient.publish(topic, JSON.stringify({ enabled: air_pump }));
    }

    return returnOK(res, {
      success: true,
      message: "Cập nhật cài đặt thành công",
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi cập nhật cài đặt",
    });
  }
};

controlCtrl.getLastMeasurement = async function (req, res) {
  try {
    const record = await knex("control_history")
      .where({ command: "start_measurement" })
      .orderBy("created_at", "desc")
      .first();

    if (!record) {
      return returnNotFound(res, {
        success: false,
        message: "Chưa có lần đo nào",
      });
    }

    let payload = null;
    if (record.value) {
      try {
        payload = JSON.parse(record.value);
      } catch (err) {
        payload = null;
      }
    }

    return returnOK(res, {
      file_name: payload?.file_name || `Measurement_${record.created_at.getTime()}.csv`,
      started_at: record.created_at,
      status: record.status,
    });
  } catch (error) {
    console.error("Get last measurement error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy thông tin lần đo gần nhất",
    });
  }
};

// === Hàm xử lý dữ liệu đo bằng Python script ===
async function processMeasurementData(deviceId, fileName, startedAt) {
  try {
    console.log(`🔄 Bắt đầu xử lý dữ liệu cho file: ${fileName}`);
    
    // Đường dẫn đến script Python
    const pythonScript = path.join(__dirname, '../scripts/process_measurement.py');
    
    // Tìm Python executable: ưu tiên virtual environment, sau đó PYTHON_PATH, cuối cùng là 'python'
    let pythonExe = process.env.PYTHON_PATH || 'python';
    
    // Kiểm tra virtual environment trong thư mục scripts
    const venvPath = path.join(__dirname, '../scripts/venv');
    const venvPython = os.platform() === 'win32' 
      ? path.join(venvPath, 'Scripts', 'python.exe')
      : path.join(venvPath, 'bin', 'python');
    
    // Kiểm tra xem virtual environment có tồn tại không
    try {
      await fs.access(venvPython);
      pythonExe = venvPython;
      console.log(`✅ Sử dụng Python từ virtual environment: ${pythonExe}`);
    } catch {
      // Virtual environment không tồn tại, dùng Python system
      console.log(`⚠️ Virtual environment không tìm thấy, sử dụng Python system: ${pythonExe}`);
    }
    
    // Tạo thư mục output dựa trên file name
    const outputBaseDir = path.join(__dirname, '../../data_processing_output');
    const outputFolder = path.join(outputBaseDir, fileName.replace('.csv', ''));
    await fs.mkdir(outputFolder, { recursive: true });
    
    // Tạo file CSV từ MongoDB data
    const csvFilePath = path.join(outputFolder, fileName);
    
    // Lấy dữ liệu từ MongoDB và tạo file CSV
    const startDate = new Date(startedAt);
    const endDate = new Date(startDate.getTime() + 40 * 60 * 1000); // +40 phút
    
    try {
      // Query sensor data từ MongoDB
      const sensorData = await SensorData.find({
        device_id: deviceId,
        created_at: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ created_at: 1 }).lean();
      
      if (sensorData.length === 0) {
        console.log(`⚠️ Không có dữ liệu sensor trong MongoDB cho file ${fileName}`);
        return;
      }
      
      // Tạo CSV content
      let csvContent = 'TimeStamp,Temperature,Humidity,EtOH3,EtOH4,EtOH5,EtOH6,EtOH1,EtOH2,VOC1,VOC2\n';
      
      // Nhóm dữ liệu theo timestamp
      const dataByTimestamp = {};
      sensorData.forEach(item => {
        const timestamp = item.created_at || item.timestamp;
        if (!dataByTimestamp[timestamp]) {
          dataByTimestamp[timestamp] = {
            timestamp: timestamp,
            temperature: '',
            humidity: '',
            adc: ['', '', '', '', '', '', '', '']
          };
        }
        
        if (item.data_type === 'temperature') {
          dataByTimestamp[timestamp].temperature = item.value || '';
        } else if (item.data_type === 'humidity') {
          dataByTimestamp[timestamp].humidity = item.value || '';
        } else if (item.data_type && item.data_type.startsWith('mems')) {
          const memsIndex = parseInt(item.data_type.replace('mems', '')) - 1;
          if (memsIndex >= 0 && memsIndex < 8) {
            dataByTimestamp[timestamp].adc[memsIndex] = item.adc_value !== undefined ? item.adc_value : (item.value || '');
          }
        }
      });
      
      // Sort và ghi vào CSV
      const sortedTimestamps = Object.keys(dataByTimestamp).sort();
      sortedTimestamps.forEach(ts => {
        const row = dataByTimestamp[ts];
        csvContent += `${row.timestamp},${row.temperature},${row.humidity},${row.adc.join(',')}\n`;
      });
      
      // Ghi file CSV
      await fs.writeFile(csvFilePath, csvContent, 'utf8');
      console.log(`✅ Đã tạo file CSV: ${csvFilePath}`);
      
    } catch (csvError) {
      console.error(`❌ Lỗi khi tạo file CSV: ${csvError.message}`);
      return;
    }
    
    // Chạy Python script
    // Lưu ý: Khi dùng đường dẫn đầy đủ đến Python trong venv, không cần activate venv
    const command = `"${pythonExe}" "${pythonScript}" "${csvFilePath}" "${outputFolder}"`;
    
    console.log(`🐍 Chạy Python script: ${command}`);
    
    exec(command, { 
      maxBuffer: 10 * 1024 * 1024,
      cwd: path.dirname(pythonScript) // Set working directory để Python có thể import modules đúng cách
    }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Lỗi khi chạy Python script: ${error.message}`);
        if (stderr) {
          console.error(`   stderr: ${stderr}`);
        }
        return;
      }
      
      console.log(`✅ Đã xử lý dữ liệu thành công cho file: ${fileName}`);
      console.log(`   Output folder: ${outputFolder}`);
      if (stdout) {
        console.log(`   Python output: ${stdout}`);
      }
    });
    
  } catch (error) {
    console.error(`❌ Lỗi trong processMeasurementData: ${error.message}`);
    console.error(error.stack);
  }
}

module.exports = controlCtrl;

