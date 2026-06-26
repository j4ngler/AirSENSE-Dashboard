import { ADC_LABELS } from '@/constants/airsense';
import type { SensorDoc } from '@/lib/types';

function readNumber(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function parseArray(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (isRecord(raw)) {
    return Object.keys(raw)
      .sort((left, right) => Number(left.replace(/\D/g, '')) - Number(right.replace(/\D/g, '')))
      .map((key) => raw[key]);
  }
  return [];
}

function sensorContent(doc: SensorDoc | null | undefined): Record<string, unknown> | null {
  if (!doc) return null;
  const root = doc as unknown as Record<string, unknown>;
  const content = isRecord(root.content) ? root.content : {};
  const data = isRecord(root.data) ? root.data : {};
  const nested = isRecord(content.data) ? content.data : {};
  const nestedContent = isRecord(data.content) ? data.content : {};
  return { ...root, ...data, ...content, ...nestedContent, ...nested };
}

export function readNamedSensor(content: Record<string, unknown> | null | undefined, name: string): number | null {
  if (!content) return null;
  const direct = readNumber(content[name]);
  if (direct !== null) return direct;
  const lowered = name.toLowerCase();
  for (const key of Object.keys(content)) {
    if (key.toLowerCase() === lowered) {
      return readNumber(content[key]);
    }
  }
  return null;
}

function firstAdcArray(content: Record<string, unknown>): number[] {
  const candidates = [
    content.adc,
    content.values,
    content.readings,
    content.sensor_adc,
    content.sensorValues,
    content.adc_values,
    content.AD,
    content.mems,
    content.sensors,
  ];
  for (const raw of candidates) {
    const values = parseArray(raw).map((value) => readNumber(value)).filter((value): value is number => value !== null);
    if (values.length) return values;
  }
  return [];
}

export function adcArray(doc: SensorDoc | null | undefined): number[] {
  const content = sensorContent(doc);
  if (!content) return [];
  const direct = firstAdcArray(content);
  if (direct.length) return direct;

  const rebuilt: number[] = [];
  for (let index = 0; index < 32; index += 1) {
    const value = readNumber(content[`ADC${index}`]) ?? readNumber(content[`adc${index}`]);
    if (value === null) break;
    rebuilt.push(value);
  }
  return rebuilt;
}

export function readAdcValue(doc: SensorDoc | null | undefined, index: number, label?: string): number | null {
  const content = sensorContent(doc);
  if (!content) return null;
  if (label) {
    const named = readNamedSensor(content, label);
    if (named !== null) return named;
  }
  const values = adcArray(doc);
  if (typeof values[index] === 'number') return values[index];
  const direct = readNumber(content[`ADC${index}`]);
  if (direct !== null) return direct;
  return readNumber(content[`adc${index}`]);
}

export function readTemperature(doc: SensorDoc | null | undefined): number | null {
  const content = sensorContent(doc);
  return (
    readNamedSensor(content, 'Temperature') ??
    readNamedSensor(content, 'temperature') ??
    readNamedSensor(content, 'temp') ??
    readNamedSensor(content, 't')
  );
}

export function readHumidity(doc: SensorDoc | null | undefined): number | null {
  const content = sensorContent(doc);
  return readNamedSensor(content, 'Humidity') ?? readNamedSensor(content, 'humidity') ?? readNamedSensor(content, 'hum') ?? readNamedSensor(content, 'h');
}

export function sensorTimestamp(doc: SensorDoc | null | undefined): Date | null {
  if (!doc) return null;
  const root = doc as unknown as Record<string, unknown>;
  const content = sensorContent(doc);
  const time = readNumber(root.time) ?? readNumber(content?.time) ?? readNumber(content?.timestamp);
  if (time !== null) return new Date(time > 2_000_000_000 ? time : time * 1000);
  const fallback = doc.createdAt ?? doc.updatedAt;
  if (!fallback) return null;
  const parsed = new Date(fallback);
  return Number.isNaN(parsed.valueOf()) ? null : parsed;
}

export function summarizeAdc(doc: SensorDoc | null | undefined): string {
  if (!doc) return '--';
  const values = ADC_LABELS.map((label, index) => readAdcValue(doc, index, label)).filter((value): value is number => value !== null);
  if (!values.length) return '--';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return `min ${min.toFixed(0)} / avg ${avg.toFixed(0)} / max ${max.toFixed(0)}`;
}
