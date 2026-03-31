const knex = require('../config/knex.js');
const DataSensor = require('../models/schemaMongo/dataSensor'); // collection sensor (chung AirSENSE)
const EnoseSensorData = require('../models/schemaMongo/enoseSensorData');
const EnoseDeviceStatus = require('../models/schemaMongo/enoseDeviceStatus');
const EnoseMeasurementData = require('../models/schemaMongo/enoseMeasurementData');
const { returnOK, returnNotFound, returnFalse } = require('../utils/returnResponse.js');

// Helper để throttle log (chỉ log mỗi interval giây)
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
    return false;
  };
})();

const safeMongo = async (fn, fallback = null) => {
  try {
    return await fn();
  } catch (err) {
    console.warn('Mongo warning:', err.message);
    return fallback;
  }
};

// GET /api/enose/devices
exports.listDevices = async (req, res) => {
  try {
    const devices = await knex('enose_devices').where({ delete_flag: 0 }).orderBy('created_at', 'desc');
    return returnOK(res, { success: true, devices });
  } catch (err) {
    console.error('listDevices error:', err);
    return returnFalse(res, 'error');
  }
};

// GET /api/enose/devices/:id/latest
exports.getLatestSensor = async (req, res) => {
  const { id } = req.params; // id = device_code hoặc device_id
  try {
    const device = await knex('enose_devices')
      .where(function () {
        this.where({ device_id: id }).orWhere({ device_code: id }).orWhere({ name: id });
      })
      .first();

    if (!device) return returnNotFound(res, { message: 'device not found' });

    // 1) Ưu tiên collection sensor (chung) nếu có topic/format phù hợp
    const latestSensor = await safeMongo(() =>
      DataSensor.findOne({ 'content.device_id': device.device_code }).sort({ time: -1 }).lean()
    );
    if (latestSensor) {
      return returnOK(res, {
        success: true,
        source: 'mongo_sensor',
        data: latestSensor,
      });
    }

    // 2) Fallback enose_sensor_data
    const latestEnoseData = await safeMongo(() =>
      EnoseSensorData.findOne({ device_id: device.device_code }).sort({ timestamp: -1 }).lean()
    );
    if (latestEnoseData) {
      return returnOK(res, {
        success: true,
        source: 'mongo_enose_sensor_data',
        data: latestEnoseData,
      });
    }

    // 3) Fallback MySQL enose_device_data
    const latestMysql = await knex('enose_device_data')
      .where({ device_id: device.device_id })
      .orderBy('created_at', 'desc')
      .first();

    return returnOK(res, {
      success: !!latestMysql,
      source: 'mysql_enose_device_data',
      data: latestMysql || null,
    });
  } catch (err) {
    console.error('getLatestSensor error:', err);
    return returnFalse(res, 'error');
  }
};

// GET /api/enose/devices/:id/history?from=&to=&limit=
exports.getHistory = async (req, res) => {
  const { id } = req.params;
  const { from, to, limit = 500 } = req.query;
  try {
    const device = await knex('enose_devices')
      .where(function () {
        this.where({ device_id: id }).orWhere({ device_code: id }).orWhere({ name: id });
      })
      .first();
    if (!device) return returnNotFound(res, { message: 'device not found' });

    const query = { device_id: device.device_code };
    if (from) query.timestamp = { ...(query.timestamp || {}), $gte: new Date(from) };
    if (to) query.timestamp = { ...(query.timestamp || {}), $lte: new Date(to) };

    const hist = await safeMongo(() =>
      EnoseSensorData.find(query).sort({ timestamp: -1 }).limit(Number(limit)).lean()
    );

    return returnOK(res, {
      success: true,
      source: 'mongo_enose_sensor_data',
      data: hist || [],
    });
  } catch (err) {
    console.error('getHistory error:', err);
    return returnFalse(res, 'error');
  }
};

// GET /api/enose/devices/:id/status
exports.getStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await knex('enose_devices')
      .where(function () {
        this.where({ device_id: id }).orWhere({ device_code: id }).orWhere({ name: id });
      })
      .first();
    if (!device) return returnNotFound(res, { message: 'device not found' });

    const status = await safeMongo(() =>
      EnoseDeviceStatus.findOne({ device_id: device.device_code }).sort({ timestamp: -1 }).lean()
    );

    return returnOK(res, { success: true, data: status || null });
  } catch (err) {
    console.error('getStatus error:', err);
    return returnFalse(res, 'error');
  }
};

