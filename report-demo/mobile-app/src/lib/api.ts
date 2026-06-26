import * as SecureStore from 'expo-secure-store';
import type {
  ActiveMeasurement,
  AppConfig,
  Channel,
  ChannelCreateInput,
  ChannelUpdateInput,
  ControlStatus,
  Device,
  DeviceStatus,
  HealthStatus,
  Measurement,
  PersistedSettings,
  SensorDoc,
  SuccessResponse,
} from '@/lib/types';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/,'');
}

function buildUrl(baseUrl: string, path: string): string {
  return `${normalizeBaseUrl(baseUrl)}/${path.replace(/^\/+/, '')}`;
}

async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

export async function request<T>(
  settings: Pick<PersistedSettings, 'apiKey'>,
  baseUrl: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  if (!baseUrl) {
    throw new ApiError('Base URL is not configured.');
  }
  const headers = new Headers(init?.headers ?? {});
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (settings.apiKey.trim()) {
    headers.set('X-API-Key', settings.apiKey.trim());
  }
  // ---- Add Authorization header if token exists ----
  const storedToken = await SecureStore.getItemAsync('authToken');
  if (storedToken) {
    headers.set('Authorization', `Bearer ${storedToken}`);
  }
  // ---------------------------------------------------
  let response: Response;
  try {
    response = await fetch(buildUrl(baseUrl, path), { ...init, headers });
  } catch (error) {
    throw new ApiError(error instanceof Error ? error.message : 'Network request failed.');
  }

  let data: Record<string, unknown>;
  try {
    data = await readJson<Record<string, unknown>>(response);
  } catch {
    throw new ApiError('Server did not return valid JSON. Check that the API URL is correct.');
  }

  if (!response.ok) {
    const message = typeof data?.message === 'string' ? data.message : `${response.status} ${response.statusText}`;
    throw new ApiError(message, response.status);
  }
  
  // Unwrap result when the backend wraps the payload.
  if (data && typeof data === 'object' && 'result' in data && typeof data.result === 'object' && data.result !== null) {
    return data.result as T;
  }
  
  return data as T;
}

function mapDevice(input: Record<string, unknown>): Device {
  return {
    deleteFlag: typeof input.delete_flag === 'number' ? input.delete_flag : null,
    deviceCode: String(input.device_code ?? ''),
    deviceId: Number(input.device_id),
    lastSeen: typeof input.last_seen === 'string' ? input.last_seen : null,
    mqttTopic: typeof input.mqtt_topic === 'string' ? input.mqtt_topic : null,
    name: typeof input.name === 'string' ? input.name : null,
    status: typeof input.status === 'string' ? input.status : null,
  };
}

function mapStatus(input: Record<string, unknown> | null | undefined): DeviceStatus | null {
  if (!input) return null;
  return {
    airPumpEnabled: typeof input.air_pump_enabled === 'boolean' ? input.air_pump_enabled : null,
    deviceId: typeof input.device_id === 'string' ? input.device_id : null,
    heatingEnabled: typeof input.heating_enabled === 'boolean' ? input.heating_enabled : null,
    lastSeen: typeof input.last_seen === 'string' ? input.last_seen : null,
    status: typeof input.status === 'string' ? input.status : null,
    storage: (input.storage as DeviceStatus['storage']) ?? null,
    timestamp: typeof input.timestamp === 'string' ? input.timestamp : null,
    wifiIp: typeof input.wifi_ip === 'string' ? input.wifi_ip : null,
    wifiSignal: typeof input.wifi_signal === 'number' ? input.wifi_signal : null,
    wifiSsid: typeof input.wifi_ssid === 'string' ? input.wifi_ssid : null,
    wifiStatus: typeof input.wifi_status === 'string' ? input.wifi_status : null,
  };
}

function mapMeasurement(input: Record<string, unknown> | null | undefined): Measurement | null {
  if (!input) return null;
  return {
    completedAt: typeof input.completed_at === 'string' ? input.completed_at : null,
    createdAt: typeof input.createdAt === 'string' ? input.createdAt : null,
    deviceId: typeof input.device_id === 'string' ? input.device_id : null,
    fileName: typeof input.file_name === 'string' ? input.file_name : null,
    progress: typeof input.progress === 'number' ? input.progress : null,
    samplesCount: typeof input.samples_count === 'number' ? input.samples_count : null,
    startedAt: typeof input.started_at === 'string' ? input.started_at : null,
    status: typeof input.status === 'string' ? input.status : null,
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : null,
  };
}

function mapChannel(input: Record<string, unknown>): Channel {
  return {
    channelIndex: Number(input.channel_index),
    deviceCode: String(input.device_code ?? ''),
    label: String(input.label ?? ''),
    sensorChannelId: Number(input.sensor_channel_id),
    sortOrder: typeof input.sort_order === 'number' ? input.sort_order : null,
    unit: typeof input.unit === 'string' ? input.unit : null,
  };
}

