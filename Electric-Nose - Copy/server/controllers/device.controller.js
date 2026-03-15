const knex = require("../config/knex.js");
const {
  returnOK,
  returnFalse,
  returnNotFound,
} = require("../utils/returnResponse.js");
const SensorData = require("../models/mongoDB/sensorData.model.js");
const DeviceStatus = require("../models/mongoDB/deviceStatus.model.js");
const MeasurementData = require("../models/mongoDB/measurementData.model.js");
const Sensor = require("../models/mongoDB/sensor.model.js"); // Collection chung của AirSENSE
const http = require('http');

// Helper function để throttle log (chỉ log mỗi interval giây)
const logThrottle = (() => {
  const lastLogTimes = new Map();
  const LOG_INTERVAL_MS = 10000; // 10 giây
  
  return (key, message, force = false) => {
    const now = Date.now();
    const lastTime = lastLogTimes.get(key) || 0;
    const elapsed = now - lastTime;
    
    if (force || elapsed >= LOG_INTERVAL_MS) {
      lastLogTimes.set(key, now);
      if (typeof message === 'function') {
        console.log(message());
      } else {
        console.log(message);
      }
      return true;
    }
    // Không log nhưng vẫn return false để biết đã throttle
    return false;
  };
})();

var deviceCtrl = {};

deviceCtrl.getDevices = async function (req, res) {
  try {
    const devices = await knex("devices")
      .where({ delete_flag: 0 })
      .select("*");
    
    return returnOK(res, devices);
  } catch (error) {
    console.error("Get devices error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy danh sách thiết bị",
    });
  }
};

deviceCtrl.getDeviceById = async function (req, res) {
  try {
    const { id } = req.params;
    // Query theo name (deviceId string) hoặc mqtt_topic, hoặc device_id nếu là số
    const device = await knex("devices")
      .where(function() {
        // Nếu id là số, có thể là device_id INT
        if (!isNaN(id)) {
          this.where({ device_id: parseInt(id), delete_flag: 0 });
        }
        // Luôn query theo name và mqtt_topic (cho string deviceId)
        this.orWhere({ name: id, delete_flag: 0 })
          .orWhere({ mqtt_topic: `electric-nose/device/${id}`, delete_flag: 0 });
      })
      .first();
    
    if (!device) {
      return returnNotFound(res, {
        success: false,
        message: "Không tìm thấy thiết bị",
      });
    }

    return returnOK(res, device);
  } catch (error) {
    console.error("Get device error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy thông tin thiết bị",
    });
  }
};

deviceCtrl.createDevice = async function (req, res) {
  try {
    const { name, type, location, description } = req.body;
    const userId = req.currentUser.user_id;

    const [deviceId] = await knex("devices").insert({
      name,
      type,
      location,
      description,
      status: "offline",
      delete_flag: 0,
      id_created: userId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return returnOK(res, {
      success: true,
      message: "Tạo thiết bị thành công",
      device_id: deviceId,
    });
  } catch (error) {
    console.error("Create device error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi tạo thiết bị",
    });
  }
};

deviceCtrl.updateDevice = async function (req, res) {
  try {
    const { id } = req.params;
    const { name, type, location, description, status } = req.body;

    // Query theo name hoặc mqtt_topic hoặc device_id
    await knex("devices")
      .where(function() {
        if (!isNaN(id)) {
          this.where({ device_id: parseInt(id) });
        }
        this.orWhere({ name: id })
          .orWhere({ mqtt_topic: `electric-nose/device/${id}` });
      })
      .update({
        name,
        type,
        location,
        description,
        status,
        updated_at: new Date(),
      });

    return returnOK(res, {
      success: true,
      message: "Cập nhật thiết bị thành công",
    });
  } catch (error) {
    console.error("Update device error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi cập nhật thiết bị",
    });
  }
};

deviceCtrl.deleteDevice = async function (req, res) {
  try {
    const { id } = req.params;
    
    // Query theo name hoặc mqtt_topic hoặc device_id
    await knex("devices")
      .where(function() {
        if (!isNaN(id)) {
          this.where({ device_id: parseInt(id) });
        }
        this.orWhere({ name: id })
          .orWhere({ mqtt_topic: `electric-nose/device/${id}` });
      })
      .update({
        delete_flag: 1,
        updated_at: new Date(),
      });

    return returnOK(res, {
      success: true,
      message: "Xóa thiết bị thành công",
    });
  } catch (error) {
    console.error("Delete device error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi xóa thiết bị",
    });
  }
};

deviceCtrl.getDeviceStatus = async function (req, res) {
  try {
    const { id } = req.params;
    // Query theo name hoặc mqtt_topic hoặc device_id
    const device = await knex("devices")
      .where(function() {
        if (!isNaN(id)) {
          this.where({ device_id: parseInt(id), delete_flag: 0 });
        }
        this.orWhere({ name: id, delete_flag: 0 })
          .orWhere({ mqtt_topic: `electric-nose/device/${id}`, delete_flag: 0 });
      })
      .first();
    
    if (!device) {
      return returnNotFound(res, {
        success: false,
        message: "Không tìm thấy thiết bị",
      });
    }

    return returnOK(res, {
      device_id: device.name || device.device_id, // Trả về name (string) cho frontend
      status: device.status,
      last_update: device.updated_at,
    });
  } catch (error) {
    console.error("Get device status error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy trạng thái thiết bị",
    });
  }
};

