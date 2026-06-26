import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ADC_COLORS, ADC_LABELS, DANGER_COLOR, HUMIDITY_COLOR, SUCCESS_COLOR, TEMP_COLOR, WIFI_COLOR } from '@/constants/airsense';
import { ActionButton, DevicePicker, EmptyState, InlineError, LoadingBlock, Page, Section, StatCard, SwitchRow } from '@/components/ui';
import {
  fetchActiveMeasurement,
  fetchControlStatus,
  fetchDevices,
  fetchHistory,
  fetchLatest,
  fetchStatus,
  setAirPump,
  setHeating,
  startMeasurement,
  stopMeasurement,
  userMessageFromError,
} from '@/lib/api';
import { formatDateTime, formatInteger, formatNumber } from '@/lib/format';
import { adcArray, readAdcValue, readHumidity, readTemperature } from '@/lib/sensor';
import { useAppSettings } from '@/providers/settings-provider';

type PendingSwitch = { until: number; value: boolean } | null;

function resolvePending(pending: PendingSwitch, serverValue: boolean | null | undefined): boolean {
  if (!pending) return Boolean(serverValue);
  if (Date.now() > pending.until) return Boolean(serverValue);
  if (serverValue === pending.value) return Boolean(serverValue);
  return pending.value;
}