// GET /api/enose/devices/:id/measurements
exports.getMeasurementFiles = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await knex('enose_devices')
      .where(function () {
        this.where({ device_id: id }).orWhere({ device_code: id }).orWhere({ name: id });
      })
      .first();
    if (!device) return returnNotFound(res, { message: 'device not found' });

    const files = await safeMongo(() =>
      EnoseMeasurementData.find({ device_id: device.device_code }).sort({ createdAt: -1 }).lean()
    );

    return returnOK(res, { success: true, data: files || [] });
  } catch (err) {
    console.error('getMeasurementFiles error:', err);
    return returnFalse(res, 'error');
  }
};

// GET /api/enose/devices/measurements/files (không cần device_id, lấy tất cả)
exports.getAllMeasurementFiles = async (req, res) => {
  const { limit = 10 } = req.query;
  try {
    const files = await safeMongo(() =>
      EnoseMeasurementData.find({})
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .lean()
    );

    return returnOK(res, { success: true, data: files || [] });
  } catch (err) {
    console.error('getAllMeasurementFiles error:', err);
    return returnFalse(res, 'error');
  }
};

// GET /api/enose/devices/measurements/active
exports.getActiveMeasurement = async (req, res) => {
  try {
    const { device_id } = req.query;
    
    // Chỉ tìm measurement đang chạy (started hoặc in_progress)
    let query = {
      status: { $in: ['started', 'in_progress'] }
    };
    
    if (device_id) {
      query.device_id = device_id;
    }
    
    // Lấy measurement đang chạy mới nhất
    const activeMeasurement = await safeMongo(() =>
      EnoseMeasurementData.findOne(query)
        .sort({ started_at: -1 })
        .select('device_id file_name status progress samples_count started_at completed_at duration_ms')
        .lean()
    );
    
    // Nếu có measurement đang chạy, kiểm tra xem device có còn online không
    // Kiểm tra bằng cách xem có sensor data mới trong 2 phút gần đây không
    // (Chính xác hơn so với EnoseDeviceStatus vì ESP32 có thể không update status khi tắt)
    if (activeMeasurement) {
      try {
        const deviceIdForCheck = activeMeasurement.device_id;
        const currentTime = Math.floor(Date.now() / 1000);
        const offlineThresholdSeconds = 2 * 60; // 2 phút - nếu không có sensor data trong 2 phút thì coi như offline
        
        // Kiểm tra sensor data mới nhất từ AirSENSE collection
        const recentSensorData = await safeMongo(() =>
          DataSensor.findOne({
            topic: { $regex: new RegExp(`electric-nose/device/${deviceIdForCheck}/sensor`) },
            time: { $gte: currentTime - offlineThresholdSeconds }
          })
            .sort({ time: -1 })
            .select('time')
            .lean()
        );
        
        if (!recentSensorData) {
          // Không có sensor data trong 2 phút gần đây → ESP32 có thể đã tắt
          const measurementAge = Math.floor((Date.now() - new Date(activeMeasurement.started_at).getTime()) / 1000);
          
          // Chỉ đánh dấu failed nếu measurement đã chạy ít nhất 1 phút (tránh false positive khi vừa start)
          if (measurementAge > 60) {
            console.warn(`⚠️ Device ${deviceIdForCheck} không có sensor data trong ${offlineThresholdSeconds/60} phút gần đây`);
            console.warn(`   Measurement ${activeMeasurement.file_name} có thể bị gián đoạn (ESP32 có thể đã tắt)`);
            console.warn(`   Measurement age: ${Math.round(measurementAge/60)} phút`);
            console.warn(`   Marking as FAILED - device appears to be offline`);
            
            // Đánh dấu measurement là failed
            try {
              await safeMongo(() =>
                EnoseMeasurementData.updateOne(
                  { _id: activeMeasurement._id },
                  {
                    $set: {
                      status: 'failed',
                      completed_at: new Date(),
                      failure_reason: `No sensor data received in last ${offlineThresholdSeconds/60} minutes - ESP32 may be offline or turned off`
                    }
                  }
                )
              );
              
              // Trả về như không có measurement active
              return returnOK(res, {
                active: false,
                measurement: null,
                reason: 'device_offline_no_sensor_data'
              });
            } catch (updateError) {
              console.error('Error updating measurement status:', updateError);
            }
          }
        }
      } catch (deviceStatusError) {
        // Nếu không kiểm tra được, tiếp tục với logic kiểm tra thời gian
        console.warn('⚠️ Could not check device sensor data:', deviceStatusError.message);
      }
    }
    
    if (activeMeasurement) {
      // Kiểm tra nếu measurement đã quá thời gian
      const now = new Date();
      const startedAt = new Date(activeMeasurement.started_at);
      const elapsed = now - startedAt;
      const maxDuration = 40 * 60 * 1000; // 40 phút
      
      if (elapsed > maxDuration) {
        // Measurement đã quá thời gian, có thể ESP32 đã restart hoặc mất nguồn
        // Đánh dấu là 'failed' thay vì 'completed' để cho phép start mới ngay
        console.warn(`⚠️ Measurement ${activeMeasurement.file_name} đã quá thời gian (${Math.round(elapsed/60000)} phút)`);
        console.warn(`   Possible reasons: Device restarted, power loss, or measurement timeout`);
        console.warn(`   Marking as FAILED to allow new measurement to start`);
        
        // Cập nhật status thành failed
        try {
          await safeMongo(() =>
            EnoseMeasurementData.updateOne(
              { _id: activeMeasurement._id },
              { 
                $set: { 
                  status: 'failed',
                  completed_at: new Date(),
                  failure_reason: `Measurement timeout after ${Math.round(elapsed/60000)} minutes - possibly device restarted`
                }
              }
            )
          );
        } catch (updateError) {
          console.error('Error updating measurement status:', updateError);
        }
        
        // Trả về như không có measurement active (để frontend có thể start mới)
        // KHÔNG trả về measurement cũ để frontend không hiển thị
        return returnOK(res, {
          active: false,
          measurement: null, // Không trả về measurement cũ
          reason: 'timeout_or_restart'
        });
      }
      
      // QUAN TRỌNG: Kiểm tra xem có nhận được measurement/data từ ESP32 không
      // Nếu measurement đã chạy quá 10 phút nhưng không nhận được measurement/data mới → đánh dấu failed
      // Vì ESP32 vẫn gửi sensor data (temperature/humidity) ngay cả khi không đo,
      // nên cần kiểm tra measurement/data để biết thực sự đang đo hay không
      // Tăng thời gian từ 3 phút lên 10 phút để tránh đánh dấu failed quá sớm
      const measurementDataCheckDuration = 10 * 60 * 1000; // 10 phút (tăng từ 3 phút)
      if (elapsed > measurementDataCheckDuration) {
        try {
          // Kiểm tra xem có measurement/data mới trong 10 phút gần đây không
          // Lấy lại measurement để kiểm tra updatedAt (MongoDB tự động tạo từ timestamps: true)
          const currentMeasurement = await safeMongo(() =>
            EnoseMeasurementData.findById(activeMeasurement._id).lean()
          );
          
          if (currentMeasurement) {
            const updatedAt = currentMeasurement.updatedAt || currentMeasurement.updated_at;
            const timeSinceUpdate = updatedAt ? (now.getTime() - new Date(updatedAt).getTime()) : elapsed;
            const samplesIncreased = currentMeasurement.samples_count > (activeMeasurement.samples_count || 0);
            
            // Kiểm tra thêm: xem device có còn gửi sensor data không (nếu có sensor data mới thì có thể đang đo)
            let hasRecentSensorData = false;
            try {
              const deviceIdFromMeasurement = currentMeasurement.device_id;
              const recentSensorData = await safeMongo(() =>
                DataSensor.findOne({
                  topic: { $regex: new RegExp(`electric-nose/device/${deviceIdFromMeasurement}/sensor`) },
                  time: { $gte: Math.floor(Date.now() / 1000) - 60 } // Trong 1 phút gần đây
                }).sort({ time: -1 }).lean()
              );
              hasRecentSensorData = !!recentSensorData;
            } catch (sensorDataCheckError) {
              // Nếu không kiểm tra được, coi như có sensor data để tránh đánh dấu failed nhầm
              hasRecentSensorData = true;
            }
            
            // Nếu không có cập nhật trong 10 phút, samples_count không tăng, VÀ không có sensor data mới → có thể không đang đo
            if (timeSinceUpdate > measurementDataCheckDuration && !samplesIncreased && !hasRecentSensorData) {
              // Không có cập nhật measurement/data trong 10 phút gần đây và không có sensor data mới
              // Có thể ESP32 không thực sự đang đo (chỉ gửi sensor data bình thường)
              console.warn(`⚠️ Measurement ${activeMeasurement.file_name} đã chạy ${Math.round(elapsed/60000)} phút nhưng không nhận được measurement/data mới trong ${Math.round(timeSinceUpdate/60000)} phút`);
              console.warn(`   ESP32 có thể chỉ gửi sensor data (temperature/humidity) mà không thực sự đang đo`);
              console.warn(`   Samples count: ${activeMeasurement.samples_count || 0} → ${currentMeasurement.samples_count} (${samplesIncreased ? 'increased' : 'not increased'})`);
              console.warn(`   Has recent sensor data: ${hasRecentSensorData}`);
              console.warn(`   Marking as FAILED - measurement may not be actually running`);
              
              // Đánh dấu measurement là failed
              try {
                await safeMongo(() =>
                  EnoseMeasurementData.updateOne(
                    { _id: activeMeasurement._id },
                    {
                      $set: {
                        status: 'failed',
                        completed_at: new Date(),
                        failure_reason: `No measurement/data received in last ${Math.round(timeSinceUpdate/60000)} minutes and no recent sensor data - ESP32 may not be actually sampling`
                      }
                    }
                  )
                );
                
                // Trả về như không có measurement active
                return returnOK(res, {
                  active: false,
                  measurement: null,
                  reason: 'no_measurement_data'
                });
              } catch (updateError) {
                console.error('Error updating measurement status:', updateError);
              }
            } else if (timeSinceUpdate > measurementDataCheckDuration && !samplesIncreased && hasRecentSensorData) {
              // Có sensor data mới nhưng không có measurement/data → có thể đang đo nhưng chưa có data
              // Chỉ log warning, không đánh dấu failed
              logThrottle(`measurement_no_data_but_sensor_${activeMeasurement._id}`, () => 
                `⚠️ Measurement ${activeMeasurement.file_name} đã chạy ${Math.round(elapsed/60000)} phút nhưng chưa có measurement/data, nhưng device vẫn gửi sensor data - có thể đang đo nhưng chưa có kết quả`
              );
            }
          }
        } catch (measurementDataCheckError) {
          // Nếu không kiểm tra được, tiếp tục với logic bình thường
          console.warn('⚠️ Could not check recent measurement/data:', measurementDataCheckError.message);
        }
      }
      
      // Kiểm tra thêm: Nếu measurement đã chạy quá 35 phút nhưng chưa đến 40 phút, cảnh báo
      const warningDuration = 35 * 60 * 1000; // 35 phút
      if (elapsed > warningDuration && elapsed <= maxDuration) {
        console.warn(`⚠️ Measurement ${activeMeasurement.file_name} đã chạy ${Math.round(elapsed/60000)} phút - approaching timeout`);
      }
      
      return returnOK(res, {
        active: true,
        measurement: activeMeasurement
      });
    }
    
    // Nếu không có measurement đang chạy, chỉ trả về completed gần nhất (KHÔNG trả về failed)
    // Vì failed measurement thường là do restart/interrupt, không cần hiển thị cho user
    let completedQuery = {
      status: 'completed'
    };
    
    if (device_id) {
      completedQuery.device_id = device_id;
    }
    
    // Chỉ lấy completed measurement gần nhất (trong 2 giờ gần đây) để hiển thị
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    completedQuery.completed_at = { $gte: twoHoursAgo };
    
    const lastCompleted = await safeMongo(() =>
      EnoseMeasurementData.findOne(completedQuery)
        .sort({ completed_at: -1 })
        .select('device_id file_name status progress samples_count started_at completed_at duration_ms failure_reason')
        .lean()
    );
    
    // Chỉ trả về completed measurement gần đây, KHÔNG trả về failed
    // Nếu không có completed gần đây, trả về null để frontend hiển thị "Ready"
    return returnOK(res, {
      active: false,
      measurement: lastCompleted || null, // Chỉ trả về completed, không trả về failed
      canStart: true // Cho phép start measurement mới
    });
  } catch (err) {
    console.error('getActiveMeasurement error:', err);
    return returnFalse(res, { success: false, message: 'Lỗi khi kiểm tra measurement đang chạy' });
  }
};

