import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView contentContainerStyle={styles.page} style={styles.pageSurface}>
      {children}
    </ScrollView>
  );
}

export function Section({ children, title, subtitle }: { children: React.ReactNode; subtitle?: string; title: string }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

export function StatCard({ accentColor, label, unit, value }: { accentColor: string; label: string; unit: string; value: string }) {
  return (
    <View style={[styles.statCard, { borderColor: accentColor }]}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statRow}>
        <Text style={[styles.statValue, { color: accentColor }]}>{value}</Text>
        <Text style={styles.statUnit}>{unit}</Text>
      </View>
    </View>
  );
}

export function ActionButton({
  danger,
  disabled,
  label,
  onPress,
  secondary,
}: {
  danger?: boolean;
  disabled?: boolean;
  label: string;
  onPress: () => void;
  secondary?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary ? styles.buttonSecondary : danger ? styles.buttonDanger : styles.buttonPrimary,
        disabled ? styles.buttonDisabled : null,
        pressed && !disabled ? styles.buttonPressed : null,
      ]}>
      <Text style={secondary ? styles.buttonSecondaryText : styles.buttonPrimaryText}>{label}</Text>
    </Pressable>
  );
}

export function InlineError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <View style={styles.errorBanner}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

export function Field({
  keyboardType,
  label,
  multiline,
  onChangeText,
  placeholder,
  secureTextEntry,
  value,
}: {
  keyboardType?: 'default' | 'number-pad' | 'numeric' | 'url';
  label: string;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  value: string;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        secureTextEntry={secureTextEntry}
        style={[styles.fieldInput, multiline ? styles.fieldInputMultiline : null]}
        value={value}
      />
    </View>
  );
}

export function EmptyState({ message, title }: { message: string; title: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

export function LoadingBlock({ label }: { label?: string }) {
  return (
    <View style={styles.loadingBlock}>
      <ActivityIndicator size="small" color="#0f172a" />
      <Text style={styles.loadingText}>{label ?? 'Loading...'}</Text>
    </View>
  );
}

export function DevicePicker({
  currentLabel,
  items,
  onSelect,
  title,
}: {
  currentLabel: string;
  items: { label: string; value: string }[];
  onSelect: (value: string) => void;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={styles.deviceButton}>
        <Text style={styles.deviceButtonTitle}>{title}</Text>
        <Text style={styles.deviceButtonValue}>{currentLabel || 'Select a device'}</Text>
      </Pressable>
      <Modal animationType="slide" onRequestClose={() => setOpen(false)} transparent visible={open}>
        <Pressable onPress={() => setOpen(false)} style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Devices</Text>
            <ScrollView>
              {items.map((item) => (
                <Pressable
                  key={item.value}
                  onPress={() => {
                    onSelect(item.value);
                    setOpen(false);
                  }}
                  style={styles.modalRow}>
                  <Text style={styles.modalRowText}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <ActionButton label="Close" onPress={() => setOpen(false)} secondary />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export function SwitchRow({
  label,
  onValueChange,
  subtitle,
  value,
}: {
  label: string;
  onValueChange: (value: boolean) => void;
  subtitle?: string;
  value: boolean;
}) {
  return (
    <View style={styles.switchRow}>
      <View style={styles.switchCopy}>
        <Text style={styles.switchLabel}>{label}</Text>
        {subtitle ? <Text style={styles.switchSubtitle}>{subtitle}</Text> : null}
      </View>
      <Switch onValueChange={onValueChange} value={value} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonDanger: {
    backgroundColor: '#991b1b',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonPrimary: {
    backgroundColor: '#0f172a',
  },
  buttonPrimaryText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonSecondary: {
    backgroundColor: '#e2e8f0',
  },
  buttonSecondaryText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#dbe4f0',
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  deviceButton: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  deviceButtonTitle: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  deviceButtonValue: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  emptyMessage: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#dbe4f0',
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    padding: 24,
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
    lineHeight: 20,
  },
  fieldInput: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderRadius: 14,
    borderWidth: 1,
    color: '#0f172a',
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  fieldInputMultiline: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  fieldLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  fieldWrap: {
    gap: 6,
  },
  loadingBlock: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  loadingText: {
    color: '#334155',
    fontSize: 14,
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    gap: 12,
    maxHeight: '80%',
    padding: 18,
    width: '100%',
  },
  modalRow: {
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  modalRowText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
  },
  modalTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  page: {
    gap: 16,
    padding: 16,
    paddingBottom: 32,
  },
  pageSurface: {
    backgroundColor: '#f1f5f9',
    flex: 1,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionSubtitle: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '800',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    gap: 8,
    minWidth: 92,
    padding: 14,
  },
  statLabel: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 6,
  },
  statUnit: {
    color: '#64748b',
    fontSize: 13,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 30,
  },
  switchCopy: {
    flex: 1,
    gap: 4,
  },
  switchLabel: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  switchSubtitle: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 18,
  },
});
