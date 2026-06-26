const express = require("express");

function createEnoseRouter(db, mqttClient) {
  const router = express.Router();
  const { knex, models } = db;
  const { EnoseDeviceStatus, EnoseMeasurementData, DataSensor } = models;

  const ok = (res, data) => res.json(data);

  /**
   * TÃªn file giá»‘ng ESP (HTTP file list): MMDDYYYY_HHMM â€” khÃ´ng Ä‘uÃ´i.
   * Äáº·t biáº¿n mÃ´i trÆ°á»ng TZ (vd: Asia/Ho_Chi_Minh) Ä‘á»ƒ trÃ¹ng mÃºi giá» vá»›i thiáº¿t bá»‹.
   */
  function measurementFileBase(d) {
    const dt = d instanceof Date ? d : new Date(d);
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    const yyyy = dt.getFullYear();
    const hh = String(dt.getHours()).padStart(2, "0");
    const mi = String(dt.getMinutes()).padStart(2, "0");
    return `${mm}${dd}${yyyy}_${hh}${mi}`;
  }

  function measurementCsvStoredName(d) {
    return `${measurementFileBase(d)}.csv`;
  }

  function measurementFileNameQueryVariants(raw) {
    const s = String(raw || "").trim();
    if (!s) return [];
    const out = new Set([s]);
    if (!s.toLowerCase().endsWith(".csv")) out.add(`${s}.csv`);
    else out.add(s.replace(/\.csv$/i, ""));
    return [...out];
  }

  async function getDeviceRow(id) {
    const query = knex("enose_devices").where(function whereId() {
      this.orWhere({ device_code: id }).orWhere({ name: id });
      if (/^\d+$/.test(String(id))) {
        this.orWhere({ device_id: Number(id) });
      }
    });
    return query.first();
  }

  async function logControl(device, command, value) {
    try {
      await knex("enose_control_history").insert({
        device_id: device.device_id,
        user_id: null,
        command,
        value: JSON.stringify(value || {}),
        status: "sent",
        created_at: new Date(),
      });
    } catch (_) {}
  }

  function sensorTopicVariants(code) {
    return [
      `electric-nose/device/${code}/sensor`,
      `electric-nose/device/${code}/Sensor`,
      `electric-nose/device/${code}/sensor-data`,
      `electric-nose/${code}/sensor-data`,
    ];
  }
  async function sendStartMeasurement(device) {
    const code = device.device_code || device.name;
    const startedAt = new Date();
    const fileName = measurementCsvStoredName(startedAt);
    const fileBase = measurementFileBase(startedAt);
    const payload = {
      command: "start_measurement",
      file_name: fileBase,
      file_name_csv: fileName,
      timestamp: startedAt.toISOString(),
    };

    if (mqttClient) {
      // Match luá»“ng WebManage_test dashboard (measurement/start)
      console.log(`[report-demo] start publish -> electric-nose/device/${code}/measurement/start`);
      mqttClient.publish(`electric-nose/device/${code}/measurement/start`, JSON.stringify(payload));
      // Keep compatibility vá»›i firmware chá»‰ nghe control
      console.log(`[report-demo] start publish -> electric-nose/device/${code}/control`);
      mqttClient.publish(`electric-nose/device/${code}/control`, JSON.stringify({ command: "start_measurement", ts: Date.now() }));
      console.log(`[report-demo] start publish -> electric-nose/device/${code}/control/measure`);
      mqttClient.publish(`electric-nose/device/${code}/control/measure`, JSON.stringify({ action: "start", file_name: fileBase, ts: Date.now() }));
      console.log(`[report-demo] start publish -> electric-nose/device/${code}/settings/air_pump`);
      mqttClient.publish(`electric-nose/device/${code}/settings/air_pump`, JSON.stringify({ enabled: true, ts: Date.now() }));
      console.log(`[report-demo] start publish -> electric-nose/device/${code}/control/pump`);
      mqttClient.publish(`electric-nose/device/${code}/control/pump`, JSON.stringify({ enable: true, ts: Date.now() }));
    }

    await EnoseMeasurementData.create({
      device_id: code,
      file_name: fileName,
      status: "started",
      progress: 0,
      samples_count: 0,
      started_at: startedAt,
    }).catch(() => {});

    await logControl(device, "start_measurement", payload);
    return { fileName, startedAt, deviceCode: code, mqttConnected: Boolean(mqttClient?.connected) };
  }

  router.get("/devices", async (req, res) => {
    try {
      const devices = await knex("enose_devices").where({ delete_flag: 0 }).orderBy("created_at", "desc");
      return ok(res, { success: true, devices });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  router.get("/devices/:id/latest", async (req, res) => {
    try {
      const device = await getDeviceRow(req.params.id);
      if (!device) return res.status(404).json({ success: false, message: "device not found" });
      const topics = sensorTopicVariants(device.device_code || device.name);
      const latest = await DataSensor.findOne({ topic: { $in: topics } }).sort({ _id: -1 }).lean();
      return ok(res, { success: !!latest, data: latest || null });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  router.get("/devices/:id/status", async (req, res) => {
    try {
      const device = await getDeviceRow(req.params.id);
      if (!device) return res.status(404).json({ success: false, message: "device not found" });
      const code = device.device_code || device.name;
      const status = await EnoseDeviceStatus.findOne({ device_id: code }).sort({ _id: -1 }).lean();
      return ok(res, { success: true, data: status || null });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  router.get("/devices/:id/measurements", async (req, res) => {
    try {
      const device = await getDeviceRow(req.params.id);
      if (!device) return res.status(404).json({ success: false, message: "device not found" });
      const code = device.device_code || device.name;
      const list = await EnoseMeasurementData.find({ device_id: code }).sort({ createdAt: -1 }).lean();
      return ok(res, { success: true, data: list || [] });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  const STANDARD_CSV_SENSOR_ORDER = ["EtOH3", "EtOH4", "EtOH5", "EtOH6", "EtOH1", "EtOH2", "VOC1", "VOC2"];
  const ADC_LABEL_ORDER = ["EtOH1", "EtOH2", "EtOH3", "EtOH4", "EtOH5", "EtOH6", "VOC1", "VOC2"];

  function buildStandardSensorCsvLines(sensorDocs) {
    const header = ["TimeStamp", "Temperature", "Humidity", ...STANDARD_CSV_SENSOR_ORDER].join(",");
    const lines = [header];
    for (const doc of sensorDocs) {
      const src = doc.content || {};
      const ts =
        doc.time != null
          ? Number(doc.time)
          : Math.floor(new Date(doc.createdAt || Date.now()).getTime() / 1000);
      const temp = src.Temperature ?? src.temperature ?? "";
      const hum = src.Humidity ?? src.humidity ?? "";
      const parts = [ts, temp, hum];
      for (const name of STANDARD_CSV_SENSOR_ORDER) {
        let v = src[name];
        if (v === undefined || v === null) {
          const low = name.toLowerCase();
          for (const k of Object.keys(src)) {
            if (k.toLowerCase() === low) {
              v = src[k];
              break;
            }
          }
        }
        const idx = ADC_LABEL_ORDER.indexOf(name);
        if ((v === undefined || v === null || v === "") && Array.isArray(src.adc) && idx >= 0 && idx < src.adc.length) {
          v = src.adc[idx];
        }
        /* Firmware/bridge Ä‘Ã´i khi chá»‰ ghi ADC0â€¦ADC7, khÃ´ng ghi tÃªn EtOH/VOC trong content. */
        if ((v === undefined || v === null || v === "") && idx >= 0) {
          v = src[`ADC${idx}`] ?? src[`adc${idx}`];
        }
        parts.push(v === undefined || v === null || v === "" ? "" : Number(v));
      }
      lines.push(parts.join(","));
    }
    return `\uFEFF${lines.join("\r\n")}`;
  }

  router.get("/devices/:id/measurement-csv", async (req, res) => {
    try {
      const device = await getDeviceRow(req.params.id);
      if (!device) return res.status(404).json({ success: false, message: "device not found" });
      const code = device.device_code || device.name;
      const fileName = req.query.file ? String(req.query.file) : "";
      if (!fileName) return res.status(400).json({ success: false, message: "missing file query" });
      let m = null;
      for (const fn of measurementFileNameQueryVariants(fileName)) {
        m = await EnoseMeasurementData.findOne({ device_id: code, file_name: fn }).sort({ createdAt: -1 }).lean();
        if (m) break;
      }
      const topics = sensorTopicVariants(code);
      let fromTs;
      let toTs = Math.floor(Date.now() / 1000);
      if (m) {
        const from = m.started_at || m.createdAt;
        const to = m.completed_at || m.updatedAt || new Date();
        fromTs = Math.floor(new Date(from).getTime() / 1000);
        toTs = Math.floor(new Date(to).getTime() / 1000);
      } else {
        fromTs = toTs - 86400 * 7;
      }
      if (toTs < fromTs) toTs = fromTs + 60;
      const list = await DataSensor.find({ topic: { $in: topics }, time: { $gte: fromTs, $lte: toTs } }).sort({ time: 1 }).lean();
      const body = buildStandardSensorCsvLines(list);
      const safeName = fileName.replace(/[^\w.\-]+/g, "_");
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);
      return res.status(200).send(body);
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  router.post("/devices/:id/measurements/delete", async (req, res) => {
    try {
      const device = await getDeviceRow(req.params.id);
      if (!device) return res.status(404).json({ success: false, message: "device not found" });
      const code = device.device_code || device.name;
      const file_name = String(req.body?.file_name || "").trim();
      if (!file_name) return res.status(400).json({ success: false, message: "missing file_name" });
      await EnoseMeasurementData.deleteMany({
        device_id: code,
        file_name: { $in: measurementFileNameQueryVariants(file_name) },
      });
      return ok(res, { success: true });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  router.get("/devices/:id/history", async (req, res) => {
    try {
      const device = await getDeviceRow(req.params.id);
      if (!device) return res.status(404).json({ success: false, message: "device not found" });
      const code = device.device_code || device.name;
      const from = req.query.from ? new Date(req.query.from) : null;
      const to = req.query.to ? new Date(req.query.to) : null;
      const limit = Number(req.query.limit || 120);
      const topics = sensorTopicVariants(code);
      const query = { topic: { $in: topics } };
      if (from || to) {
        query.time = {};
        if (from) query.time.$gte = Math.floor(from.getTime() / 1000);
        if (to) query.time.$lte = Math.floor(to.getTime() / 1000);
      }
      const list = await DataSensor.find(query).sort({ time: -1 }).limit(limit).lean();
      return ok(res, { success: true, data: list || [] });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  router.get("/devices/measurements/active", async (req, res) => {
    const deviceId = req.query.device_id;
    const query = { status: { $in: ["started", "in_progress"] } };
    if (deviceId) query.device_id = deviceId;
    const measurement = await EnoseMeasurementData.findOne(query).sort({ started_at: -1 }).lean().catch(() => null);
    return ok(res, { active: !!measurement, measurement: measurement || null, canStart: !measurement });
  });

  router.get("/control/status", async (req, res) => {
    try {
      const total = await knex("enose_devices").where({ delete_flag: 0 }).count("device_id as count").first();
      const online = await knex("enose_devices").where({ delete_flag: 0, status: "online" }).count("device_id as count").first();
      let recent = { count: 0 };
      try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        recent = await knex("enose_control_history")
          .where("created_at", ">", oneHourAgo)
          .count("id as count")
          .first();
      } catch (_) {}

      return ok(res, {
        total_devices: Number(total?.count || 0),
        online_devices: Number(online?.count || 0),
        offline_devices: Number(total?.count || 0) - Number(online?.count || 0),
        recent_controls: Number(recent?.count || 0),
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  router.post("/devices/:id/start", async (req, res) => {
    const device = await getDeviceRow(req.params.id);
    if (!device) return res.status(404).json({ success: false, message: "device not found" });
    const started = await sendStartMeasurement(device);
    return ok(res, {
      success: true,
      message: started.mqttConnected ? "start command sent" : "start saved but MQTT is disconnected",
      file_name: started.fileName,
      started_at: started.startedAt,
      device_id: started.deviceCode,
      mqtt_connected: started.mqttConnected,
    });
  });

  // Match WebManage_test route style
  router.post("/control/measurement/start", async (req, res) => {
    const requested = req.body?.device_id ? String(req.body.device_id) : "";
    const device = requested
      ? await getDeviceRow(requested)
      : await knex("enose_devices").where({ delete_flag: 0 }).orderBy("device_id", "asc").first();
    if (!device) return res.status(404).json({ success: false, message: "device not found" });
    const started = await sendStartMeasurement(device);
    return ok(res, {
      success: true,
      message: started.mqttConnected ? "start command sent" : "start saved but MQTT is disconnected",
      file_name: started.fileName,
      started_at: started.startedAt,
      device_id: started.deviceCode,
      mqtt_connected: started.mqttConnected,
    });
  });

  router.post("/devices/:id/stop", async (req, res) => {
    const device = await getDeviceRow(req.params.id);
    if (!device) return res.status(404).json({ success: false, message: "device not found" });
    const code = device.device_code || device.name;
    const payload = { command: "stop_measurement", ts: Date.now() };
    if (mqttClient) {
      // Match firmware moi subscribe measurement/stop
      console.log(`[report-demo] stop publish -> electric-nose/device/${code}/measurement/stop`);
      mqttClient.publish(`electric-nose/device/${code}/measurement/stop`, JSON.stringify(payload));
      // Keep compatibility voi firmware cu nghe control
      console.log(`[report-demo] stop publish -> electric-nose/device/${code}/control`);
      mqttClient.publish(`electric-nose/device/${code}/control`, JSON.stringify(payload));
      // Keep compatibility voi firmware cu nghe control/measure + action format
      console.log(`[report-demo] stop publish -> electric-nose/device/${code}/control/measure`);
      mqttClient.publish(`electric-nose/device/${code}/control/measure`, JSON.stringify({ action: "stop", ts: Date.now() }));
      // Failsafe: force OFF air pump theo format firmware hien tai
      console.log(`[report-demo] stop publish -> electric-nose/device/${code}/settings/air_pump`);
      mqttClient.publish(`electric-nose/device/${code}/settings/air_pump`, JSON.stringify({ enabled: false, ts: Date.now() }));
      // Keep compatibility voi firmware cu nghe control/pump
      console.log(`[report-demo] stop publish -> electric-nose/device/${code}/control/pump`);
      mqttClient.publish(`electric-nose/device/${code}/control/pump`, JSON.stringify({ enable: false, ts: Date.now() }));
    }

    await EnoseMeasurementData.updateMany(
      {
        device_id: code,
        status: { $in: ["started", "in_progress"] },
      },
      {
        $set: {
          status: "stopped",
          completed_at: new Date(),
        },
      }
    ).catch(() => {});

    await logControl(device, "stop_measurement", payload);
    return ok(res, {
      success: true,
      message: mqttClient?.connected ? "stop command sent" : "stop saved but MQTT is disconnected",
      mqtt_connected: Boolean(mqttClient?.connected),
    });
  });

  router.post("/control/measurement/stop", async (req, res) => {
    const requested = req.body?.device_id ? String(req.body.device_id) : "";
    const device = requested
      ? await getDeviceRow(requested)
      : await knex("enose_devices").where({ delete_flag: 0 }).orderBy("device_id", "asc").first();
    if (!device) return res.status(404).json({ success: false, message: "device not found" });
    const code = device.device_code || device.name;
    const payload = { command: "stop_measurement", ts: Date.now() };
    if (mqttClient) {
      console.log(`[report-demo] stop publish -> electric-nose/device/${code}/measurement/stop`);
      mqttClient.publish(`electric-nose/device/${code}/measurement/stop`, JSON.stringify(payload));
      console.log(`[report-demo] stop publish -> electric-nose/device/${code}/control`);
      mqttClient.publish(`electric-nose/device/${code}/control`, JSON.stringify(payload));
      console.log(`[report-demo] stop publish -> electric-nose/device/${code}/control/measure`);
      mqttClient.publish(`electric-nose/device/${code}/control/measure`, JSON.stringify({ action: "stop", ts: Date.now() }));
      console.log(`[report-demo] stop publish -> electric-nose/device/${code}/settings/air_pump`);
      mqttClient.publish(`electric-nose/device/${code}/settings/air_pump`, JSON.stringify({ enabled: false, ts: Date.now() }));
      console.log(`[report-demo] stop publish -> electric-nose/device/${code}/control/pump`);
      mqttClient.publish(`electric-nose/device/${code}/control/pump`, JSON.stringify({ enable: false, ts: Date.now() }));
    }

    await EnoseMeasurementData.updateMany(
      {
        device_id: code,
        status: { $in: ["started", "in_progress"] },
      },
      {
        $set: {
          status: "stopped",
          completed_at: new Date(),
        },
      }
    ).catch(() => {});

    await logControl(device, "stop_measurement", payload);
    return ok(res, {
      success: true,
      message: mqttClient?.connected ? "stop command sent" : "stop saved but MQTT is disconnected",
      mqtt_connected: Boolean(mqttClient?.connected),
    });
  });

  router.post("/devices/:id/heating", async (req, res) => {
    const device = await getDeviceRow(req.params.id);
    if (!device) return res.status(404).json({ success: false, message: "device not found" });
    const code = device.device_code || device.name;
    const payload = { command: "heating", value: !!req.body.on, ts: Date.now() };
    if (mqttClient) mqttClient.publish(`electric-nose/device/${code}/control`, JSON.stringify(payload));
    await logControl(device, "heating", payload);
    return ok(res, { success: true });
  });

  router.post("/devices/:id/air-pump", async (req, res) => {
    const device = await getDeviceRow(req.params.id);
    if (!device) return res.status(404).json({ success: false, message: "device not found" });
    const code = device.device_code || device.name;
    const payload = { command: "air_pump", value: !!req.body.on, ts: Date.now() };
    if (mqttClient) {
      mqttClient.publish(`electric-nose/device/${code}/settings/air_pump`, JSON.stringify({ enabled: !!req.body.on, ts: Date.now() }));
      mqttClient.publish(`electric-nose/device/${code}/control/pump`, JSON.stringify({ enable: !!req.body.on, ts: Date.now() }));
      mqttClient.publish(`electric-nose/device/${code}/control`, JSON.stringify(payload));
    }
    await logControl(device, "air_pump", payload);
    return ok(res, { success: true });
  });

  /** CRUD cáº¥u hÃ¬nh kÃªnh cáº£m biáº¿n (ADC index trÃªn firmware), phÃ¹ há»£p 1 ESP32 thay Ä‘á»•i PCB theo bÃ i Ä‘o */
  router.get("/devices/:id/sensor-channels", async (req, res) => {
    try {
      const device = await getDeviceRow(req.params.id);
      if (!device) return res.status(404).json({ success: false, message: "device not found" });
      const code = device.device_code || device.name;
      const channels = await knex("enose_sensor_channels")
        .where({ device_code: code, delete_flag: 0 })
        .orderBy("sort_order", "asc")
        .orderBy("channel_index", "asc");
      return ok(res, { success: true, device_code: code, channels });
    } catch (err) {
      if (String(err.message || "").includes("enose_sensor_channels")) {
        return res.status(500).json({
          success: false,
          message: "Báº£ng enose_sensor_channels chÆ°a cÃ³. Cháº¡y: node scripts/init-pg-schema.js",
        });
      }
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  router.post("/devices/:id/sensor-channels", async (req, res) => {
    try {
      const device = await getDeviceRow(req.params.id);
      if (!device) return res.status(404).json({ success: false, message: "device not found" });
      const code = device.device_code || device.name;
      const body = req.body || {};
      const idx = Number(body.channel_index);
      const label = String(body.label || "").trim();
      const unit = String(body.unit || "ADC").trim().slice(0, 20) || "ADC";
      const sortOrder = Number(body.sort_order);
      if (!Number.isInteger(idx) || idx < 0 || idx > 31) {
        return res.status(400).json({ success: false, message: "channel_index pháº£i lÃ  sá»‘ nguyÃªn 0..31" });
      }
      if (!label) return res.status(400).json({ success: false, message: "label lÃ  báº¯t buá»™c" });
      const dup = await knex("enose_sensor_channels")
        .where({ device_code: code, channel_index: idx, delete_flag: 0 })
        .first();
      if (dup) return res.status(409).json({ success: false, message: "KÃªnh Ä‘Ã£ tá»“n táº¡i cho thiáº¿t bá»‹ nÃ y" });
      await knex("enose_sensor_channels").insert({
        device_code: code,
        channel_index: idx,
        label,
        unit,
        sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
        delete_flag: 0,
        created_at: new Date(),
        updated_at: new Date(),
      });
      const created = await knex("enose_sensor_channels")
        .where({ device_code: code, channel_index: idx, delete_flag: 0 })
        .orderBy("sensor_channel_id", "desc")
        .first();
      await logControl(device, "sensor_channel_create", { channel_index: idx, label, unit });
      return ok(res, { success: true, channel: created });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  router.patch("/sensor-channels/:channelId", async (req, res) => {
    try {
      const channelId = Number(req.params.channelId);
      if (!Number.isFinite(channelId)) return res.status(400).json({ success: false, message: "channelId khÃ´ng há»£p lá»‡" });
      const row = await knex("enose_sensor_channels").where({ sensor_channel_id: channelId, delete_flag: 0 }).first();
      if (!row) return res.status(404).json({ success: false, message: "sensor channel not found" });
      const body = req.body || {};
      const updates = { updated_at: new Date() };
      if (body.label !== undefined) {
        const label = String(body.label || "").trim();
        if (!label) return res.status(400).json({ success: false, message: "label khÃ´ng Ä‘Æ°á»£c rá»—ng" });
        updates.label = label;
      }
      if (body.unit !== undefined) updates.unit = String(body.unit || "ADC").trim().slice(0, 20) || "ADC";
      if (body.sort_order !== undefined) {
        const so = Number(body.sort_order);
        if (!Number.isFinite(so)) return res.status(400).json({ success: false, message: "sort_order khÃ´ng há»£p lá»‡" });
        updates.sort_order = so;
      }
      if (body.channel_index !== undefined) {
        const idx = Number(body.channel_index);
        if (!Number.isInteger(idx) || idx < 0 || idx > 31) {
          return res.status(400).json({ success: false, message: "channel_index pháº£i lÃ  sá»‘ nguyÃªn 0..31" });
        }
        const dup = await knex("enose_sensor_channels")
          .where({ device_code: row.device_code, channel_index: idx, delete_flag: 0 })
          .whereNot({ sensor_channel_id: channelId })
          .first();
        if (dup) return res.status(409).json({ success: false, message: "KÃªnh Ä‘Ã­ch Ä‘Ã£ tá»“n táº¡i" });
        updates.channel_index = idx;
      }
      await knex("enose_sensor_channels").where({ sensor_channel_id: channelId }).update(updates);
      const updated = await knex("enose_sensor_channels").where({ sensor_channel_id: channelId }).first();
      const device = await knex("enose_devices").where({ device_code: row.device_code, delete_flag: 0 }).first();
      if (device) await logControl(device, "sensor_channel_update", { sensor_channel_id: channelId, ...updates });
      return ok(res, { success: true, channel: updated });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  router.post("/sensor-channels/:channelId/delete", async (req, res) => {
    try {
      const channelId = Number(req.params.channelId);
      if (!Number.isFinite(channelId)) return res.status(400).json({ success: false, message: "channelId khÃ´ng há»£p lá»‡" });
      const row = await knex("enose_sensor_channels").where({ sensor_channel_id: channelId, delete_flag: 0 }).first();
      if (!row) return res.status(404).json({ success: false, message: "sensor channel not found" });
      await knex("enose_sensor_channels").where({ sensor_channel_id: channelId }).update({ delete_flag: 1, updated_at: new Date() });
      const device = await knex("enose_devices").where({ device_code: row.device_code, delete_flag: 0 }).first();
      if (device) await logControl(device, "sensor_channel_delete", { sensor_channel_id: channelId, channel_index: row.channel_index });
      return ok(res, { success: true });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  return router;
}

module.exports = { createEnoseRouter };