deviceCtrl.getLatestSensorData = async function (req, res) {
  try {
    const { device_id } = req.query;
    
    // Ưu tiên lấy từ MongoDB collection 'sensor' (AirSENSE collection)
    try {
      let topicQuery = {};
      if (device_id) {
        // Topic format: electric-nose/device/{device_id}/sensor
        topicQuery.topic = `electric-nose/device/${device_id}/sensor`;
      } else {
        // Nếu không có device_id, lấy tất cả và sort để lấy mới nhất
        topicQuery.topic = { $regex: /^electric-nose\/device\/.+\/sensor$/ };
      }
      
      const latestSensor = await Sensor.findOne(topicQuery)
        .sort({ time: -1 })
        .lean();
      
      // Chỉ log mỗi 10 giây để tránh spam (dùng key chung cho tất cả query)
      logThrottle('query_sensor_all', () => `🔍 Querying AirSENSE collection with topicQuery: ${JSON.stringify(topicQuery)}`);
      
      if (latestSensor) {
        logThrottle('found_sensor_all', () => `✅ Found sensor data: topic=${latestSensor.topic}, time=${latestSensor.time}, content keys: ${Object.keys(latestSensor.content || {}).join(', ')}`);
      } else {
        // Log debug (không dùng warning) vì có thể chưa có data hoặc device chưa gửi
        // Comment lại vì hiện tại chỉ có 1 thiết bị, không cần log này liên tục
        // Khi nào có nhiều thiết bị mới bỏ comment
        // logThrottle('no_sensor_all', () => `🔍 No sensor data found in AirSENSE collection (may be normal if device hasn't sent data yet)`);
      }
      
      if (latestSensor && latestSensor.content) {
        const content = latestSensor.content;
        const formattedData = [];
        
        // Temperature
        if (content.Temperature !== null && content.Temperature !== undefined) {
          formattedData.push({
            data_type: "temperature",
            value: content.Temperature.toString(),
            unit: "°C",
            created_at: new Date(latestSensor.time * 1000)
          });
        }
        
        // Humidity
        if (content.Humidity !== null && content.Humidity !== undefined) {
          formattedData.push({
            data_type: "humidity",
            value: content.Humidity.toString(),
            unit: "%",
            created_at: new Date(latestSensor.time * 1000)
          });
        }
        
        // MEMS sensors (ADC0-7) - Lưu ADC value thay vì voltage
        const memsSensors = ['mems1', 'mems2', 'mems3', 'mems4', 'mems5', 'mems6', 'mems7', 'mems8'];
        const adcKeys = ['ADC0', 'ADC1', 'ADC2', 'ADC3', 'ADC4', 'ADC5', 'ADC6', 'ADC7'];
        memsSensors.forEach((sensor, index) => {
          const adcValue = content[adcKeys[index]];
          if (adcValue !== null && adcValue !== undefined) {
            // Lưu ADC value trực tiếp (không convert sang voltage)
            formattedData.push({
              data_type: sensor,
              value: adcValue.toString(), // Lưu ADC value thay vì voltage
              adc_value: adcValue, // Thêm field adc_value để frontend dễ lấy
              unit: "ADC",
              created_at: new Date(latestSensor.time * 1000)
            });
          }
        });
        
        if (formattedData.length > 0) {
          // Chỉ log mỗi 10 giây để tránh spam (dùng key chung)
          logThrottle('found_latest_all', () => `✅ Found latest sensor data from AirSENSE collection for device: ${device_id || 'all'}`);
          return returnOK(res, formattedData);
        }
      }
    } catch (mongoError) {
      console.warn('⚠️ Error querying AirSENSE sensor collection:', mongoError.message);
    }
    
    // Fallback: Lấy từ SensorData collection (collection riêng)
    try {
      let query = {};
      if (device_id) {
        query.device_id = device_id;
      }
      
      const latestSensorData = await SensorData.findOne(query)
        .sort({ timestamp: -1 })
        .lean();
      
      if (latestSensorData) {
        // Format dữ liệu giống như MySQL để tương thích với frontend
        const formattedData = [];
        
        if (latestSensorData.temperature !== null) {
          formattedData.push({
            data_type: "temperature",
            value: latestSensorData.temperature.toString(),
            unit: "°C",
            created_at: latestSensorData.timestamp || latestSensorData.created_at
          });
        }
        
        if (latestSensorData.humidity !== null) {
          formattedData.push({
            data_type: "humidity",
            value: latestSensorData.humidity.toString(),
            unit: "%",
            created_at: latestSensorData.timestamp || latestSensorData.created_at
          });
        }
        
        // Thêm các MEMS sensors nếu có
        const memsSensors = ['mems1', 'mems2', 'mems3', 'mems4', 'mems5', 'mems6', 'mems7', 'mems8'];
        memsSensors.forEach(sensor => {
          if (latestSensorData[sensor] !== null && latestSensorData[sensor] !== undefined) {
            formattedData.push({
              data_type: sensor,
              value: latestSensorData[sensor].toString(),
              unit: "V", // Voltage hoặc unit tùy theo loại MEMS sensor
              created_at: latestSensorData.timestamp || latestSensorData.created_at
            });
          }
        });
        
        return returnOK(res, formattedData);
      }
    } catch (sensorDataError) {
      console.warn('⚠️ Error querying SensorData collection:', sensorDataError.message);
    }
    
    // Fallback: Lấy từ MySQL nếu MongoDB không có dữ liệu
    try {
      const latestData = await knex("device_data")
        .whereIn("id", function() {
          this.select(knex.raw("MAX(id)"))
            .from("device_data")
            .groupBy("data_type");
        })
        .select("data_type", "value", "unit", "created_at")
        .orderBy("created_at", "desc");

      if (latestData && latestData.length > 0) {
        return returnOK(res, latestData);
      }
    } catch (mysqlError) {
      console.warn('⚠️ MySQL query warning:', mysqlError.message);
    }
    
    // Return mock data nếu cả hai đều không có
    return returnOK(res, [
      { data_type: "temperature", value: "33.3", unit: "°C", created_at: new Date() },
      { data_type: "humidity", value: "61", unit: "%", created_at: new Date() }
    ]);
  } catch (error) {
    console.error("Get latest sensor data error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy dữ liệu sensor mới nhất",
    });
  }
};

