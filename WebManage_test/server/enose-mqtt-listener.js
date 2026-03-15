const mqtt = require('mqtt');
const mongoose = require('mongoose');
const knex = require('./config/knex.js');
const EnoseDeviceStatus = require('./models/schemaMongo/enoseDeviceStatus');
const DataSensor = require('./models/schemaMongo/dataSensor'); // Collection sensor chung của AirSENSE
const EnoseMeasurementData = require('./models/schemaMongo/enoseMeasurementData');

// Only start listener if Mongo is connected (avoid crashing on startup)
mongoose.connection.on('connected', () => {
  console.log('[E-Nose MQTT] MongoDB connected, starting MQTT status listener...');
  startMqttListener();
});

function startMqttListener() {
  // Reuse same MQTT env config logic as enose-control.controller
  let mqttBrokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://127.0.0.1:1883';

  if (mqttBrokerUrl && typeof mqttBrokerUrl === 'string') {
    if (mqttBrokerUrl.includes('MQTT_BROKER_URL=')) {
      const parts = mqttBrokerUrl.split('=');
      mqttBrokerUrl = parts[parts.length - 1] || 'mqtt://127.0.0.1:1883';
    }
    mqttBrokerUrl = mqttBrokerUrl.trim();

    if (
      !mqttBrokerUrl.startsWith('mqtt://') &&
      !mqttBrokerUrl.startsWith('mqtts://') &&
      !mqttBrokerUrl.startsWith('ws://')
    ) {
      mqttBrokerUrl = `mqtt://${mqttBrokerUrl}`;
    }
  }

  const mqttPort = parseInt(process.env.MQTT_PORT || '1883', 10);

  const clientId =
    process.env.MQTT_CLIENT_ID_LISTENER || 'enose_listener_' + Math.random().toString(16).slice(2);

  const mqttClient = mqtt.connect(mqttBrokerUrl, {
    port: mqttPort,
    username: process.env.MQTT_USERNAME || undefined,
    password: process.env.MQTT_PASSWORD || undefined,
    clientId,
    reconnectPeriod: 5000,
    connectTimeout: 30 * 1000,
    keepalive: 60,
    clean: true,
  });

  mqttClient.on('connect', () => {
    console.log('[E-Nose MQTT] Listener connected to', mqttBrokerUrl, 'as', clientId);
    
    // Subscribe to status topics from ESP32
    const statusTopic = 'electric-nose/device/+/status';
    mqttClient.subscribe(statusTopic, { qos: 1 }, (err) => {
      if (err) {
        console.error('[E-Nose MQTT] Failed to subscribe status topic:', err.message);
      } else {
        console.log('[E-Nose MQTT] Subscribed to', statusTopic);
      }
    });
    
    // Subscribe to sensor data topics from ESP32
    const sensorTopic = 'electric-nose/device/+/sensor';
    mqttClient.subscribe(sensorTopic, { qos: 1 }, (err) => {
      if (err) {
        console.error('[E-Nose MQTT] Failed to subscribe sensor topic:', err.message);
      } else {
        console.log('[E-Nose MQTT] Subscribed to', sensorTopic);
      }
    });
    
    // Subscribe to measurement/data topics from ESP32
    const measurementDataTopic = 'electric-nose/device/+/measurement/data';
    mqttClient.subscribe(measurementDataTopic, { qos: 1 }, (err) => {
      if (err) {
        console.error('[E-Nose MQTT] Failed to subscribe measurement/data topic:', err.message);
      } else {
        console.log('[E-Nose MQTT] Subscribed to', measurementDataTopic);
      }
    });
  });

  mqttClient.on('error', (err) => {
    console.error('[E-Nose MQTT] Listener error:', err.message);
  });

  mqttClient.on('message', async (topic, messageBuffer) => {
    try {
      const message = messageBuffer.toString();
      let data;
      try {
        data = JSON.parse(message);
      } catch (parseErr) {
        console.error('[E-Nose MQTT] Invalid JSON on topic', topic, ':', message);
        return;
      }

      // Xử lý sensor data từ ESP32
      if (topic.includes('/sensor')) {
        console.log('[E-Nose MQTT] Processing sensor data from', topic);
        await handleSensorData(topic, data);
      }
      
      // Xử lý status từ ESP32
      if (topic.includes('/status')) {
        console.log('[E-Nose MQTT] Processing status message from', topic);
        await handleDeviceStatus(topic, data);
      }
      
      // Xử lý measurement/data từ ESP32
      if (topic.includes('/measurement/data')) {
        console.log('[E-Nose MQTT] Processing measurement/data from', topic);
        await handleMeasurementData(topic, data);
      }
    } catch (err) {
      console.error('[E-Nose MQTT] Error handling MQTT message:', err);
    }
  });
}

