import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useRouter } from 'expo-router';

import { ActionButton, EmptyState, Field, InlineError, Page, Section } from '@/components/ui';
import { fetchAppConfig, fetchHealth, userMessageFromError } from '@/lib/api';
import { useAppSettings } from '@/providers/settings-provider';
import { useAuth } from '@/providers/auth-provider';

export default function SettingsScreen() {
  const router = useRouter();
  const { effectiveBaseUrl, isReady, settings, updateSettings } = useAppSettings();
  const { logout, deviceId } = useAuth();
  const [draft, setDraft] = useState({
    apiKey: settings.apiKey,
    baseUrl: settings.baseUrl,
    refreshMs: String(settings.refreshMs),
  });
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setDraft({
      apiKey: settings.apiKey,
      baseUrl: settings.baseUrl,
      refreshMs: String(settings.refreshMs),
    });
  }, [settings.apiKey, settings.baseUrl, settings.refreshMs]);

  if (!isReady) {
    return (
      <Page>
        <EmptyState message="Loading settings..." title="Please wait" />
      </Page>
    );
  }

  return (
    <Page>
      <Section subtitle="Persisted with expo-secure-store and used by every tab." title="Connection settings">
        <Field
          keyboardType="url"
          label="Server URL"
          onChangeText={(value) => setDraft((current) => ({ ...current, baseUrl: value }))}
          placeholder="http://192.168.1.10:3010"
          value={draft.baseUrl}
        />
        <Field label="API key" onChangeText={(value) => setDraft((current) => ({ ...current, apiKey: value }))} secureTextEntry value={draft.apiKey} />
        <Field
          keyboardType="numeric"
          label="Refresh interval (ms)"
          onChangeText={(value) => setDraft((current) => ({ ...current, refreshMs: value.replace(/[^\d]/g, '') }))}
          value={draft.refreshMs}
        />
        <InlineError message={errorMessage} />
        {message ? <Text style={{ color: '#166534' }}>{message}</Text> : null}
        <ActionButton
          label="Save settings"
          onPress={async () => {
            setErrorMessage(null);
            setMessage(null);
            try {
              await updateSettings({
                apiKey: draft.apiKey,
                baseUrl: draft.baseUrl,
                refreshMs: Number(draft.refreshMs || settings.refreshMs),
              });
              setMessage('Settings saved.');
            } catch (error) {
              setErrorMessage(userMessageFromError(error));
            }
          }}
        />
        <ActionButton
          disabled={testing}
          label={testing ? 'Testing...' : 'Test connection'}
          onPress={async () => {
            const baseUrl = draft.baseUrl.trim() || effectiveBaseUrl;
            setTesting(true);
            setErrorMessage(null);
            setMessage(null);
            try {
              const tempSettings = { ...settings, apiKey: draft.apiKey };
              const [health, config] = await Promise.all([fetchHealth(tempSettings, baseUrl), fetchAppConfig(tempSettings, baseUrl)]);
              setMessage(
                `OK. mongo=${health.mongo ?? '--'}, pg=${health.pg ?? '--'}, mqtt=${health.mqtt ?? '--'}, requireApiKey=${String(
                  config.requireApiKey ?? false,
                )}`,
              );
            } catch (error) {
              setErrorMessage(userMessageFromError(error));
            } finally {
              setTesting(false);
            }
          }}
          secondary
        />
      </Section>

      <Section subtitle="Resolved automatically when Expo Go is running on the same LAN." title="Current resolution">
        <Text style={{ color: '#0f172a', fontWeight: '700' }}>{effectiveBaseUrl || 'No URL resolved yet.'}</Text>
        <Text style={{ color: '#475569' }}>
          If no URL is saved, the app tries EXPO_PUBLIC_API_BASE_URL first and then derives the host IP from the Expo Go development URL.
        </Text>
      </Section>

      <Section subtitle="Operational notes for Android and iOS in Expo Go." title="Quick guide">
        <Text style={{ color: '#334155', lineHeight: 22 }}>
          Use a LAN URL like http://192.168.x.x:3010 while your phone and computer are on the same Wi-Fi. If LAN access is blocked, start Expo with
          tunnel mode and expose the backend through HTTPS or a reverse proxy. Leave API key empty unless APP_API_KEY is enabled on the server.
        </Text>
      </Section>

      <Section subtitle={deviceId ? `Logged in as: ${deviceId}` : 'Not logged in'} title="Account">
        <ActionButton
          danger
          disabled={loggingOut}
          label={loggingOut ? 'Logging out...' : 'Logout'}
          onPress={async () => {
            setLoggingOut(true);
            setErrorMessage(null);
            try {
              await logout();
              router.replace('/login');
            } catch (error) {
              setErrorMessage(userMessageFromError(error));
            } finally {
              setLoggingOut(false);
            }
          }}
        />
      </Section>
    </Page>
  );
}
