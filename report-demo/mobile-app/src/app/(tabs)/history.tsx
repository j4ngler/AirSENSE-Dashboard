import { useQuery } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton, EmptyState, InlineError, LoadingBlock, Page, Section } from '@/components/ui';
import { fetchHistory, fetchMeasurements, userMessageFromError } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { Measurement } from '@/lib/types';
import { useAppSettings } from '@/providers/settings-provider';

type MeasurementRow = Measurement & {
  resolvedSamplesCount: number;
};

function measurementKey(item: MeasurementRow, index: number): string {
  return `${item.fileName ?? item.startedAt ?? item.createdAt ?? 'measurement'}-${index}`;
}

function endTime(item: Measurement): string | undefined {
  return item.completedAt ?? item.updatedAt ?? undefined;
}

async function resolveSampleCount(
  settings: Parameters<typeof fetchMeasurements>[0],
  baseUrl: string,
  deviceCode: string,
  item: Measurement,
): Promise<number> {
  if ((item.samplesCount ?? 0) > 0) return item.samplesCount ?? 0;
  const from = item.startedAt ?? item.createdAt;
  if (!from) return 0;
  const samples = await fetchHistory(settings, baseUrl, deviceCode, {
    from,
    limit: 1000,
    to: endTime(item),
  });
  return samples.length;
}

function statusLabel(item: MeasurementRow): string {
  const status = item.status ?? '--';
  const progress = item.progress ?? null;
  return progress === null
    ? `${status} | ${item.resolvedSamplesCount} samples`
    : `${status} | ${item.resolvedSamplesCount} samples | ${progress}%`;
}

export default function HistoryScreen() {
  const { effectiveBaseUrl, isReady, settings } = useAppSettings();
  const selectedDevice = settings.selectedDevice;

  const measurementsQuery = useQuery({
    enabled: Boolean(effectiveBaseUrl && selectedDevice),
    queryFn: async () => {
      const measurements = await fetchMeasurements(settings, effectiveBaseUrl, selectedDevice);
      const rows = await Promise.all(
        measurements.map(async (measurement) => ({
          ...measurement,
          resolvedSamplesCount: await resolveSampleCount(settings, effectiveBaseUrl, selectedDevice, measurement),
        })),
      );
      return rows;
    },
    queryKey: ['measurement-history', effectiveBaseUrl, settings.apiKey, selectedDevice],
    refetchInterval: settings.refreshMs,
  });

  if (!isReady) return <LoadingBlock label="Preparing history..." />;

  if (!effectiveBaseUrl) {
    return (
      <Page>
        <EmptyState message="Set the server URL in Settings before loading history." title="Server URL required" />
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

  const measurements = measurementsQuery.data ?? [];

  return (
    <Page>
      <Section subtitle="Real measurement sessions from MongoDB, with sample counts resolved from sensor history." title="Measurement history">
        <Text style={styles.deviceText}>Device: {selectedDevice}</Text>
        <InlineError message={measurementsQuery.error ? userMessageFromError(measurementsQuery.error) : null} />
        <ActionButton label="Reload" onPress={() => void measurementsQuery.refetch()} secondary />
      </Section>

      {measurementsQuery.isLoading && !measurementsQuery.data ? <LoadingBlock label="Loading measurement history..." /> : null}

      <Section subtitle="Each row is one Start/Stop measurement session." title="Sessions">
        {measurements.length ? (
          <View style={styles.list}>
            {measurements.map((item, index) => (
              <View key={measurementKey(item, index)} style={styles.row}>
                <Text style={styles.title}>{item.fileName ?? 'Unnamed session'}</Text>
                <Text style={styles.meta}>Started: {formatDateTime(item.startedAt ?? item.createdAt, '--')}</Text>
                <Text style={styles.meta}>Ended: {formatDateTime(item.completedAt, '--')}</Text>
                <Text style={styles.meta}>{statusLabel(item)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState message="No measurement sessions were returned for this device." title="No measurements" />
        )}
      </Section>
    </Page>
  );
}

const styles = StyleSheet.create({
  deviceText: {
    color: '#475569',
  },
  list: {
    gap: 0,
  },
  meta: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
  row: {
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    gap: 4,
    paddingBottom: 14,
    paddingTop: 8,
  },
  title: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },
});