deviceCtrl.getMeasurementHistory = async function (req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const { device_id, start_time, end_time } = req.query;
    
    // Ưu tiên lấy từ MongoDB
    let query = {};
    if (device_id) {
      query.device_id = device_id;
    }
    
    // Filter theo thời gian nếu có
    if (start_time || end_time) {
      query.timestamp = {};
      if (start_time) {
        query.timestamp.$gte = new Date(start_time);
      }
      if (end_time) {
        query.timestamp.$lte = new Date(end_time);
      }
    }
    
    const sensorDataList = await SensorData.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    
    if (sensorDataList && sensorDataList.length > 0) {
      const history = sensorDataList.map(data => ({
        timestamp: data.timestamp || data.created_at,
        temperature: data.temperature,
        humidity: data.humidity,
        // Thêm các MEMS sensors
        mems1: data.mems1,
        mems2: data.mems2,
        mems3: data.mems3,
        mems4: data.mems4,
        mems5: data.mems5,
        mems6: data.mems6,
        mems7: data.mems7,
        mems8: data.mems8
      })).reverse(); // Đảo ngược để có thứ tự từ cũ đến mới
      
      return returnOK(res, history);
    }
    
    // Fallback: Lấy từ MySQL nếu MongoDB không có dữ liệu
    try {
      const rows = await knex("device_data")
        .orderBy("created_at", "desc")
        .limit(limit * 4); // fetch extra rows to cover both temperature & humidity

      const bucket = {};
      rows.forEach((row) => {
        const timestamp = row.created_at ? row.created_at.toISOString() : new Date().toISOString();
        if (!bucket[timestamp]) {
          bucket[timestamp] = {
            timestamp,
            temperature: null,
            humidity: null,
          };
        }
        if (row.data_type === "temperature") {
          bucket[timestamp].temperature = parseFloat(row.value);
        } else if (row.data_type === "humidity") {
          bucket[timestamp].humidity = parseFloat(row.value);
        }
      });

      const history = Object.values(bucket)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .slice(-limit);

      if (history.length > 0) {
        return returnOK(res, history);
      }
    } catch (mysqlError) {
      console.warn('⚠️ MySQL query warning:', mysqlError.message);
    }
    
    // Provide mock data if empty
    const now = new Date();
    const history = [];
    for (let i = limit - 1; i >= 0; i--) {
      const ts = new Date(now.getTime() - i * 60000);
      history.push({
        timestamp: ts.toISOString(),
        temperature: 30 + Math.random() * 5,
        humidity: 50 + Math.random() * 10,
      });
    }

    return returnOK(res, history);
  } catch (error) {
    console.error("Get measurement history error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy dữ liệu lịch sử",
    });
  }
};

// Lấy device status từ MongoDB (real-time)
deviceCtrl.getDeviceStatusFromMongo = async function (req, res) {
  try {
    const { device_id } = req.params;
    
    const deviceStatus = await DeviceStatus.findOne({ device_id })
      .sort({ last_seen: -1 })
      .lean();
    
    if (!deviceStatus) {
      return returnNotFound(res, {
        success: false,
        message: "Không tìm thấy trạng thái thiết bị",
      });
    }
    
    return returnOK(res, deviceStatus);
  } catch (error) {
    console.error("Get device status from MongoDB error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy trạng thái thiết bị",
    });
  }
};

