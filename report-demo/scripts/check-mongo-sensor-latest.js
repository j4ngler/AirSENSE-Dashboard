/**
 * Kiểm tra MongoDB collection `sensor` — document mới nhất cho topic dashboard.
 * Chạy: node scripts/check-mongo-sensor-latest.js
 */
require("dotenv").config();
const mongoose = require("mongoose");

function mongoUri() {
  const host = process.env.APP_MONGO || "mongodb://127.0.0.1";
  const port = Number(process.env.APP_MONGO_PORT || 27017);
  const db = process.env.APP_MONGO_TABLE || "airsense";
  return `${host}:${port}/${db}`;
}

async function main() {
  const uri = mongoUri();
  const user = process.env.APP_MONGO_USER || "";
  const pass = process.env.APP_MONGO_PASS || "";
  const authSource = process.env.MONGO_AUTH_SOURCE || "admin";
  console.log("[check] Mongo URI (ẩn mật khẩu):", uri.replace(/\/\/([^:]+):[^@]+@/, "//$1:***@"));

  const opts = { serverSelectionTimeoutMS: 8000 };
  if (user) Object.assign(opts, { user, pass, authSource });

  await mongoose.connect(uri, opts);
  const col = mongoose.connection.db.collection("sensor");
  const expectedTopic = "electric-nose/device/AirSENSE/sensor";
  const n = await col.countDocuments();
  console.log("[check] Collection sensor: tổng", n, "document");

  const latestExpected = await col.findOne({ topic: expectedTopic }, { sort: { _id: -1 } });
  console.log("[check] Topic chính xác API dùng:", JSON.stringify(expectedTopic));
  console.log("[check] Có document topic này:", latestExpected ? "CÓ" : "KHÔNG");

  if (latestExpected) {
    console.log("[check] Top-level keys document:", Object.keys(latestExpected).join(", "));
    const c = latestExpected.content || {};
    const keys = c && typeof c === "object" ? Object.keys(c).slice(0, 60) : [];
    console.log("[check] content keys (tối đa 60):", keys.join(", ") || "(rỗng)");
    console.log("[check] Raw content (rút gọn 900 ký tự):\n", JSON.stringify(c).slice(0, 900));
    if (Array.isArray(c.adc)) console.log("[check] content.adc length:", c.adc.length, "mẫu [0..3]:", c.adc.slice(0, 4));
    for (let i = 0; i < 8; i += 1) {
      const v = c[`ADC${i}`] ?? c[`adc${i}`] ?? (Array.isArray(c.adc) ? c.adc[i] : undefined);
      console.log(`[check]   ADC${i}:`, v === undefined ? "(thiếu)" : v);
    }
  } else {
    const sample = await col.findOne({}, { sort: { _id: -1 } });
    if (sample) {
      console.log("[check] Một document bất kỳ (topic thực tế):", sample.topic);
      const topics = await col.distinct("topic", { topic: /electric-nose\/device\/AirSENSE/i });
      console.log("[check] Distinct topic chứa AirSENSE:", topics.slice(0, 15));
    } else {
      console.log("[check] Collection sensor trống — MQTT bridge chưa ghi hoặc DB khác.");
    }
  }

  const withAdc = await col.countDocuments({
    topic: expectedTopic,
    $or: [{ "content.ADC0": { $exists: true } }, { "content.adc.0": { $exists: true } }],
  });
  console.log("[check] Số document cùng topic có ADC trong content:", withAdc);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("[check] Lỗi:", e.message);
  process.exit(1);
});
