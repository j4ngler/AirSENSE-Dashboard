export function formatNumber(value: number | null | undefined, digits = 1, fallback = '--'): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return value.toFixed(digits);
}

export function formatInteger(value: number | null | undefined, fallback = '--'): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return value.toFixed(0);
}

export function formatDateTime(value: string | Date | null | undefined, fallback = '--'): string {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.valueOf())) return fallback;
  return date.toLocaleString();
}

