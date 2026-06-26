export type Device = {
  deviceId: number;
  deviceCode: string;
  name?: string | null;
  status?: string | null;
  mqttTopic?: string | null;
  lastSeen?: string | null;
  deleteFlag?: number | null;
};

export type AppConfig = {
  title?: string | null;
  apiBase?: string | null;
  refreshMs?: number | null;
  measurementFileBaseUrl?: string | null;
  requireApiKey?: boolean | null;
};

export type HealthStatus = {
  ok: boolean;
  mongo?: string | null;
  pg?: string | null;
  mqtt?: string | null;
  ts?: string | null;
};

export type SensorDoc = {
  topic?: string | null;
  time?: number | null;
  content?: Record<string, unknown> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type DeviceStatus = {
  deviceId?: string | null;
  status?: string | null;
  wifiSsid?: string | null;
  wifiSignal?: number | null;
  wifiStatus?: string | null;
  wifiIp?: string | null;
  storage?: Record<string, unknown> | null;
  heatingEnabled?: boolean | null;
  airPumpEnabled?: boolean | null;
  lastSeen?: string | null;
  timestamp?: string | null;
};

export type Measurement = {
  deviceId?: string | null;
  fileName?: string | null;
  status?: string | null;
  progress?: number | null;
  samplesCount?: number | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ActiveMeasurement = {
  active: boolean;
  measurement?: Measurement | null;
  canStart: boolean;
};

export type ControlStatus = {
  total: number;
  online: number;
  offline: number;
  recent: number;
  timestamp?: string | null;
};

export type SuccessResponse = {
  success: boolean;
  message?: string | null;
};

export type StartResponse = {
  success: boolean;
  fileName?: string | null;
  startedAt?: string | null;
  deviceId?: string | null;
};

export type Channel = {
  sensorChannelId: number;
  deviceCode: string;
  channelIndex: number;
  label: string;
  unit?: string | null;
  sortOrder?: number | null;
};

export type ChannelCreateInput = {
  channelIndex: number;
  label: string;
  unit?: string;
  sortOrder?: number;
};

export type ChannelUpdateInput = {
  label?: string;
  unit?: string;
  sortOrder?: number | null;
  channelIndex?: number | null;
};

export type PersistedSettings = {
  apiKey: string;
  baseUrl: string;
  refreshMs: number;
  selectedDevice: string;
};
