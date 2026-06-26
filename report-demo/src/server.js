const path = require("path");
const express = require("express");
const morgan = require("morgan");
const config = require("./config");
const { createDb } = require("./db");
const { createMqttBridge } = require("./services/mqttBridge");
const { createEnoseRouter } = require("./routes/enose");

const app = express();
app.use(morgan("combined"));
app.use(express.json({ limit: "2mb" }));

/* CORS đơn giản: app native không cần, nhưng cần khi gọi qua trình duyệt / WebView. */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-API-Key");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.static(path.join(__dirname, "..", "public")));

const db = createDb(config);
const mqttClient = createMqttBridge(config, db);

app.get("/config.json", (req, res) =>
  res.json({
    title: config.title,
    apiBase: "/api",
    refreshMs: config.refreshMs,
    measurementFileBaseUrl: config.measurementFileBaseUrl || "",
    requireApiKey: Boolean(process.env.APP_API_KEY),
  })
);

/* Health-check không yêu cầu API key (giúp app probe nhanh & người dùng dò mạng). */
app.get("/api/health", async (req, res) => {
  const out = { ok: true, mongo: "unknown", pg: "unknown", mqtt: "unknown", ts: new Date().toISOString() };
  try {
    const state = db.mongoose?.connection?.readyState;
    out.mongo = state === 1 ? "ok" : state === 2 ? "connecting" : "down";
  } catch (_) { out.mongo = "down"; }
  try {
    await db.knex.raw("select 1");
    out.pg = "ok";
  } catch (_) { out.pg = "down"; out.ok = false; }
  try {
    out.mqtt = mqttClient && mqttClient.connected ? "ok" : "down";
  } catch (_) { out.mqtt = "down"; }
  res.json(out);
});

/* Middleware API key opt-in: chỉ bật khi APP_API_KEY có giá trị trong .env.
   Bypass cho request từ chính máy chủ (UI web tại nhà) để không phá vỡ giao diện hiện tại. */
function requireApiKey(req, res, next) {
  const expected = process.env.APP_API_KEY;
  if (!expected) return next();
  const ip = (req.ip || req.connection?.remoteAddress || "").replace(/^::ffff:/, "");
  if (ip === "127.0.0.1" || ip === "::1") return next();
  const got = req.header("X-API-Key") || req.query.api_key;
  if (got && String(got) === String(expected)) return next();
  return res.status(401).json({ success: false, message: "invalid or missing API key" });
}

app.use("/api/enose", requireApiKey, createEnoseRouter(db, mqttClient));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "..", "public", "index.html")));

db.connectMongo().finally(() => {
  app.listen(config.port, () => {
    console.log(`Report demo running: http://127.0.0.1:${config.port}`);
  });
});