function extractDeviceIdFromTopic(topic) {
  const parts = topic.split('/');
  // electric-nose/device/{device_id}/status
  if (parts.length >= 4 && parts[1] === 'device') {
    return parts[2];
  }
  return 'unknown';
}

async function handleDeviceStatus(topic, data) {
  const deviceId = extractDeviceIdFromTopic(topic);

  if (!deviceId || deviceId === 'unknown') {
    console.warn('[E-Nose MQTT] Cannot extract deviceId from topic', topic);
    return;
  }

  // Save to MongoDB device_status collection
  try {
    const deviceStatus = new EnoseDeviceStatus({
      device_id: deviceId,
      status: data.status || 'online',
      wifi_ssid: data.wifi_ssid || null,
      wifi_signal: data.wifi_signal || null,
      wifi_status: data.wifi_status || (data.wifi_ssid ? 'connected' : 'disconnected'),
      wifi_ip: data.wifi_ip || null,
      storage: {
        total: data.storage?.total || 0,
        used: data.storage?.used || 0,
        free: data.storage?.free || 0,
      },
      heating_enabled: data.heating_enabled || false,
      air_pump_enabled: data.air_pump_enabled || false,
      wifi_enabled: data.wifi_enabled !== undefined ? data.wifi_enabled : true,
      last_seen: new Date(),
    });

    await deviceStatus.save();
  } catch (mongoError) {
    console.warn('[E-Nose MQTT] MongoDB not available, skip saving device status:', mongoError.message);
  }

  // Auto-create or update device in MySQL enose_devices table
  try {
    const existingDevice = await knex('enose_devices')
      .where(function () {
        this.where({ device_code: deviceId })
          .orWhere({ name: deviceId })
          .orWhere({ mqtt_topic: `electric-nose/device/${deviceId}` });
      })
      .first();

    if (!existingDevice) {
      await knex('enose_devices').insert({
        device_code: deviceId,
        name: deviceId,
        status: data.status || 'online',
        mqtt_topic: `electric-nose/device/${deviceId}`,
        last_seen: new Date(),
        delete_flag: 0,
        created_at: new Date(),
        updated_at: new Date(),
      });
      console.log('[E-Nose MQTT] Auto-created enose_devices row for', deviceId);
    } else {
      await knex('enose_devices')
        .where({ device_id: existingDevice.device_id })
        .update({
          status: data.status || 'online',
          mqtt_topic: existingDevice.mqtt_topic || `electric-nose/device/${deviceId}`,
          last_seen: new Date(),
          updated_at: new Date(),
        });
    }
  } catch (sqlError) {
    console.error('[E-Nose MQTT] Error updating enose_devices in MySQL:', sqlError.message);
  }
}

