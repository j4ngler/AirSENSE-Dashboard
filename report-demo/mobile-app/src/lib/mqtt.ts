import mqtt, { MqttClient } from 'mqtt';

let client: MqttClient | null = null;

const BROKER_URL = process.env.EXPO_PUBLIC_MQTT_BROKER_URL ?? 'ws://localhost:8083/mqtt';
const MQTT_USERNAME = process.env.EXPO_PUBLIC_MQTT_USERNAME ?? '';
const MQTT_PASSWORD = process.env.EXPO_PUBLIC_MQTT_PASSWORD ?? '';

/**
 * Khởi tạo kết nối MQTT sau khi đăng nhập.
 * Sử dụng token làm password để xác thực với broker.
 */
export function initMqtt(token: string, deviceId: string): void {
  if (client?.connected) {
    console.log('[MQTT] Đã kết nối rồi, bỏ qua.');
    return;
  }

  console.log(`[MQTT] Đang kết nối tới ${BROKER_URL} ...`);

  client = mqtt.connect(BROKER_URL, {
    username: MQTT_USERNAME || deviceId,
    password: MQTT_PASSWORD || token,
    clientId: `airsense_app_${deviceId}_${Date.now()}`,
    reconnectPeriod: 3000,
    connectTimeout: 10_000,
  });

  client.on('connect', () => {
    console.log('[MQTT] Kết nối thành công!');
    // Subscribe vào topic của thiết bị
    client?.subscribe(`electric-nose/device/${deviceId}/#`, (err) => {
      if (err) console.error('[MQTT] Subscribe lỗi:', err.message);
      else console.log(`[MQTT] Đã subscribe: electric-nose/device/${deviceId}/#`);
    });
  });

  client.on('error', (err) => {
    console.error('[MQTT] Lỗi:', err.message);
  });

  client.on('reconnect', () => {
    console.log('[MQTT] Đang kết nối lại...');
  });

  client.on('offline', () => {
    console.log('[MQTT] Mất kết nối, đang chờ reconnect...');
  });
}

/**
 * Publish một message lên topic MQTT.
 */
export function publishMqtt(topic: string, payload: string | Buffer): void {
  if (!client?.connected) {
    console.warn('[MQTT] Chưa kết nối, không thể publish.');
    return;
  }
  client.publish(topic, payload, (err) => {
    if (err) console.error('[MQTT] Publish lỗi:', err.message);
  });
}

/**
 * Subscribe vào một topic tùy chỉnh.
 */
export function subscribeMqtt(topic: string, handler: (topic: string, message: Buffer) => void): void {
  if (!client) {
    console.warn('[MQTT] Chưa khởi tạo client.');
    return;
  }
  client.subscribe(topic, (err) => {
    if (err) console.error(`[MQTT] Subscribe "${topic}" lỗi:`, err.message);
  });
  client.on('message', (t, msg) => {
    if (t === topic) handler(t, msg);
  });
}

/**
 * Ngắt kết nối MQTT khi đăng xuất.
 */
export function disconnectMqtt(): void {
  if (client) {
    client.end(true, () => {
      console.log('[MQTT] Đã ngắt kết nối.');
    });
    client = null;
  }
}

/** Kiểm tra trạng thái kết nối */
export function isMqttConnected(): boolean {
  return client?.connected ?? false;
}