// Lấy danh sách measurement files
deviceCtrl.getMeasurementFiles = async function (req, res) {
  try {
    const { device_id } = req.query;
    const limit = parseInt(req.query.limit, 10) || 20;
    
    let query = {};
    if (device_id) {
      query.device_id = device_id;
    }
    
    const measurements = await MeasurementData.find(query)
      .sort({ started_at: -1 })
      .limit(limit)
      .select('device_id file_name status progress samples_count started_at completed_at')
      .lean();
    
    return returnOK(res, measurements);
  } catch (error) {
    console.error("Get measurement files error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy danh sách file đo",
    });
  }
};

// Lấy chi tiết một measurement file
deviceCtrl.getMeasurementFileDetail = async function (req, res) {
  try {
    const { file_name } = req.params;
    
    const measurement = await MeasurementData.findOne({ file_name })
      .sort({ started_at: -1 })
      .lean();
    
    if (!measurement) {
      return returnNotFound(res, {
        success: false,
        message: "Không tìm thấy file đo",
      });
    }
    
    return returnOK(res, measurement);
  } catch (error) {
    console.error("Get measurement file detail error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy chi tiết file đo",
    });
  }
};

// Lấy measurement đang chạy (status = 'started' hoặc 'in_progress')
deviceCtrl.getActiveMeasurement = async function (req, res) {
  try {
    const { device_id } = req.query;
    
    // Chỉ tìm measurement đang chạy (started hoặc in_progress)
    // Và kiểm tra thời gian: nếu đã quá 45 phút (40 phút đo + 5 phút buffer) thì coi như completed
    let query = {
      status: { $in: ['started', 'in_progress'] }
    };
    
    if (device_id) {
      query.device_id = device_id;
    }
    
    // Lấy measurement đang chạy mới nhất
    const activeMeasurement = await MeasurementData.findOne(query)
      .sort({ started_at: -1 })
      .select('device_id file_name status progress samples_count started_at completed_at duration_ms')
      .lean();
    
    if (activeMeasurement) {
      // Kiểm tra nếu measurement đã quá thời gian (45 phút = 2700000 ms)
      const now = new Date();
      const startedAt = new Date(activeMeasurement.started_at);
      const elapsed = now - startedAt;
      const maxDuration = 45 * 60 * 1000; // 45 phút
      
      if (elapsed > maxDuration) {
        // Measurement đã quá thời gian, coi như completed
        console.log(`⚠️ Measurement ${activeMeasurement.file_name} đã quá thời gian (${Math.round(elapsed/60000)} phút), coi như completed`);
        
        // Cập nhật status thành completed
        try {
          await MeasurementData.updateOne(
            { _id: activeMeasurement._id },
            { 
              $set: { 
                status: 'completed',
                completed_at: new Date(startedAt.getTime() + (activeMeasurement.duration_ms || 40 * 60 * 1000))
              }
            }
          );
        } catch (updateError) {
          console.error('Error updating measurement status:', updateError);
        }
        
        // Trả về như không có measurement active
        const lastCompleted = await MeasurementData.findOne({ status: 'completed', device_id: device_id || { $exists: true } })
          .sort({ completed_at: -1 })
          .select('device_id file_name status progress samples_count started_at completed_at duration_ms')
          .lean();
        
        return returnOK(res, {
          active: false,
          measurement: lastCompleted || null
        });
      }
      
      return returnOK(res, {
        active: true,
        measurement: activeMeasurement
      });
    }
    
    // Nếu không có measurement đang chạy, lấy measurement completed gần nhất để hiển thị thông báo
    let completedQuery = {
      status: 'completed'
    };
    
    if (device_id) {
      completedQuery.device_id = device_id;
    }
    
    const lastCompleted = await MeasurementData.findOne(completedQuery)
      .sort({ completed_at: -1 })
      .select('device_id file_name status progress samples_count started_at completed_at duration_ms')
      .lean();
    
    return returnOK(res, {
      active: false,
      measurement: lastCompleted || null
    });
  } catch (error) {
    console.error("Get active measurement error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi kiểm tra measurement đang chạy",
    });
  }
};