// ========== AIRSENSE INTEGRATION ENDPOINTS ==========

// GET /api/enose/devices/airsense/latest hoặc /api/enose/devices/:id/airsense/latest
// Lấy dữ liệu sensor mới nhất từ collection 'sensor' (AirSENSE common collection)
exports.getLatestSensorDataFromAirSENSE = async (req, res) => {
  try {
    // Lấy deviceId từ params hoặc query
    const deviceId = req.params.id || req.query.deviceId || req.query.device_id;
    
    // Topic format: ESP32 gửi: electric-nose/device/{device_id}/sensor
    const topicPattern = deviceId 
      ? `electric-nose/device/${deviceId}/sensor`
      : /^electric-nose\/device\/.+\/sensor$/;
    
    const query = typeof topicPattern === 'string' 
      ? { topic: topicPattern } 
      : { topic: { $regex: topicPattern } };
    
    logThrottle('query_airsense_all', () => `🔍 Querying AirSENSE collection for device: ${deviceId || 'all'}, topic pattern: ${topicPattern}`);
    
    // Chỉ lấy record trong 30 giây gần nhất để tránh trả về dữ liệu cũ khi ESP32 đã tắt
    const currentTime = Math.floor(Date.now() / 1000);
    const maxAge = 30; // 30 giây
    
    // QUAN TRỌNG: Query không filter theo time nếu ESP32 gửi timestamp sai (tương lai)
    // Thay vào đó, lấy record mới nhất và kiểm tra timestamp sau
    const queryWithTime = {
      ...query
      // Không filter theo time ở đây vì ESP32 có thể gửi timestamp sai (tương lai)
      // Sẽ kiểm tra timestamp sau khi lấy được record
    };
    
    const latest = await safeMongo(() =>
      DataSensor.findOne(queryWithTime)
        .sort({ _id: -1 }) // Sort theo _id thay vì time để lấy record mới nhất (không phụ thuộc timestamp)
        .lean()
    );
    
    // Kiểm tra timestamp của record mới nhất
    // Nếu timestamp là tương lai hoặc quá cũ, có thể ESP32 gửi sai timestamp
    if (latest) {
      const recordAge = Math.abs(currentTime - latest.time);
      const maxAgeSeconds = 3600; // Cho phép sai lệch tối đa 1 giờ
      
      // Nếu timestamp quá khác biệt (tương lai hoặc quá cũ), log warning
      // Nhưng vẫn dùng record này vì có thể ESP32 gửi timestamp sai
      if (recordAge > maxAgeSeconds) {
        logThrottle('timestamp_mismatch', () => 
          `⚠️ Timestamp mismatch: record.time=${latest.time}, currentTime=${currentTime}, diff=${recordAge}s. ESP32 có thể gửi timestamp sai. Using _id timestamp instead.`
        );
        // Không reject record, sẽ dùng _id timestamp khi trả về
      }
    }
    
    // Kiểm tra xem có measurement đang chạy không
    let hasActiveMeasurement = false;
    if (latest) {
      try {
        const deviceIdFromLatest = latest.topic.split('/')[2] || deviceId;
        const activeMeasurement = await safeMongo(() =>
          EnoseMeasurementData.findOne({
            device_id: deviceIdFromLatest,
            status: { $in: ['started', 'in_progress'] }
          }).lean()
        );
        
        hasActiveMeasurement = !!activeMeasurement;
      } catch (measurementCheckError) {
        hasActiveMeasurement = false;
      }
    }
    
    // Chỉ merge ADC nếu có measurement đang chạy
    let recordWithADC = latest;
    if (latest && !latest.content?.ADC0 && !latest.content?.ADC1 && !latest.content?.ADC2 && hasActiveMeasurement) {
      const timeWindow = 10; // 10 giây gần nhất
      
      const queryWithADC = {
        ...query,
        time: { $gte: currentTime - timeWindow },
        'content.ADC0': { $exists: true, $ne: null }
      };
      
      recordWithADC = await safeMongo(() =>
        DataSensor.findOne(queryWithADC)
          .sort({ time: -1, _id: -1 })
          .lean()
      );
      
      if (recordWithADC && latest) {
        const adcRecordAge = currentTime - recordWithADC.time;
        if (adcRecordAge <= timeWindow) {
          recordWithADC.content = {
            ...recordWithADC.content,
            Temperature: latest.content?.Temperature || latest.content?.temperature || recordWithADC.content?.Temperature,
            Humidity: latest.content?.Humidity || latest.content?.humidity || recordWithADC.content?.Humidity
          };
          recordWithADC.time = latest.time;
        } else {
          recordWithADC = latest;
        }
      } else {
        recordWithADC = latest;
      }
    } else if (latest && !hasActiveMeasurement) {
      recordWithADC = latest;
    }
    
    const finalRecord = recordWithADC || latest;
    
    if (!finalRecord) {
      return returnOK(res, {
        success: false,
        message: 'Chưa có dữ liệu từ thiết bị',
        data: null
      });
    }
    
    logThrottle('found_airsense_all', () => `✅ Found latest sensor data: topic=${finalRecord.topic}, time=${finalRecord.time}`);
    
    // Extract device_id from topic
    const topicParts = finalRecord.topic.split('/');
    const deviceIdFromTopic = topicParts.length >= 3 && topicParts[1] === 'device' 
      ? topicParts[2] 
      : (topicParts[1] || deviceId);
    
    // Trả về ADC values nếu có trong data (không phụ thuộc vào hasActiveMeasurement)
    // Vì frontend sẽ tự kiểm tra measurement status và quyết định hiển thị
    let adcArray = null;
    
    // Luôn lấy ADC từ data nếu có (không cần kiểm tra hasActiveMeasurement)
    const adcValues = [
      finalRecord.content?.ADC0,
      finalRecord.content?.ADC1,
      finalRecord.content?.ADC2,
      finalRecord.content?.ADC3,
      finalRecord.content?.ADC4,
      finalRecord.content?.ADC5,
      finalRecord.content?.ADC6,
      finalRecord.content?.ADC7,
    ];
    
    // Kiểm tra xem có ít nhất 1 ADC value không null không
    const hasAnyADC = adcValues.some(val => val !== null && val !== undefined);
    
    if (hasAnyADC) {
      adcArray = adcValues.map(val => {
        if (val === null || val === undefined) return null;
        const numVal = parseInt(val);
        return isNaN(numVal) ? null : numVal;
      });
      
      // QUAN TRỌNG: Kiểm tra age dựa trên _id (thời gian insert) thay vì time field
      // Vì ESP32 có thể gửi timestamp sai, nên dùng _id để xác định record mới nhất
      // _id là ObjectId chứa timestamp, có thể extract để check age
      let recordAge = currentTime - finalRecord.time;
      
      // Nếu timestamp quá cũ (> 1 giờ), có thể ESP32 gửi timestamp sai
      // Dùng _id để estimate age thay vì time field
      if (Math.abs(recordAge) > 3600) {
        // Timestamp không đáng tin, dùng _id để estimate
        if (finalRecord._id && finalRecord._id.getTimestamp) {
          const idTimestamp = Math.floor(finalRecord._id.getTimestamp().getTime() / 1000);
          recordAge = currentTime - idTimestamp;
          logThrottle('using_id_timestamp', () => `⚠️ Using _id timestamp instead of time field (time diff: ${currentTime - finalRecord.time}s)`);
        }
      }
      
      const maxAge = 30; // 30 giây
      
      // Chỉ trả về ADC nếu data còn mới (trong 30 giây)
      if (recordAge > maxAge) {
        adcArray = null;
        logThrottle('adc_too_old', () => `⚠️ ADC data quá cũ (${recordAge}s), không trả về`);
      } else {
        const hasValidADC = adcArray.some(val => val !== null && val !== undefined);
        if (!hasValidADC) {
          adcArray = null;
        } else {
          logThrottle('adc_returned', () => `✅ Returning ADC array: ${adcArray.filter(v => v !== null).length}/8 values, hasActiveMeasurement=${hasActiveMeasurement}`);
        }
      }
    } else {
      logThrottle('no_adc_in_data', () => `⚠️ No ADC values in sensor data, hasActiveMeasurement=${hasActiveMeasurement}`);
    }
    
    // Extract temperature and humidity
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
    
    // QUAN TRỌNG: Kiểm tra và sửa timestamp nếu nó là tương lai hoặc quá cũ
    let finalTimestamp = finalRecord.time;
    const timestampDiff = Math.abs(currentTime - finalTimestamp);
    
    // Nếu timestamp là tương lai (> 1 giờ) hoặc quá cũ (> 1 giờ), dùng _id timestamp hoặc current time
    if (timestampDiff > 3600) {
      // Timestamp không đáng tin, dùng _id timestamp nếu có
      if (finalRecord._id && finalRecord._id.getTimestamp) {
        finalTimestamp = Math.floor(finalRecord._id.getTimestamp().getTime() / 1000);
        logThrottle('timestamp_fixed', () => 
          `⚠️ Fixed invalid timestamp: ${finalRecord.time} → ${finalTimestamp} (using _id, diff: ${timestampDiff}s)`
        );
      } else {
        // Fallback: dùng current time
        finalTimestamp = currentTime;
        logThrottle('timestamp_fixed', () => 
          `⚠️ Fixed invalid timestamp: ${finalRecord.time} → ${currentTime} (using current time, diff: ${timestampDiff}s)`
        );
      }
    }
    
    return returnOK(res, {
      success: true,
      data: {
        device_id: deviceIdFromTopic,
        timestamp: finalTimestamp,
        timestamp_iso: new Date(finalTimestamp * 1000).toISOString(),
        temperature: temperature,
        humidity: humidity,
        adc: adcArray  // null nếu không đang đo, array nếu đang đo
      }
    });
  } catch (error) {
    console.error('Get latest sensor data from AirSENSE collection error:', error);
    return returnFalse(res, {
      success: false,
      message: 'Lỗi khi lấy dữ liệu từ MongoDB: ' + error.message,
    });
  }
};

