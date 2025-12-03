const knex = require("../config/knex.js");
const mqtt = require("mqtt");
const {
  returnOK,
  returnFalse,
  returnNotFound,
} = require("../utils/returnResponse.js");

// MQTT Client configuration (có thể lấy từ .env)
const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || "mqtt://localhost:1883");

var controlCtrl = {};

controlCtrl.controlDevice = async function (req, res) {
  try {
    const { id } = req.params;
    const { command, value } = req.body;
    const userId = req.currentUser.user_id;

    // Check device exists
    const device = await knex("devices")
      .where({ device_id: id, delete_flag: 0 })
      .first();

    if (!device) {
      return returnNotFound(res, {
        success: false,
        message: "Không tìm thấy thiết bị",
      });
    }

    // Send MQTT command
    const topic = `electric-nose/device/${id}/control`;
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

    // Log control action
    await knex("control_history").insert({
      device_id: id,
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

    // Get WiFi status (mock data - có thể lấy từ device thực tế)
    const wifiStatus = "connected"; // hoặc "disconnected"
    const wifiSSID = "E-NOSE_Network";
    const wifiSignal = -45;

    // Get storage info (mock data - có thể lấy từ device thực tế)
    const storage = {
      total: 32 * 1024 * 1024 * 1024, // 32GB
      used: 8 * 1024 * 1024 * 1024,   // 8GB
      free: 24 * 1024 * 1024 * 1024   // 24GB
    };

    return returnOK(res, {
      total_devices: totalDevices.count,
      online_devices: onlineDevices.count,
      offline_devices: totalDevices.count - onlineDevices.count,
      recent_controls: recentControls.count,
      wifi_status: wifiStatus,
      wifi_ssid: wifiSSID,
      wifi_signal: wifiSignal,
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

    // Send MQTT command to start measurement
    const topic = `electric-nose/device/${device.device_id}/measurement/start`;
    const message = JSON.stringify(measurementPayload);

    mqttClient.publish(topic, message, (err) => {
      if (err) {
        console.error("MQTT publish error:", err);
      }
    });

    // Log control action
    await knex("control_history").insert({
      device_id: device.device_id,
      user_id: userId,
      command: "start_measurement",
      value: JSON.stringify(measurementPayload),
      status: "sent",
      created_at: startedAt,
    });

    return returnOK(res, {
      success: true,
      message: "Đã bắt đầu đo",
      device_id: device.device_id,
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
    // Get settings from database or device
    // Mock data - có thể lấy từ bảng settings trong database
    const settings = {
      wifi_enabled: true,
      heating_enabled: true,
      air_pump_enabled: true,
    };

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

    // Send MQTT commands for each setting
    if (wifi !== undefined) {
      const topic = `electric-nose/device/${device.device_id}/settings/wifi`;
      mqttClient.publish(topic, JSON.stringify({ enabled: wifi }));
    }

    if (heating !== undefined) {
      const topic = `electric-nose/device/${device.device_id}/settings/heating`;
      mqttClient.publish(topic, JSON.stringify({ enabled: heating }));
    }

    if (air_pump !== undefined) {
      const topic = `electric-nose/device/${device.device_id}/settings/air_pump`;
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

module.exports = controlCtrl;