// Lấy sensor data theo khoảng thời gian
deviceCtrl.getSensorDataByTimeRange = async function (req, res) {
  try {
    const { device_id, start_time, end_time } = req.query;
    const limit = parseInt(req.query.limit, 10) || 100;
    
    // Ưu tiên query từ collection Sensor (AirSENSE) vì dữ liệu được lưu chắc chắn ở đây
    // Collection SensorData có thể không có dữ liệu do lỗi khi save
    
    // Build topic pattern
    const topicPattern = device_id 
      ? `electric-nose/device/${device_id}/sensor`
      : /^electric-nose\/device\/.+\/sensor$/;
    
    let query = typeof topicPattern === 'string' 
      ? { topic: topicPattern } 
      : { topic: { $regex: topicPattern } };
    
    // Convert start_time và end_time sang epoch seconds để so sánh với field 'time'
    if (start_time || end_time) {
      query.time = {};
      if (start_time) {
        const startDate = new Date(start_time);
        const startEpoch = Math.floor(startDate.getTime() / 1000);
        query.time.$gte = startEpoch;
      }
      if (end_time) {
        const endDate = new Date(end_time);
        const endEpoch = Math.floor(endDate.getTime() / 1000);
        query.time.$lte = endEpoch;
      }
    }
    
    // Query từ collection Sensor (AirSENSE)
    const sensorRecords = await Sensor.find(query)
      .sort({ time: -1, _id: -1 })
      .limit(limit)
      .lean();
    
    // Transform dữ liệu từ format Sensor sang format SensorData để frontend không cần thay đổi
    const sensorData = sensorRecords.map(record => {
      const content = record.content || {};
      const timestamp = new Date(record.time * 1000); // Convert epoch seconds sang Date
      
      const result = [];
      
      // Thêm temperature
      if (content.Temperature !== undefined && content.Temperature !== null) {
        result.push({
          device_id: device_id || 'AirSENSE',
          data_type: 'temperature',
          value: content.Temperature,
          adc_value: null,
          timestamp: timestamp,
          created_at: timestamp.toISOString()
        });
      }
      
      // Thêm humidity
      if (content.Humidity !== undefined && content.Humidity !== null) {
        result.push({
          device_id: device_id || 'AirSENSE',
          data_type: 'humidity',
          value: content.Humidity,
          adc_value: null,
          timestamp: timestamp,
          created_at: timestamp.toISOString()
        });
      }
      
      // Thêm ADC values (mems1-8)
      for (let i = 0; i < 8; i++) {
        const adcKey = `ADC${i}`;
        if (content[adcKey] !== undefined && content[adcKey] !== null) {
          result.push({
            device_id: device_id || 'AirSENSE',
            data_type: `mems${i + 1}`,
            value: content[adcKey],
            adc_value: parseInt(content[adcKey]) || null,
            timestamp: timestamp,
            created_at: timestamp.toISOString()
          });
        }
      }
      
      return result;
    }).flat(); // Flatten array of arrays
    
    return returnOK(res, sensorData);
  } catch (error) {
    console.error("Get sensor data by time range error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy dữ liệu sensor theo khoảng thời gian: " + error.message,
    });
  }
};

// ========== FUNCTIONS ĐỌC TỪ COLLECTION 'sensor' CHUNG CỦA AIRSENSE ==========

