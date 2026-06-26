require("dotenv").config();
const { Client } = require("pg");

async function main() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD || ""),
    database: process.env.DB_NAME,
  });

  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS enose_devices (
      device_id SERIAL PRIMARY KEY,
      device_code VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(150),
      status VARCHAR(30) DEFAULT 'offline',
      mqtt_topic VARCHAR(255),
      last_seen TIMESTAMP NULL,
      delete_flag SMALLINT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS enose_control_history (
      id SERIAL PRIMARY KEY,
      device_id INTEGER NOT NULL,
      user_id INTEGER NULL,
      command VARCHAR(100) NOT NULL,
      value TEXT NULL,
      status VARCHAR(30) DEFAULT 'sent',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS enose_sensor_channels (
      sensor_channel_id SERIAL PRIMARY KEY,
      device_code VARCHAR(100) NOT NULL,
      channel_index SMALLINT NOT NULL,
      label VARCHAR(120) NOT NULL,
      unit VARCHAR(20) NOT NULL DEFAULT 'ADC',
      sort_order INT NOT NULL DEFAULT 0,
      delete_flag SMALLINT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_enose_sensor_channels_device_active
    ON enose_sensor_channels (device_code)
    WHERE delete_flag = 0;
  `);

  const defaultChannels = [
    [0, "EtOH1", 0],
    [1, "EtOH2", 1],
    [2, "EtOH3", 2],
    [3, "EtOH4", 3],
    [4, "EtOH5", 4],
    [5, "EtOH6", 5],
    [6, "VOC1", 6],
    [7, "VOC2", 7],
  ];
  for (const [channelIndex, label, sortOrder] of defaultChannels) {
    await client.query(
      `
      INSERT INTO enose_sensor_channels
        (device_code, channel_index, label, unit, sort_order, delete_flag, created_at, updated_at)
      SELECT 'AirSENSE', $1::smallint, $2, 'ADC', $3::int, 0, NOW(), NOW()
      WHERE NOT EXISTS (
        SELECT 1 FROM enose_sensor_channels
        WHERE device_code = 'AirSENSE' AND channel_index = $1::smallint AND delete_flag = 0
      );
    `,
      [channelIndex, label, sortOrder]
    );
  }

  await client.query(`
    INSERT INTO enose_devices
      (device_code, name, status, mqtt_topic, last_seen, delete_flag, created_at, updated_at)
    VALUES
      ('AirSENSE', 'AirSENSE', 'online', 'electric-nose/device/AirSENSE', NOW(), 0, NOW(), NOW())
    ON CONFLICT (device_code)
    DO UPDATE SET
      name = EXCLUDED.name,
      mqtt_topic = EXCLUDED.mqtt_topic,
      updated_at = NOW();
  `);

  await client.end();
  console.log("PostgreSQL schema initialized and seeded.");
}

main().catch((err) => {
  console.error("Init schema failed:", err.message);
  process.exit(1);
});
