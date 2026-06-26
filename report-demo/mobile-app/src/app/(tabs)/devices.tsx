import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton, EmptyState, Field, InlineError, LoadingBlock, Page, Section } from '@/components/ui';
import { createChannel, deleteChannel, fetchChannels, updateChannel, userMessageFromError } from '@/lib/api';
import type { Channel, ChannelCreateInput, ChannelUpdateInput } from '@/lib/types';
import { useAppSettings } from '@/providers/settings-provider';

function sortChannels(list: Channel[]): Channel[] {
  return [...list].sort((left, right) => {
    const leftSort = left.sortOrder ?? 0;
    const rightSort = right.sortOrder ?? 0;
    if (leftSort !== rightSort) return leftSort - rightSort;
    return left.channelIndex - right.channelIndex;
  });
}

export default function DevicesScreen() {
  const { effectiveBaseUrl, isReady, settings } = useAppSettings();
  const selectedDevice = settings.selectedDevice;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<Channel | null>(null);
  const [addForm, setAddForm] = useState({ channelIndex: '0', label: '', sortOrder: '0', unit: 'ADC' });

  const channelsQuery = useQuery({
    enabled: Boolean(effectiveBaseUrl && selectedDevice),
    queryFn: () => fetchChannels(settings, effectiveBaseUrl, selectedDevice),
    queryKey: ['channels', effectiveBaseUrl, settings.apiKey, selectedDevice],
    refetchInterval: settings.refreshMs,
  });

  const createMutation = useMutation({
    mutationFn: (input: ChannelCreateInput) => createChannel(settings, effectiveBaseUrl, selectedDevice, input),
    onError: (error) => setErrorMessage(userMessageFromError(error)),
    onSuccess: async () => {
      setAddForm({ channelIndex: '0', label: '', sortOrder: '0', unit: 'ADC' });
      await channelsQuery.refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ channelId, input }: { channelId: number; input: ChannelUpdateInput }) =>
      updateChannel(settings, effectiveBaseUrl, channelId, input),
    onError: (error) => setErrorMessage(userMessageFromError(error)),
    onSuccess: async () => {
      setEditing(null);
      await channelsQuery.refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (channelId: number) => deleteChannel(settings, effectiveBaseUrl, channelId),
    onError: (error) => setErrorMessage(userMessageFromError(error)),
    onSuccess: async () => {
      await channelsQuery.refetch();
    },
  });

  if (!isReady) return <LoadingBlock label="Preparing channels..." />;

  if (!effectiveBaseUrl) {
    return (
      <Page>
        <EmptyState message="Set the server URL in Settings before managing channels." title="Server URL required" />
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

  const channels = sortChannels(channelsQuery.data ?? []);

  return (
    <Page>
      <Section subtitle="CRUD for SQL table enose_sensor_channels" title="Sensor channels">
        <Text style={styles.deviceText}>Device: {selectedDevice}</Text>
        <InlineError message={errorMessage ?? (channelsQuery.error ? userMessageFromError(channelsQuery.error) : null)} />
        <ActionButton label="Reload" onPress={() => void channelsQuery.refetch()} secondary />
      </Section>

      <Section subtitle="Create a new ADC mapping row" title="Add channel">
        <Field
          keyboardType="numeric"
          label="ADC index (0..31)"
          onChangeText={(value) => setAddForm((current) => ({ ...current, channelIndex: value.replace(/[^\d]/g, '') }))}
          value={addForm.channelIndex}
        />
        <Field label="Label" onChangeText={(value) => setAddForm((current) => ({ ...current, label: value }))} value={addForm.label} />
        <Field label="Unit" onChangeText={(value) => setAddForm((current) => ({ ...current, unit: value }))} value={addForm.unit} />
        <Field
          keyboardType="numeric"
          label="Sort order"
          onChangeText={(value) => setAddForm((current) => ({ ...current, sortOrder: value.replace(/[^\d-]/g, '') }))}
          value={addForm.sortOrder}
        />
        <ActionButton
          disabled={createMutation.isPending || !addForm.label.trim()}
          label={createMutation.isPending ? 'Adding...' : 'Add channel'}
          onPress={() => {
            const channelIndex = Number(addForm.channelIndex);
            const sortOrder = Number(addForm.sortOrder || 0);
            createMutation.mutate({
              channelIndex,
              label: addForm.label.trim(),
              sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
              unit: addForm.unit.trim() || 'ADC',
            });
          }}
        />
      </Section>

      <Section subtitle="Tap edit to update or delete an existing row." title="Current channels">
        {channelsQuery.isLoading && !channelsQuery.data ? <LoadingBlock label="Loading channels..." /> : null}
        {channels.length ? (
          channels.map((channel) => (
            <View key={channel.sensorChannelId} style={styles.channelRow}>
              <View style={styles.channelCopy}>
                <Text style={styles.channelTitle}>{channel.label}</Text>
                <Text style={styles.channelMeta}>
                  ADC{channel.channelIndex}  {channel.unit ?? 'ADC'}  sort {channel.sortOrder ?? 0}
                </Text>
              </View>
              <View style={styles.channelActions}>
                <ActionButton label="Edit" onPress={() => setEditing(channel)} secondary />
                <ActionButton
                  danger
                  label={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  onPress={() => {
                    Alert.alert('Delete channel', `Delete ${channel.label}?`, [
                      { style: 'cancel', text: 'Cancel' },
                      { style: 'destructive', text: 'Delete', onPress: () => deleteMutation.mutate(channel.sensorChannelId) },
                    ]);
                  }}
                />
              </View>
            </View>
          ))
        ) : (
          <EmptyState message="No sensor channel rows were returned for this device." title="No channels" />
        )}
      </Section>

      <EditChannelModal
        channel={editing}
        onClose={() => setEditing(null)}
        onSave={(channelId, input) => updateMutation.mutate({ channelId, input })}
      />
    </Page>
  );
}

function EditChannelModal({
  channel,
  onClose,
  onSave,
}: {
  channel: Channel | null;
  onClose: () => void;
  onSave: (channelId: number, input: ChannelUpdateInput) => void;
}) {
  const [form, setForm] = useState({ channelIndex: '', label: '', sortOrder: '', unit: '' });

  useEffect(() => {
    if (!channel) return;
    setForm({
      channelIndex: String(channel.channelIndex),
      label: channel.label,
      sortOrder: String(channel.sortOrder ?? 0),
      unit: channel.unit ?? 'ADC',
    });
  }, [channel]);

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={Boolean(channel)}>
      <Pressable onPress={onClose} style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>{channel ? `Edit channel #${channel.sensorChannelId}` : 'Edit channel'}</Text>
            <Field
              keyboardType="numeric"
              label="ADC index"
              onChangeText={(value) => setForm((current) => ({ ...current, channelIndex: value.replace(/[^\d]/g, '') }))}
              value={form.channelIndex}
            />
            <Field label="Label" onChangeText={(value) => setForm((current) => ({ ...current, label: value }))} value={form.label} />
            <Field label="Unit" onChangeText={(value) => setForm((current) => ({ ...current, unit: value }))} value={form.unit} />
            <Field
              keyboardType="numeric"
              label="Sort order"
              onChangeText={(value) => setForm((current) => ({ ...current, sortOrder: value.replace(/[^\d-]/g, '') }))}
              value={form.sortOrder}
            />
            <View style={styles.channelActions}>
              <ActionButton label="Cancel" onPress={onClose} secondary />
              <ActionButton
                label="Save"
                onPress={() => {
                  if (!channel) return;
                  onSave(channel.sensorChannelId, {
                    channelIndex: Number(form.channelIndex),
                    label: form.label.trim(),
                    sortOrder: Number(form.sortOrder || 0),
                    unit: form.unit.trim() || 'ADC',
                  });
                }}
              />
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  channelActions: {
    flexDirection: 'row',
    gap: 10,
  },
  channelCopy: {
    flex: 1,
    gap: 4,
  },
  channelMeta: {
    color: '#475569',
    fontSize: 13,
  },
  channelRow: {
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    gap: 12,
    paddingBottom: 14,
    paddingTop: 6,
  },
  channelTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  deviceText: {
    color: '#475569',
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    maxHeight: '85%',
    padding: 16,
    width: '100%',
  },
  modalContent: {
    gap: 12,
  },
  modalTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
});