// Xử lý sensor data từ ESP32
async function handleSensorData(topic, data) {
  try {
    const deviceId = extractDeviceIdFromTopic(topic);
    
    if (!deviceId || deviceId === 'unknown') {
      console.warn('[E-Nose MQTT] Cannot extract deviceId from topic', topic);
      return;
    }
    
    // Log raw data để debug (mỗi 10 giây)
    const logKey = `sensor_raw_${deviceId}`;
    if (!global[logKey] || Date.now() - global[logKey] > 10000) {
      console.log(`[E-Nose MQTT] Raw sensor data from ${topic}:`, JSON.stringify(data));
      console.log(`[E-Nose MQTT] All keys in data:`, Object.keys(data).join(', '));
      global[logKey] = Date.now();
    }
    
    // QUAN TRỌNG: Luôn dùng thời gian server, bỏ qua timestamp từ ESP32
    // Vì ESP32 có thể gửi timestamp sai (lệch timezone hoặc clock không đồng bộ)
    const timeValue = Math.floor(Date.now() / 1000); // Unix timestamp (seconds) từ server
    
    // Build content object theo format AirSENSE
    const content = {
      Temperature: data.temperature !== undefined ? parseFloat(data.temperature) : null,
      Humidity: data.humidity !== undefined ? parseFloat(data.humidity) : null,
    };
    
    // Log để debug (mỗi 10 giây)
    if (!global[`sensor_content_${deviceId}`] || Date.now() - global[`sensor_content_${deviceId}`] > 10000) {
      console.log(`[E-Nose MQTT] Parsed content: Temperature=${content.Temperature}, Humidity=${content.Humidity}, timeValue=${timeValue} (server time)`);
      global[`sensor_content_${deviceId}`] = Date.now();
    }
    
    // Map ADC values (nếu có)
    let adcFound = false;
    if (data.adc && Array.isArray(data.adc) && data.adc.length > 0) {
      data.adc.forEach((value, index) => {
        if (value !== null && value !== undefined && index < 8) {
          content[`ADC${index}`] = parseInt(value);
          adcFound = true;
        }
      });
    } else {
      // Thử lấy từ các field riêng lẻ
      for (let i = 0; i < 8; i++) {
        const adcValue = data[`adc${i}`] !== undefined ? data[`adc${i}`] : 
                        (data[`ADC${i}`] !== undefined ? data[`ADC${i}`] : null);
        if (adcValue !== null && adcValue !== undefined) {
          content[`ADC${i}`] = parseInt(adcValue);
          adcFound = true;
        }
      }
      
      // Fallback: thử mems1-8
      if (!adcFound) {
        for (let i = 0; i < 8; i++) {
          const memsKey = `mems${i + 1}`;
          if (data[memsKey] !== undefined && data[memsKey] !== null) {
            content[`ADC${i}`] = parseInt(data[memsKey]);
            adcFound = true;
          }
        }
      }
    }
    
    // Log nếu không tìm thấy ADC (mỗi 10 giây)
    if (!adcFound && (!global[`no_adc_${deviceId}`] || Date.now() - global[`no_adc_${deviceId}`] > 10000)) {
      console.log(`[E-Nose MQTT] ⚠️ No ADC values found in sensor data. Available keys: ${Object.keys(data).join(', ')}`);
      global[`no_adc_${deviceId}`] = Date.now();
    }
    
    // Lưu vào MongoDB collection 'sensor' chung của AirSENSE
    try {
      const sensorRecord = new DataSensor({
        topic: topic, // electric-nose/device/{device_id}/sensor
        time: timeValue, // Unix timestamp (seconds)
        content: content
      });
      
      await sensorRecord.save();
      const adcCount = Object.keys(content).filter(k => k.startsWith('ADC')).length;
      console.log(`[E-Nose MQTT] ✅ Saved sensor data: ${topic}, time: ${timeValue} (server time), ADC: ${adcCount} values`);
    } catch (mongoError) {
      console.warn('[E-Nose MQTT] MongoDB not available, skip saving sensor data:', mongoError.message);
    }
  } catch (error) {
    console.error('[E-Nose MQTT] Error handling sensor data:', error);
  }
}

