const mqtt = require("mqtt");

function normalizeMqttUrl(url) {
  if (!url.startsWith("mqtt://") && !url.startsWith("mqtts://") && !url.startsWith("ws://")) {
    return `mqtt://${url}`;
  }
  return url;
}

function extractDeviceId(topic) {
  const parts = String(topic || "").split("/").filter((p) => p.length);
  if (parts[0] === "electric-nose" && parts[1] === "device" && parts.length >= 4) return parts[2];
  if (parts[0] === "electric-nose" && parts.length >= 3) return parts[1];
  return "unknown";
}

/** Chuáº©n hÃ³a segment cuá»‘i `sensor` â†’ lowercase Ä‘á»ƒ trÃ¹ng vá»›i GET /latest (query `.../sensor`). */
function canonicalSensorMqttTopic(topic) {
  const parts = String(topic || "").split("/").filter((p) => p.length);
  const deviceId = extractDeviceId(topic);
  const last = parts[parts.length - 1] || "";
  if (deviceId !== "unknown" && (/^sensor$/i.test(last) || /^sensor-data$/i.test(last))) {
    return `electric-nose/device/${deviceId}/sensor`;
  }
  return String(topic || "");
}

function toAdcArray(v) {
  if (v == null) return null;
  if (Array.isArray(v) && v.length) return v;
  if (typeof v === "string") {
    try {
      const p = JSON.parse(v);
      if (Array.isArray(p) && p.length) return p;
    } catch (_) {}
  }
  return null;
}