export function userMessageFromError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? '');
  const status = error instanceof ApiError ? error.status : undefined;
  if (/base url/i.test(raw)) return 'Set the server URL in Settings before using the app.';
  if (/device not found/i.test(raw)) return 'The selected device does not exist on the server.';
  if (/Failed to fetch|Network request failed|NetworkError/i.test(raw)) return 'Cannot reach the server. Check Wi-Fi, VPN, or the configured URL.';
  if (status === 400) return 'Invalid input. Check the ADC index, label, unit, and sort order.';
  if (status === 404 || /404/.test(raw)) return 'The requested API endpoint was not found.';
  if (status === 409) return 'This ADC channel already exists for the selected device.';
  if (/enose_sensor_channels/i.test(raw)) return 'Sensor channel table is missing. Run the backend schema init script first.';
  return raw ? raw : '';
}

export async function fetchAppConfig(settings: Pick<PersistedSettings, 'apiKey'>, baseUrl: string): Promise<AppConfig> {
  const data = await request<Record<string, unknown>>(settings, baseUrl, 'config.json');
  return {
    apiBase: typeof data.apiBase === 'string' ? data.apiBase : null,
    measurementFileBaseUrl: typeof data.measurementFileBaseUrl === 'string' ? data.measurementFileBaseUrl : null,
    refreshMs: typeof data.refreshMs === 'number' ? data.refreshMs : null,
    requireApiKey: typeof data.requireApiKey === 'boolean' ? data.requireApiKey : null,
    title: typeof data.title === 'string' ? data.title : null,
  };
}

export async function fetchHealth(settings: Pick<PersistedSettings, 'apiKey'>, baseUrl: string): Promise<HealthStatus> {
  return request<HealthStatus>(settings, baseUrl, 'api/health');
}

export async function fetchDevices(settings: Pick<PersistedSettings, 'apiKey'>, baseUrl: string): Promise<Device[]> {
  const data = await request<{ devices?: Record<string, unknown>[] }>(settings, baseUrl, 'api/enose/devices');
  return (data.devices ?? []).map(mapDevice).filter((device) => device.deleteFlag !== 1);
}

export async function fetchLatest(
  settings: Pick<PersistedSettings, 'apiKey'>,
  baseUrl: string,
  deviceCode: string,
): Promise<SensorDoc | null> {
  const data = await request<{ data?: SensorDoc | null }>(settings, baseUrl, `api/enose/devices/${encodeURIComponent(deviceCode)}/latest`);
  return data.data ?? null;
}

export async function fetchStatus(
  settings: Pick<PersistedSettings, 'apiKey'>,
  baseUrl: string,
  deviceCode: string,
): Promise<DeviceStatus | null> {
  const data = await request<{ data?: Record<string, unknown> | null }>(settings, baseUrl, `api/enose/devices/${encodeURIComponent(deviceCode)}/status`);
  return mapStatus(data.data);
}

export async function fetchHistory(
  settings: Pick<PersistedSettings, 'apiKey'>,
  baseUrl: string,
  deviceCode: string,
  query?: { from?: string; limit?: number; to?: string },
): Promise<SensorDoc[]> {
  const params = new URLSearchParams();
  if (query?.limit) params.set('limit', String(query.limit));
  if (query?.from) params.set('from', query.from);
  if (query?.to) params.set('to', query.to);
  const suffix = params.size ? `?${params.toString()}` : '';
  const data = await request<{ data?: SensorDoc[] }>(
    settings,
    baseUrl,
    `api/enose/devices/${encodeURIComponent(deviceCode)}/history${suffix}`,
  );
  return data.data ?? [];
}

export async function fetchMeasurements(
  settings: Pick<PersistedSettings, 'apiKey'>,
  baseUrl: string,
  deviceCode: string,
): Promise<Measurement[]> {
  const data = await request<{ data?: Record<string, unknown>[] }>(
    settings,
    baseUrl,
    `api/enose/devices/${encodeURIComponent(deviceCode)}/measurements`,
  );
  return (data.data ?? []).map((m) => mapMeasurement(m)).filter((m): m is Measurement => Boolean(m));
}

export async function fetchActiveMeasurement(
  settings: Pick<PersistedSettings, 'apiKey'>,
  baseUrl: string,
  deviceCode: string,
): Promise<ActiveMeasurement> {
  const data = await request<Record<string, unknown>>(settings, baseUrl, `api/enose/devices/measurements/active?device_id=${encodeURIComponent(deviceCode)}`);
  return {
    active: Boolean(data.active),
    canStart: Boolean(data.canStart),
    measurement: mapMeasurement((data.measurement as Record<string, unknown> | null) ?? null),
  };
}