// GET /api/enose/devices/airsense/devices
// Lấy danh sách device IDs có dữ liệu trong collection 'sensor'
exports.getDeviceListFromAirSENSE = async (req, res) => {
  try {
    // Lấy tất cả topics unique có pattern electric-nose/device/{device_id}/sensor
    const devices = await safeMongo(() =>
      DataSensor.distinct('topic', {
        topic: { $regex: /^electric-nose\/device\/.+\/sensor$/ }
      })
    ) || [];
    
    const deviceList = devices.map(topic => {
      const parts = topic.split('/');
      let deviceId = 'unknown';
      
      // Topic format: electric-nose/device/{device_id}/sensor
      // parts[0] = "electric-nose"
      // parts[1] = "device"
      // parts[2] = device_id
      // parts[3] = "sensor"
      if (parts.length >= 4 && parts[1] === 'device') {
        deviceId = parts[2];
      } else if (parts.length >= 3 && parts[1] === 'device') {
        // Fallback: nếu không có "sensor" ở cuối
        deviceId = parts[2];
      }
      
      // Log để debug
      logThrottle(`parse_device_id_${deviceId}`, () => 
        `🔍 Parsed device_id: "${deviceId}" from topic: "${topic}" (parts: ${parts.length})`
      );
      
      return {
        device_id: deviceId,
        topic: topic,
        last_seen: null,
        last_seen_timestamp: null
      };
    });
    
    // Lấy last_seen cho mỗi device
    for (let device of deviceList) {
      const latest = await safeMongo(() =>
        DataSensor.findOne({ topic: device.topic })
          .sort({ time: -1 })
          .select('time')
          .lean()
      );
      
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
    console.error('Get device list from AirSENSE collection error:', error);
    return returnFalse(res, {
      success: false,
      message: 'Lỗi khi lấy danh sách thiết bị: ' + error.message,
    });
  }
};

// GET /api/enose/devices/files/download?file_name=...&device_id=...
// Download file từ ESP32 file server (proxy)
exports.downloadFileFromESP32 = async (req, res) => {
  try {
    const http = require('http');
    let { file_name, device_id } = req.query;
    
    console.log(`📥 Download request: file_name=${file_name}, device_id=${device_id || 'not provided'}`);
    
    if (!file_name) {
      console.error('❌ Missing file_name parameter');
      return returnFalse(res, {
        success: false,
        message: 'Thiếu tên file'
      });
    }
    
    // Đảm bảo file name có extension .csv nếu chưa có
    if (!file_name.endsWith('.csv')) {
      file_name = `${file_name}.csv`;
    }
    
    // Lấy IP từ device status
    let wifiIp = null;
    try {
      // Kiểm tra MongoDB connection
      const mongoose = require('mongoose');
      const readyState = mongoose.connection.readyState;
      if (readyState !== 1) {
        console.error(`❌ MongoDB not connected. ReadyState: ${readyState}`);
        throw new Error('MongoDB chưa kết nối. ReadyState: ' + readyState);
      }
      
      console.log(`✅ MongoDB is connected, proceeding with query...`);
      
      if (device_id) {
        console.log(`🔍 Looking for device_id: ${device_id}`);
        const deviceStatus = await safeMongo(() =>
          EnoseDeviceStatus.findOne({ device_id: device_id })
            .sort({ updatedAt: -1 })
            .lean()
        );
        wifiIp = deviceStatus?.wifi_ip;
        console.log(`📡 Found device status: wifi_ip=${wifiIp || 'null'}`);
      } else {
        // Nếu không có device_id, thử tìm theo AirSENSE trước, nếu không có thì lấy device mới nhất
        console.log(`🔍 Looking for device status...`);
        
        // Ưu tiên tìm device_id = 'AirSENSE' (device_id mà ESP32 sử dụng)
        let latestStatus = await safeMongo(() =>
          EnoseDeviceStatus.findOne({ device_id: 'AirSENSE' })
            .sort({ updatedAt: -1 })
            .lean()
        );
        
        // Nếu không tìm thấy AirSENSE, thử tìm device mới nhất
        if (!latestStatus) {
          console.log(`🔍 AirSENSE not found, looking for latest device...`);
          latestStatus = await safeMongo(() =>
            EnoseDeviceStatus.findOne()
              .sort({ updatedAt: -1 })
              .lean()
          );
        }
        
        wifiIp = latestStatus?.wifi_ip;
        console.log(`📡 Found status: wifi_ip=${wifiIp || 'null'}, device_id=${latestStatus?.device_id || 'null'}, updatedAt=${latestStatus?.updatedAt || 'null'}`);
        
        // Nếu vẫn không có wifi_ip, thử tìm device có wifi_ip không null
        if (!wifiIp) {
          console.log(`🔍 No wifi_ip found, searching for any device with wifi_ip...`);
          const deviceWithIp = await safeMongo(() =>
            EnoseDeviceStatus.findOne({ 
              wifi_ip: { $ne: null, $exists: true } 
            })
              .sort({ updatedAt: -1 })
              .lean()
          );
          
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
        message: 'Lỗi khi truy vấn database: ' + (mongoError.message || mongoError.toString())
      });
    }
    
    if (!wifiIp) {
      console.error('❌ No WiFi IP found in device status');
      console.log(`🔍 Attempting to find any device with wifi_ip in MongoDB...`);
      
      // Fallback: Tìm tất cả devices và lấy device có wifi_ip mới nhất
      try {
        const allDevicesWithIp = await safeMongo(() =>
          EnoseDeviceStatus.find({ 
            wifi_ip: { $ne: null, $exists: true, $ne: '' } 
          })
            .sort({ updatedAt: -1 })
            .limit(5)
            .lean()
        );
        
        console.log(`🔍 Found ${allDevicesWithIp?.length || 0} device(s) with wifi_ip`);
        
        if (allDevicesWithIp && allDevicesWithIp.length > 0) {
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
          message: 'Không tìm thấy IP address của thiết bị trong database. Vui lòng đảm bảo:\n1. ESP32 đã kết nối WiFi\n2. ESP32 đã gửi status message với wifi_ip\n3. Backend đã nhận và lưu status message vào MongoDB'
        });
      }
    }
    
    // Tạo URL để tải file từ ESP32
    const fileUrl = `http://${wifiIp}/${file_name}`;
    console.log(`📥 Downloading file from ESP32: ${fileUrl}`);
    
    // Fetch file từ ESP32 và pipe về client
    http.get(fileUrl, (response) => {
      if (response.statusCode === 200) {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${file_name}"`);
        response.pipe(res);
      } else {
        console.error(`❌ ESP32 returned status ${response.statusCode}`);
        return returnFalse(res, {
          success: false,
          message: `ESP32 trả về lỗi: ${response.statusCode}`
        });
      }
    }).on('error', (error) => {
      console.error(`❌ Error downloading file from ESP32: ${error.message}`);
      return returnFalse(res, {
        success: false,
        message: `Lỗi khi tải file từ ESP32: ${error.message}`
      });
    });
  } catch (error) {
    console.error('Download file from ESP32 error:', error);
    return returnFalse(res, {
      success: false,
      message: 'Lỗi khi tải file: ' + error.message
    });
  }
};

