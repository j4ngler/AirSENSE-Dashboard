const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

const config = {
  port: toNumber(process.env.PORT, 3010),
  title: process.env.REPORT_DEMO_TITLE || "AirSENSE Report Demo",
  refreshMs: toNumber(process.env.REPORT_DEMO_REFRESH_MS, 10000),

  db: {
    client: process.env.DB_CLIENT || "mysql",
    host: process.env.DB_HOST || "127.0.0.1",
    port: toNumber(process.env.DB_PORT, 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },

  mongo: {
    host: process.env.APP_MONGO || "mongodb://127.0.0.1",
    port: toNumber(process.env.APP_MONGO_PORT, 27017),
    user: process.env.APP_MONGO_USER || "",
    pass: process.env.APP_MONGO_PASS || "",
    authSource: process.env.MONGO_AUTH_SOURCE || "admin",
    database: process.env.APP_MONGO_TABLE || "airsense",
  },

  mqtt: {
    broker: process.env.MQTT_BROKER_URL || "mqtt://127.0.0.1:1883",
    port: toNumber(process.env.MQTT_PORT, 1883),
    username: process.env.MQTT_USERNAME || "",
    password: process.env.MQTT_PASSWORD || "",
    clientId: process.env.MQTT_CLIENT_ID || `report_demo_${Math.random().toString(16).slice(2)}`,
  },

  /** URL gốc (vd http://192.168.1.10/sd/) để mở file đo thật; để trống thì chỉ dùng xuất CSV từ Mongo. */
  measurementFileBaseUrl: String(process.env.MEASUREMENT_FILE_BASE_URL || "").trim(),
};

module.exports = config;