// Lấy dữ liệu sensor mới nhất từ collection 'sensor' (AirSENSE common collection)
deviceCtrl.getLatestSensorDataFromAirSENSE = async function (req, res) {
  try {
    // Lấy deviceId từ params (route: /:id/airsense/latest) hoặc query (route: /airsense/latest?deviceId=...)
    const deviceId = req.params.id || req.params.deviceId || req.query.deviceId || req.query.device_id;
    
    // Topic format: ESP32 gửi: electric-nose/device/{device_id}/sensor
    const topicPattern = deviceId 
      ? `electric-nose/device/${deviceId}/sensor`
      : /^electric-nose\/device\/.+\/sensor$/;
    
    const query = typeof topicPattern === 'string' 
      ? { topic: topicPattern } 
      : { topic: { $regex: topicPattern } };
    
    // Chỉ log mỗi 10 giây để tránh spam (dùng key chung cho tất cả query)
    logThrottle('query_airsense_all', () => `🔍 Querying AirSENSE collection for device: ${deviceId || 'all'}, topic pattern: ${topicPattern}`);
    
    // Sort theo cả time và _id để đảm bảo lấy record mới nhất (nếu có nhiều records cùng time)
    const latest = await Sensor
      .findOne(query)
      .sort({ time: -1, _id: -1 })
      .lean();
    
    // Nếu record mới nhất không có ADC values, tìm record có ADC trong 15 giây gần nhất
    // (vì ESP32 gửi full data mỗi 10 giây khi đang đo, nhưng temperature/humidity mỗi 2 giây)
    let recordWithADC = latest;
    if (latest && (!latest.content?.ADC0 && !latest.content?.ADC1 && !latest.content?.ADC2)) {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeWindow = 15; // 15 giây gần nhất
      
      const queryWithADC = {
        ...query,
        time: { $gte: currentTime - timeWindow },
        'content.ADC0': { $exists: true, $ne: null }
      };
      
      recordWithADC = await Sensor
        .findOne(queryWithADC)
        .sort({ time: -1, _id: -1 })
        .lean();
      
      // Nếu tìm thấy record có ADC, dùng nó nhưng vẫn dùng temperature/humidity từ record mới nhất
      if (recordWithADC && latest) {
        // Merge: dùng ADC từ record cũ, nhưng dùng temperature/humidity từ record mới nhất
        recordWithADC.content = {
          ...recordWithADC.content,
          Temperature: latest.content?.Temperature || latest.content?.temperature || recordWithADC.content?.Temperature,
          Humidity: latest.content?.Humidity || latest.content?.humidity || recordWithADC.content?.Humidity
        };
        recordWithADC.time = latest.time; // Dùng time mới nhất
      }
    }
    
    const finalRecord = recordWithADC || latest;
    
    if (!finalRecord) {
      // Chỉ log debug (không dùng warning) vì đây có thể là query device không tồn tại (không phải lỗi)
      // Comment lại vì hiện tại chỉ có 1 thiết bị, không cần log này liên tục
      // Khi nào có nhiều thiết bị mới bỏ comment
      // if (deviceId && deviceId !== 'AirSENSE' && deviceId !== 'all') {
      //   logThrottle('no_data_invalid', () => `🔍 No data found for device: ${deviceId} (device may not exist or has no data yet)`);
      // }
      return returnOK(res, {
        success: false,
        message: "Chưa có dữ liệu từ thiết bị",
        data: null
      });
    }
    
    // Chỉ log mỗi 10 giây để tránh spam (dùng key chung)
    logThrottle('found_airsense_all', () => `✅ Found latest sensor data: topic=${finalRecord.topic}, time=${finalRecord.time}, content keys: ${Object.keys(finalRecord.content || {}).join(', ')}`);
    
    // Extract device_id from topic: electric-nose/device/{device_id}/sensor
    const topicParts = finalRecord.topic.split('/');
    const deviceIdFromTopic = topicParts.length >= 3 && topicParts[1] === 'device' 
      ? topicParts[2] 
      : (topicParts[1] || deviceId);
    
    // Lấy ADC values từ content, đảm bảo là số nguyên
    const adcArray = [
      finalRecord.content?.ADC0,
      finalRecord.content?.ADC1,
      finalRecord.content?.ADC2,
      finalRecord.content?.ADC3,
      finalRecord.content?.ADC4,
      finalRecord.content?.ADC5,
      finalRecord.content?.ADC6,
      finalRecord.content?.ADC7,
    ].map(val => {
      // Convert sang số nguyên, nếu null/undefined thì trả về null (không phải 0)
      if (val === null || val === undefined) return null;
      const numVal = parseInt(val);
      return isNaN(numVal) ? null : numVal;
    });
    
    // Extract temperature and humidity từ content
    const temperature = finalRecord.content?.Temperature !== undefined && finalRecord.content?.Temperature !== null 
      ? parseFloat(finalRecord.content.Temperature) 
      : (finalRecord.content?.temperature !== undefined && finalRecord.content?.temperature !== null
          ? parseFloat(finalRecord.content.temperature)
          : null);
    
    const humidity = finalRecord.content?.Humidity !== undefined && finalRecord.content?.Humidity !== null
      ? parseFloat(finalRecord.content.Humidity)
      : (finalRecord.content?.humidity !== undefined && finalRecord.content?.humidity !== null
          ? parseFloat(finalRecord.content.humidity)
          : null);
    
    console.log(`📊 AirSENSE API - Device: ${deviceIdFromTopic}, Temperature: ${temperature}, Humidity: ${humidity}, ADC values:`, adcArray);
    
    return returnOK(res, {
      success: true,
      data: {
        device_id: deviceIdFromTopic,
        timestamp: finalRecord.time,
        timestamp_iso: new Date(finalRecord.time * 1000).toISOString(),
        temperature: temperature,
        humidity: humidity,
        adc: adcArray
      }
    });
  } catch (error) {
    console.error("Get latest sensor data from AirSENSE collection error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy dữ liệu từ MongoDB: " + error.message,
    });
  }
};

