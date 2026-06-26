const mongoose = require("mongoose");
const knexLib = require("knex");

function createDb(config) {
  const dbClient = config.db.client === "pg" ? "pg" : "mysql";
  const connection = {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  };
  if (dbClient === "mysql") {
    connection.charset = "utf8";
  }

  const knex = knexLib({
    client: dbClient,
    connection,
    pool: { min: 0, max: 5 },
  });

  const deviceStatusSchema = new mongoose.Schema(
    {
      device_id: String,
      status: String,
      wifi_ssid: String,
      wifi_signal: Number,
      wifi_status: String,
      wifi_ip: String,
      storage: Object,
      heating_enabled: Boolean,
      air_pump_enabled: Boolean,
      wifi_enabled: Boolean,
      last_seen: Date,
      timestamp: Date,
    },
    { timestamps: true, collection: "device_status" }
  );

  const measurementSchema = new mongoose.Schema(
    {
      device_id: String,
      file_name: String,
      status: String,
      progress: Number,
      samples_count: Number,
      started_at: Date,
      completed_at: Date,
      duration_ms: Number,
    },
    { timestamps: true, collection: "measurement_data" }
  );

  const dataSensorSchema = new mongoose.Schema(
    { topic: String, time: Number, content: Object },
    { collection: "sensor" }
  );

  const EnoseDeviceStatus = mongoose.model("EnoseDeviceStatus_demo", deviceStatusSchema);
  const EnoseMeasurementData = mongoose.model("EnoseMeasurementData_demo", measurementSchema);
  const DataSensor = mongoose.model("DataSensor_demo", dataSensorSchema);

  async function connectMongo() {
    const mongoUri = `${config.mongo.host}:${config.mongo.port}/${config.mongo.database}`;
    const useAuth = Boolean(config.mongo.user && config.mongo.pass);
    try {
      await mongoose.connect(mongoUri, {
        ...(useAuth
          ? { user: config.mongo.user, pass: config.mongo.pass, authSource: config.mongo.authSource || "admin" }
          : {}),
        serverSelectionTimeoutMS: 5000,
      });
      console.log("[report-demo] Mongo connected");
    } catch (err) {
      if (useAuth) {
        try {
          console.warn("[report-demo] Mongo auth failed, retry without credentials...");
          await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
          console.log("[report-demo] Mongo connected (no auth)");
          return;
        } catch (retryErr) {
          console.warn("[report-demo] Mongo connect failed:", retryErr.message);
          return;
        }
      }
      console.warn("[report-demo] Mongo connect failed:", err.message);
    }
  }

  return {
    knex,
    mongoose,
    models: { EnoseDeviceStatus, EnoseMeasurementData, DataSensor },
    connectMongo,
  };
}

module.exports = { createDb };