// Xử lý measurement/data từ ESP32
async function handleMeasurementData(topic, data) {
  try {
    const deviceId = extractDeviceIdFromTopic(topic);
    
    if (!deviceId || deviceId === 'unknown') {
      console.warn('[E-Nose MQTT] Cannot extract deviceId from topic', topic);
      return;
    }
    
    // Tìm measurement đang chạy để cập nhật samples_count
    try {
      let measurement = null;
      
      if (data.file_name) {
        // ESP32 có thể gửi file_name ở nhiều format:
        // - "01082026_1606" (format ngắn)
        // - "ENose_20260108_160645.csv" (format đầy đủ)
        // Cần normalize để match
        
        // Thử tìm exact match trước
        measurement = await EnoseMeasurementData.findOne({
          device_id: deviceId,
          file_name: data.file_name,
          status: { $in: ['started', 'in_progress'] }
        }).sort({ started_at: -1 });
        
        // Nếu không tìm thấy, thử extract date/time từ file_name và match
        if (!measurement) {
          // Extract date/time từ format "01082026_1606" hoặc "ENose_20260108_160645.csv"
          const fileName = data.file_name;
          let dateStr = null;
          let timeStr = null;
          
          // Format 1: "01082026_1606" -> date: 01082026, time: 1606
          const match1 = fileName.match(/^(\d{8})_(\d{4})/);
          if (match1) {
            dateStr = match1[1]; // 01082026
            timeStr = match1[2]; // 1606
          }
          
          // Format 2: "ENose_20260108_160645.csv" -> date: 20260108, time: 160645
          const match2 = fileName.match(/ENose[_-](\d{8})[_-](\d{6})/);
          if (match2) {
            dateStr = match2[1]; // 20260108
            timeStr = match2[2]; // 160645
          }
          
          if (dateStr && timeStr) {
            // Tìm measurement có file_name chứa date và time tương ứng
            // Ví dụ: "ENose_20260108_160645.csv" chứa "20260108" và "160645"
            const datePattern = dateStr; // 20260108 hoặc 01082026
            const timePattern = timeStr.substring(0, 4); // 1606 hoặc 1606 (4 số đầu)
            
            measurement = await EnoseMeasurementData.findOne({
              device_id: deviceId,
              file_name: { $regex: datePattern },
              status: { $in: ['started', 'in_progress'] }
            }).sort({ started_at: -1 });
            
            // Nếu vẫn không tìm thấy, thử tìm measurement đang chạy gần nhất
            if (!measurement) {
              measurement = await EnoseMeasurementData.findOne({
                device_id: deviceId,
                status: { $in: ['started', 'in_progress'] }
              }).sort({ started_at: -1 });
            }
          }
        }
      } else {
        // Tìm measurement đang chạy gần nhất
        measurement = await EnoseMeasurementData.findOne({
          device_id: deviceId,
          status: { $in: ['started', 'in_progress'] }
        }).sort({ started_at: -1 });
      }
      
      if (measurement) {
        // Cập nhật measurement
        if (data.status) {
          measurement.status = data.status;
        }
        
        if (data.progress !== undefined) {
          measurement.progress = data.progress;
        }
        
        // QUAN TRỌNG: Cập nhật samples_count nếu có
        if (data.samples_count !== undefined && data.samples_count !== null) {
          measurement.samples_count = parseInt(data.samples_count);
        }
        
        // Cập nhật completed_at nếu status là completed hoặc failed
        if (data.status === 'completed' || data.status === 'failed') {
          measurement.completed_at = new Date();
          
          if (data.duration_ms !== undefined && data.duration_ms !== null) {
            measurement.duration_ms = parseInt(data.duration_ms);
          }
        }
        
        await measurement.save();
        console.log(`[E-Nose MQTT] ✅ Updated measurement: ${measurement.file_name}, samples_count: ${measurement.samples_count}, status: ${measurement.status}`);
      } else {
        console.warn(`[E-Nose MQTT] ⚠️ Measurement data received but no active measurement found for device ${deviceId}, file_name: ${data.file_name || 'N/A'}`);
      }
    } catch (mongoError) {
      console.warn('[E-Nose MQTT] MongoDB not available, skip updating measurement:', mongoError.message);
    }
  } catch (error) {
    console.error('[E-Nose MQTT] Error handling measurement data:', error);
  }
}

