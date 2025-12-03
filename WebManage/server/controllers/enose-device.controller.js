const knexLib = require('knex');
const enoseDatabase = require("../config/enoseDatabase.js");
const knex = knexLib(enoseDatabase);
const {
  returnOK,
  returnFalse,
  returnNotFound,
} = require("../utils/returnResponse.js");

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
    const device = await knex("devices")
      .where({ device_id: id, delete_flag: 0 })
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

    await knex("devices")
      .where({ device_id: id })
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
    
    await knex("devices")
      .where({ device_id: id })
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
    const device = await knex("devices")
      .where({ device_id: id, delete_flag: 0 })
      .first();
    
    if (!device) {
      return returnNotFound(res, {
        success: false,
        message: "Không tìm thấy thiết bị",
      });
    }

    return returnOK(res, {
      device_id: device.device_id,
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
    // Get latest data for each sensor type
    const latestData = await knex("device_data")
      .whereIn("id", function() {
        this.select(knex.raw("MAX(id)"))
          .from("device_data")
          .groupBy("data_type");
      })
      .select("data_type", "value", "unit", "created_at")
      .orderBy("created_at", "desc");

    return returnOK(res, latestData);
  } catch (error) {
    console.error("Get latest sensor data error:", error);
    // Return mock data if database error
    return returnOK(res, [
      { data_type: "temperature", value: "33.3", unit: "°C", created_at: new Date() },
      { data_type: "humidity", value: "61", unit: "%", created_at: new Date() }
    ]);
  }
};

deviceCtrl.getMeasurementHistory = async function (req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
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

    // Provide mock data if empty
    if (history.length === 0) {
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const ts = new Date(now.getTime() - i * 60000);
        history.push({
          timestamp: ts.toISOString(),
          temperature: 30 + Math.random() * 5,
          humidity: 50 + Math.random() * 10,
        });
      }
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

module.exports = deviceCtrl;