// Lấy lịch sử đo từ collection 'sensor' (AirSENSE common collection)
deviceCtrl.getMeasurementHistoryFromAirSENSE = async function (req, res) {
  try {
    // Lấy deviceId từ params (route: /:id/airsense/history) hoặc query (route: /airsense/history?deviceId=...)
    const deviceId = req.params.id || req.params.deviceId || req.query.deviceId || req.query.device_id;
    const limit = parseInt(req.query.limit, 10) || 100;
    const fromTime = req.query.from_time ? parseInt(req.query.from_time, 10) : null;
    const toTime = req.query.to_time ? parseInt(req.query.to_time, 10) : null;
    
    const topicPattern = deviceId 
      ? `electric-nose/${deviceId}/sensor-data`
      : /^electric-nose\/.+\/sensor-data$/;
    
    let query = typeof topicPattern === 'string' 
      ? { topic: topicPattern } 
      : { topic: { $regex: topicPattern } };
    
    // Thêm filter theo thời gian nếu có
    if (fromTime || toTime) {
      query.time = {};
      if (fromTime) query.time.$gte = fromTime;
      if (toTime) query.time.$lte = toTime;
    }
    
    const history = await Sensor
      .find(query)
      .sort({ time: -1 })
      .limit(limit)
      .lean();
    
    const formatted = history.map(item => ({
      timestamp: item.time,
      timestamp_iso: new Date(item.time * 1000).toISOString(),
      temperature: item.content?.Temperature || null,
      humidity: item.content?.Humidity || null,
      adc: [
        item.content?.ADC0 || 0,
        item.content?.ADC1 || 0,
        item.content?.ADC2 || 0,
        item.content?.ADC3 || 0,
        item.content?.ADC4 || 0,
        item.content?.ADC5 || 0,
        item.content?.ADC6 || 0,
        item.content?.ADC7 || 0,
      ]
    }));
    
    // Đảo ngược để hiển thị từ cũ đến mới (cho chart)
    formatted.reverse();
    
    return returnOK(res, {
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error("Get measurement history from AirSENSE collection error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy lịch sử đo: " + error.message,
    });
  }
};

// Lấy danh sách device IDs có dữ liệu trong collection 'sensor'
deviceCtrl.getDeviceListFromAirSENSE = async function (req, res) {
  try {
    // Lấy tất cả topics unique có pattern electric-nose/device/{device_id}/sensor (format mới)
    // Hoặc pattern cũ: electric-nose/{device_id}/sensor-data
    const devices = await Sensor.distinct('topic', {
      $or: [
        { topic: { $regex: /^electric-nose\/device\/.+\/sensor$/ } }, // Format mới
        { topic: { $regex: /^electric-nose\/.+\/sensor-data$/ } }      // Format cũ (backward compatible)
      ]
    });
    
    const deviceList = devices.map(topic => {
      const parts = topic.split('/');
      let deviceId = 'unknown';
      
      // Format mới: electric-nose/device/{device_id}/sensor
      if (parts.length >= 4 && parts[1] === 'device') {
        deviceId = parts[2];
      } 
      // Format cũ: electric-nose/{device_id}/sensor-data
      else if (parts.length >= 2) {
        deviceId = parts[1];
      }
      
      return {
        device_id: deviceId,
        topic: topic,
        last_seen: null,
        last_seen_timestamp: null
      };
    });
    
    // Lấy last_seen cho mỗi device
    for (let device of deviceList) {
      const latest = await Sensor
        .findOne({ topic: device.topic })
        .sort({ time: -1 })
        .select('time')
        .lean();
      
      if (latest) {
        device.last_seen = new Date(latest.time * 1000).toISOString();
        device.last_seen_timestamp = latest.time;
      }
    }
    
    return returnOK(res, {
      success: true,
      count: deviceList.length,
      devices: deviceList
    });
  } catch (error) {
    console.error("Get device list from AirSENSE collection error:", error);
    return returnFalse(res, {
      success: false,
      message: "Lỗi khi lấy danh sách thiết bị: " + error.message,
    });
  }
};

// Download file từ ESP32 file server (proxy)
deviceCtrl.downloadFileFromESP32 = async function (req, res) {
  try {
    let { file_name, device_id } = req.query;
    
    console.log(`📥 Download request: file_name=${file_name}, device_id=${device_id || 'not provided'}`);
    
    if (!file_name) {
      console.error('❌ Missing file_name parameter');
      return returnFalse(res, {
        success: false,
        message: "Thiếu tên file"
      });
    }
    
    // Đảm bảo file name có extension .csv nếu chưa có
    if (!file_name.endsWith('.csv')) {
      file_name = `${file_name}.csv`;
    }
    
    console.log(`📥 Processing download for file: ${file_name}`);
    console.log(`📥 About to query MongoDB...`);
    
    // Lấy IP từ device status
    let wifiIp = null;
    try {
      console.log(`🔍 Entering MongoDB query try block...`);
      console.log(`🔍 Querying MongoDB for device status...`);
      
      // Kiểm tra MongoDB connection
      console.log(`🔍 Requiring mongoose...`);
      const mongoose = require('mongoose');
      console.log(`🔍 MongoDB readyState check...`);
      const readyState = mongoose.connection.readyState;
      console.log(`🔍 MongoDB readyState: ${readyState} (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)`);
      
      if (readyState !== 1) {
        console.error(`❌ MongoDB not connected. ReadyState: ${readyState}`);
        throw new Error('MongoDB chưa kết nối. ReadyState: ' + readyState);
      }
      
      console.log(`✅ MongoDB is connected, proceeding with query...`);
      
      if (device_id) {
        console.log(`🔍 Looking for device_id: ${device_id}`);
        const deviceStatus = await DeviceStatus.findOne({ device_id: device_id })
          .sort({ updated_at: -1 })
          .lean();
        wifiIp = deviceStatus?.wifi_ip;
        console.log(`📡 Found device status: wifi_ip=${wifiIp || 'null'}`);
      } else {
        // Nếu không có device_id, thử tìm theo AirSENSE trước, nếu không có thì lấy device mới nhất
        console.log(`🔍 Looking for device status...`);
        
        // Ưu tiên tìm device_id = 'AirSENSE' (device_id mà ESP32 sử dụng)
        let latestStatus = await DeviceStatus.findOne({ device_id: 'AirSENSE' })
          .sort({ updated_at: -1 })
          .lean();
        
        // Nếu không tìm thấy AirSENSE, thử tìm device mới nhất
        if (!latestStatus) {
          console.log(`🔍 AirSENSE not found, looking for latest device...`);
          latestStatus = await DeviceStatus.findOne()
            .sort({ updated_at: -1 })
            .lean();
        }
        
        wifiIp = latestStatus?.wifi_ip;
        console.log(`📡 Found status: wifi_ip=${wifiIp || 'null'}, device_id=${latestStatus?.device_id || 'null'}, updated_at=${latestStatus?.updated_at || 'null'}`);
        
        // Nếu vẫn không có wifi_ip, thử tìm device có wifi_ip không null
        if (!wifiIp) {
          console.log(`🔍 No wifi_ip found, searching for any device with wifi_ip...`);
          const deviceWithIp = await DeviceStatus.findOne({ 
            wifi_ip: { $ne: null, $exists: true } 
          })
            .sort({ updated_at: -1 })
            .lean();
          
          if (deviceWithIp) {
            wifiIp = deviceWithIp.wifi_ip;
            console.log(`📡 Found device with IP: wifi_ip=${wifiIp}, device_id=${deviceWithIp.device_id}`);
          }
        }
      }
    } catch (mongoError) {
      console.error('❌ Error querying MongoDB for device status:', mongoError);
      console.error('❌ Error name:', mongoError.name);
      console.error('❌ Error message:', mongoError.message);
      if (mongoError.stack) {
        console.error('❌ Error stack:', mongoError.stack);
      }
      return returnFalse(res, {
        success: false,
        message: "Lỗi khi truy vấn database: " + (mongoError.message || mongoError.toString())
      });
    }
    
    if (!wifiIp) {
      console.error('❌ No WiFi IP found in device status');
      console.log(`🔍 Attempting to find any device with wifi_ip in MongoDB...`);
      
      // Fallback: Tìm tất cả devices và lấy device có wifi_ip mới nhất
      try {
        const allDevicesWithIp = await DeviceStatus.find({ 
          wifi_ip: { $ne: null, $exists: true, $ne: '' } 
        })
          .sort({ updated_at: -1 })
          .limit(5)
          .lean();
        
        console.log(`🔍 Found ${allDevicesWithIp.length} device(s) with wifi_ip`);
        
        if (allDevicesWithIp.length > 0) {
          // Lấy device mới nhất có wifi_ip
          wifiIp = allDevicesWithIp[0].wifi_ip;
          console.log(`✅ Found WiFi IP from fallback query: ${wifiIp} (device_id: ${allDevicesWithIp[0].device_id})`);
        } else {
          console.error('❌ No devices with wifi_ip found in MongoDB');
        }
      } catch (fallbackError) {
        console.error('❌ Error in fallback query:', fallbackError);
      }
      
      if (!wifiIp) {
        return returnFalse(res, {
          success: false,
          message: "Không tìm thấy IP address của thiết bị trong database. Vui lòng đảm bảo:\n1. ESP32 đã kết nối WiFi\n2. ESP32 đã gửi status message với wifi_ip\n3. Backend đã nhận và lưu status message vào MongoDB"
        });
      }
    }
    
    // Tạo URL để tải file từ ESP32
    const fileUrl = `http://${wifiIp}/${file_name}`;
    console.log(`📥 Downloading file from ESP32: ${fileUrl}`);
    
    // Fetch file từ ESP32 và pipe về client
    const request = http.get(fileUrl, (response) => {
      console.log(`📡 ESP32 response status: ${response.statusCode} for ${fileUrl}`);
      
      if (response.statusCode !== 200) {
        let errorBody = '';
        response.on('data', (chunk) => { errorBody += chunk; });
        response.on('end', () => {
          console.error(`❌ ESP32 returned error: ${response.statusCode}, body: ${errorBody.substring(0, 200)}`);
          if (!res.headersSent) {
            res.status(response.statusCode || 500).json({
              success: false,
              message: `Failed to download file from ESP32: HTTP ${response.statusCode}`
            });
          }
        });
        return;
      }
      
      // Set headers để browser download file
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${file_name}"`);
      
      // Pipe response từ ESP32 đến client
      response.pipe(res);
      
      response.on('end', () => {
        console.log(`✅ File downloaded successfully: ${file_name}`);
      });
      
      response.on('error', (error) => {
        console.error('❌ Error in ESP32 response stream:', error);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Error downloading file: ' + error.message
          });
        }
      });
    });
    
    request.on('error', (error) => {
      console.error(`❌ Error connecting to ESP32 (${fileUrl}):`, error.message);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: `Error connecting to ESP32: ${error.message}. Please check if ESP32 is online and file exists.`
        });
      }
    });
    
    // Set timeout 10 giây
    request.setTimeout(10000, () => {
      console.error(`❌ Request timeout for ${fileUrl}`);
      request.destroy();
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          message: 'Request timeout: ESP32 did not respond in time'
        });
      }
    });
    
    // Không return gì vì response sẽ được pipe trực tiếp
    // Hàm này không cần return vì đã xử lý response trong callback
  } catch (error) {
    console.error("❌ Download file from ESP32 error:", error);
    // Đảm bảo response chưa được gửi trước khi trả về lỗi
    if (!res.headersSent) {
      return returnFalse(res, {
        success: false,
        message: "Lỗi khi tải file từ ESP32: " + error.message,
      });
    } else {
      // Nếu headers đã được gửi, chỉ log lỗi
      console.error("❌ Error after headers sent, cannot send error response");
    }
  }
};

module.exports = deviceCtrl;