function createMqttBridge(config, db) {
  const { knex, models } = db;
  const { EnoseDeviceStatus, EnoseMeasurementData, DataSensor } = models;

  async function upsertDeviceRow(deviceId, status) {
    try {
      const row = await knex("enose_devices")
        .where(function whereId() {
          this.where({ device_code: deviceId }).orWhere({ name: deviceId });
        })
        .first();

      if (!row) {
        await knex("enose_devices").insert({
          device_code: deviceId,
          name: deviceId,
          status: status || "online",
          mqtt_topic: `electric-nose/device/${deviceId}`,
          last_seen: new Date(),
          delete_flag: 0,
          created_at: new Date(),
          updated_at: new Date(),
        });
      } else {
        await knex("enose_devices").where({ device_id: row.device_id }).update({
          status: status || "online",
          last_seen: new Date(),
          updated_at: new Date(),
        });
      }
    } catch (err) {
      console.warn("[report-demo] upsert enose_devices:", err.message);
    }
  }

  function hasSensorFields(payload) {
    if (!payload || typeof payload !== "object") return false;
    const root = payload.data && typeof payload.data === "object" && !Array.isArray(payload.data) ? { ...payload.data, ...payload } : payload;
    const content = root.content && typeof root.content === "object" && !Array.isArray(root.content) ? root.content : {};
    const flat = { ...content, ...root };
    if (flat.temperature != null || flat.Temperature != null || flat.humidity != null || flat.Humidity != null) return true;
    if (firstAdcArray(flat)) return true;
    for (let i = 0; i < 32; i += 1) {
      if (flat[`adc${i}`] != null || flat[`ADC${i}`] != null) return true;
    }
    return false;
  }

  function firstAdcArray(payload) {
    const cands = [payload.adc, payload.values, payload.readings, payload.sensor_adc, payload.sensorValues, payload.adc_values, payload.AD, payload.mems];
    for (const a of cands) {
      const arr = toAdcArray(a);
      if (arr) return arr;
    }
    return null;
  }

  function buildSensorContent(payload) {
    const payloadRoot =
      payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)
        ? { ...payload.data, ...payload }
        : payload;
    const nested =
      payloadRoot.content && typeof payloadRoot.content === "object" && !Array.isArray(payloadRoot.content)
        ? payloadRoot.content
        : {};
    const flat = { ...nested, ...payloadRoot };
    const content = {
      Temperature: flat.temperature ?? flat.Temperature ?? null,
      Humidity: flat.humidity ?? flat.Humidity ?? null,
    };
    const ADC_LABEL_ORDER = ["EtOH1", "EtOH2", "EtOH3", "EtOH4", "EtOH5", "EtOH6", "VOC1", "VOC2"];
    const adcArr = firstAdcArray(flat);
    if (adcArr) {
      for (let i = 0; i < adcArr.length && i < 32; i += 1) {
        const v = adcArr[i];
        if (v === null || v === undefined || Number.isNaN(Number(v))) continue;
        const num = Number(v);
        content[`ADC${i}`] = num;
        if (i < ADC_LABEL_ORDER.length) content[ADC_LABEL_ORDER[i]] = num;
      }
    }
    for (const name of ADC_LABEL_ORDER) {
      const v = flat[name] ?? flat[name.toLowerCase()] ?? flat[name.toUpperCase()];
      if (v !== null && v !== undefined && !Number.isNaN(Number(v))) content[name] = Number(v);
    }
    for (let i = 0; i < 32; i += 1) {
      const v = flat[`adc${i}`] ?? flat[`ADC${i}`] ?? null;
      if (v !== null && v !== undefined && !Number.isNaN(Number(v))) content[`ADC${i}`] = Number(v);
    }
    for (let i = 0; i < ADC_LABEL_ORDER.length; i += 1) {
      const k = `ADC${i}`;
      if (content[k] != null && (content[ADC_LABEL_ORDER[i]] == null || content[ADC_LABEL_ORDER[i]] === undefined)) {
        content[ADC_LABEL_ORDER[i]] = content[k];
      }
    }
    if (adcArr && adcArr.length) {
      content.adc = adcArr.map((x) => Number(x)).filter((n) => !Number.isNaN(n));
    } else {
      const rebuilt = [];
      for (let i = 0; i < 32; i += 1) {
        if (!Object.prototype.hasOwnProperty.call(content, `ADC${i}`)) break;
        rebuilt.push(content[`ADC${i}`]);
      }
      if (rebuilt.length) content.adc = rebuilt;
    }
    if (flat.timestamp != null && !Number.isNaN(Number(flat.timestamp))) {
      content.firmware_timestamp = Math.floor(Number(flat.timestamp));
    }
    return content;
  }

  async function markSensorSample(deviceId) {
    try {
      const active = await EnoseMeasurementData.findOne({
        device_id: deviceId,
        status: { $in: ["started", "in_progress"] },
      }).sort({ started_at: -1 });
      if (!active) return;
      active.status = active.status === "started" ? "in_progress" : active.status;
      active.samples_count = Number(active.samples_count || 0) + 1;
      active.progress = Number(active.progress || 0);
      await active.save();
    } catch (err) {
      console.warn("[report-demo] measurement sample count:", err.message);
    }
  }
  async function storeSensorPayload(topic, payload) {
    const storeTopic = canonicalSensorMqttTopic(topic);
    await DataSensor.create({
      topic: storeTopic,
      time: Math.floor(Date.now() / 1000),
      content: buildSensorContent(payload),
    }).catch((e) => console.warn("[report-demo] DataSensor.create:", e.message));
    await markSensorSample(extractDeviceId(storeTopic));
  }
  const uniqueClientId = `${config.mqtt.clientId}_${process.pid}`;

  const client = mqtt.connect(normalizeMqttUrl(config.mqtt.broker), {
    port: config.mqtt.port,
    username: config.mqtt.username || undefined,
    password: config.mqtt.password || undefined,
    clientId: uniqueClientId,
    reconnectPeriod: 2000,
  });

  client.on("connect", () => {
    console.log("[report-demo] MQTT connected as", uniqueClientId);
    client.subscribe([
      "electric-nose/device/+/status",
      "electric-nose/device/+/sensor",
      "electric-nose/device/+/Sensor",
      "electric-nose/device/+/sensor-data",
      "electric-nose/+/sensor-data",
      "electric-nose/device/+/measurement/data",
    ]);
  });

  client.on("reconnect", () => {
    console.log("[report-demo] MQTT reconnecting...");
  });

  client.on("error", (err) => {
    console.warn("[report-demo] MQTT error:", err.message);
  });

  client.on("message", async (topic, messageBuf) => {
    let payload;
    try {
      payload = JSON.parse(messageBuf.toString());
    } catch {
      return;
    }
    const deviceId = extractDeviceId(topic);
    if (!deviceId || deviceId === "unknown") return;

    if (/\/status$/i.test(topic)) {
      await EnoseDeviceStatus.create({
        device_id: deviceId,
        status: payload.status || "online",
        wifi_ssid: payload.wifi_ssid || null,
        wifi_signal: payload.wifi_signal ?? null,
        wifi_status: payload.wifi_status || (payload.wifi_ssid ? "connected" : "disconnected"),
        wifi_ip: payload.wifi_ip || null,
        storage: payload.storage || { total: 0, used: 0, free: 0 },
        heating_enabled: !!payload.heating_enabled,
        air_pump_enabled: !!payload.air_pump_enabled,
        wifi_enabled: payload.wifi_enabled !== false,
        last_seen: new Date(),
        timestamp: new Date(),
      }).catch(() => {});
      await upsertDeviceRow(deviceId, payload.status || "online");
    }

    if (/(\/sensor|\/sensor-data)$/i.test(topic)) {
      const payloadRoot =
        payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)
          ? { ...payload.data, ...payload }
          : payload;
      const nested =
        payloadRoot.content && typeof payloadRoot.content === "object" && !Array.isArray(payloadRoot.content)
          ? payloadRoot.content
          : {};
      /** Gá»™p object lá»“ng nhau: firmware Ä‘Ã´i khi gá»­i toÃ n bá»™ cáº£m biáº¿n trong `content`. */
      const flat = { ...nested, ...payloadRoot };
      const content = {
        Temperature: flat.temperature ?? flat.Temperature ?? null,
        Humidity: flat.humidity ?? flat.Humidity ?? null,
      };
      const ADC_LABEL_ORDER = ["EtOH1", "EtOH2", "EtOH3", "EtOH4", "EtOH5", "EtOH6", "VOC1", "VOC2"];
      function firstAdcArray(p) {
        const cands = [p.adc, p.values, p.readings, p.sensor_adc, p.sensorValues, p.adc_values, p.AD, p.mems];
        for (const a of cands) {
          const arr = toAdcArray(a);
          if (arr) return arr;
        }
        return null;
      }
      const adcArr = firstAdcArray(flat);
      if (adcArr) {
        for (let i = 0; i < adcArr.length && i < 32; i += 1) {
          const v = adcArr[i];
          if (v === null || v === undefined || Number.isNaN(Number(v))) continue;
          const num = Number(v);
          content[`ADC${i}`] = num;
          if (i < ADC_LABEL_ORDER.length) content[ADC_LABEL_ORDER[i]] = num;
        }
      }
      for (const name of ADC_LABEL_ORDER) {
        const v = flat[name] ?? flat[name.toLowerCase()] ?? flat[name.toUpperCase()];
        if (v !== null && v !== undefined && !Number.isNaN(Number(v))) content[name] = Number(v);
      }
      for (let i = 0; i < 32; i += 1) {
        const v = flat[`adc${i}`] ?? flat[`ADC${i}`] ?? null;
        if (v !== null && v !== undefined && !Number.isNaN(Number(v))) content[`ADC${i}`] = Number(v);
      }
      /* Chá»‰ cÃ³ ADC0â€¦ADC7 mÃ  khÃ´ng cÃ³ máº£ng adc / khÃ³a EtOH â€” gÃ¡n nhÃ£n chuáº©n Ä‘á»ƒ CSV & dashboard Ä‘á»c Ä‘Æ°á»£c. */
      for (let i = 0; i < ADC_LABEL_ORDER.length; i += 1) {
        const k = `ADC${i}`;
        if (content[k] != null && (content[ADC_LABEL_ORDER[i]] == null || content[ADC_LABEL_ORDER[i]] === undefined)) {
          content[ADC_LABEL_ORDER[i]] = content[k];
        }
      }
      if (adcArr && adcArr.length) {
        content.adc = adcArr.map((x) => Number(x)).filter((n) => !Number.isNaN(n));
      } else {
        const rebuilt = [];
        for (let i = 0; i < 32; i += 1) {
          if (!Object.prototype.hasOwnProperty.call(content, `ADC${i}`)) break;
          rebuilt.push(content[`ADC${i}`]);
        }
        if (rebuilt.length) content.adc = rebuilt;
      }
      const nowTs = Math.floor(Date.now() / 1000);
      if (flat.timestamp != null && !Number.isNaN(Number(flat.timestamp))) {
        content.firmware_timestamp = Math.floor(Number(flat.timestamp));
      }
      /* time = thá»i Ä‘iá»ƒm mÃ¡y chá»§ nháº­n MQTT: sort/limit 120 khá»›p thá»© tá»± thá»±c táº¿.
         Náº¿u dÃ¹ng timestamp firmware cá»‘ Ä‘á»‹nh/lá»‡ch, báº£n cÃ³ adc bá»‹ chÃ¬m dÆ°á»›i báº£n chá»‰ temp/hum. */
      const storeTopic = canonicalSensorMqttTopic(topic);
      await DataSensor.create({
        topic: storeTopic,
        time: nowTs,
        content,
      }).catch((e) => console.warn("[report-demo] DataSensor.create:", e.message));
      await markSensorSample(deviceId);
    }

    if (/\/measurement\/data$/i.test(topic)) {
      const active = await EnoseMeasurementData.findOne({
        device_id: deviceId,
        status: { $in: ["started", "in_progress"] },
      })
        .sort({ started_at: -1 })
        .catch(() => null);

      if (active) {
        if (payload.status) active.status = payload.status;
        if (payload.progress !== undefined) active.progress = Number(payload.progress);
        if (payload.samples_count !== undefined) active.samples_count = Number(payload.samples_count);
        if (payload.status === "completed" || payload.status === "failed" || payload.status === "stopped") {
          active.completed_at = new Date();
        }
        await active.save().catch(() => {});
      }

      if (hasSensorFields(payload)) {
        await storeSensorPayload(`electric-nose/device/${deviceId}/sensor`, payload);
      }
    }
  });

  return client;
}

module.exports = { createMqttBridge };