export default function DashboardScreen() {
  const queryClient = useQueryClient();
  const { effectiveBaseUrl, isReady, settings, updateSettings } = useAppSettings();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [heatingPending, setHeatingPending] = useState<PendingSwitch>(null);
  const [pumpPending, setPumpPending] = useState<PendingSwitch>(null);

  const devicesQuery = useQuery({
    enabled: Boolean(effectiveBaseUrl),
    queryFn: () => fetchDevices(settings, effectiveBaseUrl),
    queryKey: ['devices', effectiveBaseUrl, settings.apiKey],
    refetchInterval: settings.refreshMs,
  });

  const devices = devicesQuery.data ?? [];
  const selectedDevice = devices.some((device) => device.deviceCode === settings.selectedDevice)
    ? settings.selectedDevice
    : devices[0]?.deviceCode || '';

  useEffect(() => {
    if (selectedDevice && settings.selectedDevice !== selectedDevice) {
      void updateSettings({ selectedDevice });
    }
  }, [selectedDevice, settings.selectedDevice, updateSettings]);

  const [latestQuery, latestFallbackQuery, statusQuery, activeQuery, controlQuery] = useQueries({
    queries: [
      {
        enabled: Boolean(effectiveBaseUrl && selectedDevice),
        queryFn: () => fetchLatest(settings, effectiveBaseUrl, selectedDevice),
        queryKey: ['latest', effectiveBaseUrl, settings.apiKey, selectedDevice],
        refetchInterval: Math.min(settings.refreshMs, 1000),
      },
      {
        enabled: Boolean(effectiveBaseUrl && selectedDevice),
        queryFn: () => fetchHistory(settings, effectiveBaseUrl, selectedDevice, { limit: 1 }),
        queryKey: ['latest-history-fallback', effectiveBaseUrl, settings.apiKey, selectedDevice],
        refetchInterval: Math.min(settings.refreshMs, 1000),
      },
      {
        enabled: Boolean(effectiveBaseUrl && selectedDevice),
        queryFn: () => fetchStatus(settings, effectiveBaseUrl, selectedDevice),
        queryKey: ['status', effectiveBaseUrl, settings.apiKey, selectedDevice],
        refetchInterval: settings.refreshMs,
      },
      {
        enabled: Boolean(effectiveBaseUrl && selectedDevice),
        queryFn: () => fetchActiveMeasurement(settings, effectiveBaseUrl, selectedDevice),
        queryKey: ['active', effectiveBaseUrl, settings.apiKey, selectedDevice],
        refetchInterval: settings.refreshMs,
      },
      {
        enabled: Boolean(effectiveBaseUrl),
        queryFn: () => fetchControlStatus(settings, effectiveBaseUrl),
        queryKey: ['control-status', effectiveBaseUrl, settings.apiKey],
        refetchInterval: settings.refreshMs,
      },
    ],
  });

  const refreshAll = async () => {
    setErrorMessage(null);
    try {
      await Promise.all([
        devicesQuery.refetch(),
        latestQuery.refetch(),
        latestFallbackQuery.refetch(),
        statusQuery.refetch(),
        activeQuery.refetch(),
        controlQuery.refetch(),
      ]);
    } catch (error) {
      setErrorMessage(userMessageFromError(error));
    }
  };

  const startMutation = useMutation({
    mutationFn: () => startMeasurement(settings, effectiveBaseUrl, selectedDevice),
    onError: (error) => {
      setActionMessage(null);
      setErrorMessage(userMessageFromError(error));
    },
    onMutate: () => {
      setErrorMessage(null);
      setActionMessage('Sending start command...');
    },
    onSuccess: async (result) => {
      setActionMessage(
        result.mqttConnected === false
          ? 'Start saved, but MQTT is disconnected so the ESP may not receive the command.'
          : `Start command sent${result.fileName ? `: ${result.fileName}` : ''}`,
      );
      await refreshAll();
    },
  });

  const stopMutation = useMutation({
    mutationFn: () => stopMeasurement(settings, effectiveBaseUrl, selectedDevice),
    onError: (error) => {
      setActionMessage(null);
      setErrorMessage(userMessageFromError(error));
    },
    onMutate: () => {
      setErrorMessage(null);
      setActionMessage('Sending stop command...');
    },
    onSuccess: async () => {
      setActionMessage('Stop command sent.');
      await refreshAll();
    },
  });

  const heatingMutation = useMutation({
    mutationFn: (on: boolean) => setHeating(settings, effectiveBaseUrl, selectedDevice, on),
    onError: (error) => {
      setHeatingPending(null);
      setErrorMessage(userMessageFromError(error));
    },
    onSuccess: async () => {
      await statusQuery.refetch();
    },
  });

  const pumpMutation = useMutation({
    mutationFn: (on: boolean) => setAirPump(settings, effectiveBaseUrl, selectedDevice, on),
    onError: (error) => {
      setPumpPending(null);
      setErrorMessage(userMessageFromError(error));
    },
    onSuccess: async () => {
      await statusQuery.refetch();
    },
  });

  const latest = latestQuery.data ?? latestFallbackQuery.data?.[0] ?? null;
  const status = statusQuery.data;
  const active = activeQuery.data;
  const control = controlQuery.data;
  const currentAdcArray = adcArray(latest);
  const latestHasValues = readTemperature(latest) !== null || readHumidity(latest) !== null || currentAdcArray.length > 0;
  const displayedHeating = resolvePending(heatingPending, status?.heatingEnabled);
  const displayedPump = resolvePending(pumpPending, status?.airPumpEnabled);

  useEffect(() => {
    if (heatingPending && status?.heatingEnabled === heatingPending.value) {
      setHeatingPending(null);
    }
  }, [heatingPending, status?.heatingEnabled]);

  useEffect(() => {
    if (pumpPending && status?.airPumpEnabled === pumpPending.value) {
      setPumpPending(null);
    }
  }, [pumpPending, status?.airPumpEnabled]);

  if (!isReady) {
    return <LoadingBlock label="Loading saved settings..." />;
  }

  if (!effectiveBaseUrl) {
    return (
      <Page>
        <EmptyState message="Set the server URL in the Settings tab before loading AirSENSE data." title="Server URL required" />
      </Page>
    );
  }

  if (devicesQuery.isLoading && !devicesQuery.data) {
    return <LoadingBlock label="Loading devices..." />;
  }

  if (devicesQuery.isError) {
    return (
      <Page>
        <Section subtitle="Failed to fetch devices from the server." title="Connection Error">
          <EmptyState message={userMessageFromError(devicesQuery.error)} title="Error fetching devices" />
        </Section>
      </Page>
    );
  }

  if (!selectedDevice) {
    return (
      <Page>
        <Section subtitle="The API responded but there are no active devices in SQL." title="No devices">
          <EmptyState message={`Raw data: ${JSON.stringify(devicesQuery.data)}`} title="No active device rows" />
        </Section>
      </Page>
    );
  }

  return (
    <Page>
      <Section subtitle="Realtime monitoring and control" title="AirSENSE dashboard">
        <DevicePicker
          currentLabel={selectedDevice}
          items={(devicesQuery.data ?? []).map((device) => ({
            label: `${device.deviceCode}${device.status ? `  ${device.status}` : ''}`,
            value: device.deviceCode,
          }))}
          onSelect={(value) => {
            setErrorMessage(null);
            void updateSettings({ selectedDevice: value });
            void queryClient.invalidateQueries({ queryKey: ['latest'] });
          }}
          title="Selected device"
        />
        {(errorMessage || devicesQuery.error || latestQuery.error || statusQuery.error) && (
          <InlineError message={errorMessage ?? userMessageFromError(devicesQuery.error ?? latestQuery.error ?? statusQuery.error)} />
        )}
        {actionMessage ? <Text style={styles.actionMessage}>{actionMessage}</Text> : null}
        {!latestHasValues ? (
          <InlineError message="No sensor values returned yet for this device. Check backend /latest or MQTT sensor topic." />
        ) : (
          <Text style={styles.actionMessage}>Latest sample: {formatDateTime(latest?.createdAt ?? latest?.updatedAt ?? null, '--')}</Text>
        )}
        <View style={styles.statsRow}>
          <StatCard accentColor={TEMP_COLOR} label="Temperature" unit="C" value={formatNumber(readTemperature(latest), 1)} />
          <StatCard accentColor={HUMIDITY_COLOR} label="Humidity" unit="%" value={formatNumber(readHumidity(latest), 1)} />
          <StatCard accentColor={WIFI_COLOR} label="Wi-Fi" unit="dBm" value={formatInteger(status?.wifiSignal)} />
        </View>
        <View style={styles.buttonRow}>
          <ActionButton
            disabled={startMutation.isPending || active?.active === true || !selectedDevice}
            label={startMutation.isPending ? 'Starting...' : 'Start measurement'}
            onPress={() => startMutation.mutate()}
          />
          <ActionButton
            danger
            disabled={stopMutation.isPending || active?.active !== true || !selectedDevice}
            label={stopMutation.isPending ? 'Stopping...' : 'Stop measurement'}
            onPress={() => stopMutation.mutate()}
          />
        </View>
        <SwitchRow
          label="Heating"
          onValueChange={(value) => {
            setHeatingPending({ until: Date.now() + 25_000, value });
            heatingMutation.mutate(value);
          }}
          subtitle={status?.lastSeen ? `Last seen ${formatDateTime(status.lastSeen)}` : 'Optimistic for up to 25 seconds.'}
          value={displayedHeating}
        />
        <SwitchRow
          label="Air pump"
          onValueChange={(value) => {
            setPumpPending({ until: Date.now() + 25_000, value });
            pumpMutation.mutate(value);
          }}
          subtitle={status?.wifiIp ? `Device IP ${status.wifiIp}` : 'Optimistic for up to 25 seconds.'}
          value={displayedPump}
        />
        <View style={styles.buttonRow}>
          <ActionButton label="Refresh now" onPress={() => void refreshAll()} secondary />
        </View>
      </Section>

      <Section subtitle="Latest values mapped from SQL sensor channels and raw ADC fields" title="ADC channels">
        <View style={styles.adcGrid}>
          {ADC_LABELS.map((label, index) => {
            const value = readAdcValue(latest, index, label) ?? currentAdcArray[index] ?? null;
            return (
              <View key={label} style={[styles.adcCard, { borderColor: ADC_COLORS[index] }]}>
                <Text style={styles.adcLabel}>{label}</Text>
                <Text style={[styles.adcValue, { color: ADC_COLORS[index] }]}>{formatInteger(value)}</Text>
                <Text style={styles.adcMeta}>ADC{index}</Text>
              </View>
            );
          })}
        </View>
      </Section>

      <Section subtitle="Server-side status across all devices" title="Control summary">
        <View style={styles.statsRow}>
          <StatCard accentColor="#0f172a" label="Total" unit="devices" value={String(control?.total ?? '--')} />
          <StatCard accentColor={SUCCESS_COLOR} label="Online" unit="devices" value={String(control?.online ?? '--')} />
          <StatCard accentColor={DANGER_COLOR} label="Offline" unit="devices" value={String(control?.offline ?? '--')} />
          <StatCard accentColor="#475569" label="Commands" unit="/ hr" value={String(control?.recent ?? '--')} />
        </View>
      </Section>

      <Section subtitle="Current server-side measurement session" title="Measurement state">
        {active?.measurement ? (
          <View style={styles.measurementCard}>
            <Text style={styles.measurementTitle}>{active.measurement.fileName ?? 'Unnamed session'}</Text>
            <Text style={styles.measurementMeta}>Status: {active.measurement.status ?? '--'}</Text>
            <Text style={styles.measurementMeta}>Samples: {active.measurement.samplesCount ?? 0}</Text>
            <Text style={styles.measurementMeta}>Started: {formatDateTime(active.measurement.startedAt)}</Text>
          </View>
        ) : (
          <EmptyState message="There is no running measurement on the selected device." title="Idle" />
        )}
      </Section>
    </Page>
  );
}

const styles = StyleSheet.create({
  adcCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    gap: 4,
    minWidth: '48%',
    padding: 14,
    width: '48%',
  },
  adcGrid: {
    columnGap: '4%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  adcLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  adcMeta: {
    color: '#64748b',
    fontSize: 12,
  },
  adcValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  actionMessage: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  measurementCard: {
    gap: 4,
  },
  measurementMeta: {
    color: '#334155',
    fontSize: 14,
  },
  measurementTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});


