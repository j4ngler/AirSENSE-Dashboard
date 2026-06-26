/**
 * Kiểm tra nhanh PostgreSQL theo .env và dữ liệu bảng dùng cho Dashboard (thiết bị + kênh).
 * Chạy: node scripts/check-pg-dashboard.js
 */
require("dotenv").config();
const { Client } = require("pg");

async function main() {
  const cfg = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD || ""),
    database: process.env.DB_NAME,
  };
  console.log(
    `[check] DB_CLIENT=${process.env.DB_CLIENT} host=${cfg.host} port=${cfg.port} database=${cfg.database} user=${cfg.user}`
  );
  const c = new Client(cfg);
  try {
    await c.connect();
    console.log("[check] Kết nối PostgreSQL: OK");
  } catch (e) {
    console.error("[check] Kết nối PostgreSQL: THẤT BẠI —", e.message);
    process.exitCode = 1;
    return;
  }

  try {
    const t = await c.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name LIKE 'enose_%'
      ORDER BY table_name`);
    const names = t.rows.map((r) => r.table_name);
    console.log("[check] Bảng public.enose_*:", names.length ? names.join(", ") : "(chưa có bảng enose_*)");
  } catch (e) {
    console.log("[check] Liệt kê bảng:", e.message);
  }

  for (const table of ["enose_devices", "enose_sensor_channels"]) {
    try {
      const r = await c.query(`SELECT COUNT(*)::int AS n FROM ${table}`);
      console.log(`[check] ${table}: ${r.rows[0].n} dòng`);
    } catch (e) {
      console.log(`[check] ${table}: không đọc được —`, e.message);
    }
  }

  try {
    const devs = await c.query(
      `SELECT device_id, device_code, name, status FROM enose_devices WHERE COALESCE(delete_flag,0)=0 ORDER BY device_id`
    );
    console.log("[check] enose_devices (delete_flag=0):");
    console.log(JSON.stringify(devs.rows, null, 2));
  } catch (e) {
    console.log("[check] enose_devices:", e.message);
  }

  try {
    const ch = await c.query(
      `SELECT sensor_channel_id, device_code, channel_index, label, sort_order
       FROM enose_sensor_channels WHERE COALESCE(delete_flag,0)=0
       ORDER BY device_code, sort_order, channel_index`
    );
    console.log(`[check] enose_sensor_channels (active): ${ch.rows.length} dòng`);
    console.log(JSON.stringify(ch.rows.slice(0, 24), null, 2));
    if (ch.rows.length > 24) console.log(`... và ${ch.rows.length - 24} dòng nữa`);
  } catch (e) {
    console.log("[check] enose_sensor_channels:", e.message);
  }

  await c.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
