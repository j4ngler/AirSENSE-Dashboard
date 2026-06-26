import { useQuery } from '@tanstack/react-query';
import { Text } from 'react-native';

import { ADC_COLORS, ADC_LABELS, HUMIDITY_COLOR, TEMP_COLOR } from '@/constants/airsense';
import { LineChart } from '@/components/line-chart';
import { ActionButton, EmptyState, InlineError, LoadingBlock, Page, Section } from '@/components/ui';
import { fetchHistory, fetchLatest, userMessageFromError } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import { readAdcValue, readHumidity, readTemperature, sensorTimestamp } from '@/lib/sensor';
import type { SensorDoc } from '@/lib/types';
import { useAppSettings } from '@/providers/settings-provider';

function sensorKey(point: SensorDoc): string {
  return `${point.topic ?? ''}-${point.time ?? point.createdAt ?? point.updatedAt ?? ''}`;
}

function mergeLatest(points: SensorDoc[], latest: SensorDoc | null | undefined): SensorDoc[] {
  if (!latest) return points;
  const key = sensorKey(latest);
  if (points.some((point) => sensorKey(point) === key)) return points;
  return [latest, ...points];
}

export default function ChartsScreen() {
  const { effectiveBaseUrl, isReady, settings } = useAppSettings();
  const selectedDevice = settings.selectedDevice;

  const latestQuery = useQuery({
    enabled: Boolean(effectiveBaseUrl && selectedDevice),
    queryFn: () => fetchLatest(settings, effectiveBaseUrl, selectedDevice),
    queryKey: ['latest-for-charts', effectiveBaseUrl, settings.apiKey, selectedDevice],
    refetchInterval: Math.min(settings.refreshMs, 1000),
  });

  const historyQuery = useQuery({
    enabled: Boolean(effectiveBaseUrl && selectedDevice),
    queryFn: async () => {
      const last24h = await fetchHistory(settings, effectiveBaseUrl, selectedDevice, {
        from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        limit: 120,
      });
      if (last24h.length) return last24h;
      return fetchHistory(settings, effectiveBaseUrl, selectedDevice, { limit: 120 });
    },
    queryKey: ['history-chart', effectiveBaseUrl, settings.apiKey, selectedDevice],
    refetchInterval: Math.min(settings.refreshMs, 1000),
  });

  if (!isReady) return <LoadingBlock label="Preparing charts..." />;

  if (!effectiveBaseUrl) {
    return (
      <Page>
        <EmptyState message="Set the server URL in Settings before loading charts." title="Server URL required" />
      </Page>
    );
  }

  if (!selectedDevice) {
    return (
      <Page>
        <EmptyState message="Choose a device on the Dashboard tab first." title="Device required" />
      </Page>
    );
  }

  const rawPoints = mergeLatest(historyQuery.data ?? [], latestQuery.data);
  const points = [...rawPoints].reverse();
  const labels = points.map((point) => formatDateTime(sensorTimestamp(point), '--'));
  const tempSeries = points.map((point) => readTemperature(point)).filter((value): value is number => value !== null);
  const humiditySeries = points.map((point) => readHumidity(point)).filter((value): value is number => value !== null);
  const adcSeries = ADC_LABELS.map((label, index) => ({
    color: ADC_COLORS[index],
    label,
    values: points.map((point) => readAdcValue(point, index, label)).filter((value): value is number => value !== null),
  }));
  const hasEnvironmentValues = tempSeries.length > 0 || humiditySeries.length > 0;
  const hasAdcValues = adcSeries.some((series) => series.values.length > 0);

  return (
    <Page>
      <Section subtitle="Uses last 24 hours first, then falls back to the newest 120 samples." title="Trend charts">
        <Text style={{ color: '#475569' }}>Device: {selectedDevice}</Text>
        <Text style={{ color: '#475569' }}>Samples loaded: {points.length}</Text>
        <InlineError message={historyQuery.error || latestQuery.error ? userMessageFromError(historyQuery.error ?? latestQuery.error) : null} />
        <ActionButton
          label="Refresh now"
          onPress={() => {
            void latestQuery.refetch();
            void historyQuery.refetch();
          }}
          secondary
        />
      </Section>

      {(historyQuery.isLoading || latestQuery.isLoading) && !rawPoints.length ? <LoadingBlock label="Loading chart data..." /> : null}

      <Section subtitle="Temperature and humidity parsed from Mongo sensor payloads." title="Environment">
        {hasEnvironmentValues ? (
          <LineChart
            labels={labels}
            scaleEach
            series={[
              { color: TEMP_COLOR, label: 'Temperature', values: tempSeries },
              { color: HUMIDITY_COLOR, label: 'Humidity', values: humiditySeries },
            ]}
          />
        ) : (
          <EmptyState
            message={points.length ? 'Sensor samples exist, but no temperature/humidity fields were parsed.' : 'No sensor samples were returned for this device yet.'}
            title="No environment data"
          />
        )}
      </Section>

      <Section subtitle="Eight ADC traces mapped from Mongo sensor payloads." title="ADC">
        {hasAdcValues ? (
          <LineChart labels={labels} scaleEach series={adcSeries} />
        ) : (
          <EmptyState
            message={points.length ? 'Sensor samples exist, but no ADC fields were parsed.' : 'No ADC samples were returned for this device yet.'}
            title="No ADC data"
          />
        )}
      </Section>
    </Page>
  );
}