export async function fetchControlStatus(settings: Pick<PersistedSettings, 'apiKey'>, baseUrl: string): Promise<ControlStatus> {
  const data = await request<Record<string, unknown>>(settings, baseUrl, 'api/enose/control/status');
  return {
    offline: typeof data.offline_devices === 'number' ? data.offline_devices : 0,
    online: typeof data.online_devices === 'number' ? data.online_devices : 0,
    recent: typeof data.recent_controls === 'number' ? data.recent_controls : 0,
    timestamp: typeof data.timestamp === 'string' ? data.timestamp : null,
    total: typeof data.total_devices === 'number' ? data.total_devices : 0,
  };
}

export async function startMeasurement(
  settings: Pick<PersistedSettings, 'apiKey'>,
  baseUrl: string,
  deviceCode: string,
): Promise<{ deviceId: string; fileName: string; message: string; mqttConnected: boolean | null; startedAt: string }> {
  const data = await request<Record<string, unknown>>(settings, baseUrl, 'api/enose/control/measurement/start', {
    body: JSON.stringify({ device_id: deviceCode }),
    method: 'POST',
  });
  return {
    deviceId: String(data.device_id ?? deviceCode),
    fileName: String(data.file_name ?? ''),
    message: typeof data.message === 'string' ? data.message : '',
    mqttConnected: typeof data.mqtt_connected === 'boolean' ? data.mqtt_connected : null,
    startedAt: String(data.started_at ?? ''),
  };
}

export async function stopMeasurement(
  settings: Pick<PersistedSettings, 'apiKey'>,
  baseUrl: string,
  deviceCode: string,
): Promise<void> {
  await request(settings, baseUrl, 'api/enose/control/measurement/stop', {
    body: JSON.stringify({ device_id: deviceCode }),
    method: 'POST',
  });
}

export async function setHeating(
  settings: Pick<PersistedSettings, 'apiKey'>,
  baseUrl: string,
  deviceCode: string,
  on: boolean,
): Promise<SuccessResponse> {
  return request<SuccessResponse>(settings, baseUrl, `api/enose/devices/${encodeURIComponent(deviceCode)}/heating`, {
    body: JSON.stringify({ on }),
    method: 'POST',
  });
}

export async function setAirPump(
  settings: Pick<PersistedSettings, 'apiKey'>,
  baseUrl: string,
  deviceCode: string,
  on: boolean,
): Promise<SuccessResponse> {
  return request<SuccessResponse>(settings, baseUrl, `api/enose/devices/${encodeURIComponent(deviceCode)}/air-pump`, {
    body: JSON.stringify({ on }),
    method: 'POST',
  });
}

export async function fetchChannels(
  settings: Pick<PersistedSettings, 'apiKey'>,
  baseUrl: string,
  deviceCode: string,
): Promise<Channel[]> {
  const data = await request<{ channels?: Record<string, unknown>[] }>(
    settings,
    baseUrl,
    `api/enose/devices/${encodeURIComponent(deviceCode)}/sensor-channels`,
  );
  return (data.channels ?? []).map(mapChannel);
}

export async function createChannel(
  settings: Pick<PersistedSettings, 'apiKey'>,
  baseUrl: string,
  deviceCode: string,
  input: ChannelCreateInput,
): Promise<Channel | null> {
  const data = await request<{ channel?: Record<string, unknown> | null }>(
    settings,
    baseUrl,
    `api/enose/devices/${encodeURIComponent(deviceCode)}/sensor-channels`,
    {
      body: JSON.stringify({
        channel_index: input.channelIndex,
        label: input.label,
        sort_order: input.sortOrder ?? 0,
        unit: input.unit ?? 'ADC',
      }),
      method: 'POST',
    },
  );
  return data.channel ? mapChannel(data.channel) : null;
}

export async function updateChannel(
  settings: Pick<PersistedSettings, 'apiKey'>,
  baseUrl: string,
  channelId: number,
  input: ChannelUpdateInput,
): Promise<Channel | null> {
  const data = await request<{ channel?: Record<string, unknown> | null }>(
    settings,
    baseUrl,
    `api/enose/sensor-channels/${channelId}`,
    {
      body: JSON.stringify({
        channel_index: input.channelIndex,
        label: input.label,
        sort_order: input.sortOrder,
        unit: input.unit,
      }),
      method: 'PATCH',
    },
  );
  return data.channel ? mapChannel(data.channel) : null;
}

export async function deleteChannel(
  settings: Pick<PersistedSettings, 'apiKey'>,
  baseUrl: string,
  channelId: number,
): Promise<SuccessResponse> {
  return request<SuccessResponse>(settings, baseUrl, `api/enose/sensor-channels/${channelId}/delete`, {
    body: JSON.stringify({}),
    method: 'POST',
  });
}




