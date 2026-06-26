import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';

import type { PersistedSettings } from '@/lib/types';

const DEFAULT_REFRESH_MS = 10_000;
const STORAGE_KEY = 'airsense-mobile-settings';

type SettingsContextValue = {
  effectiveBaseUrl: string;
  isReady: boolean;
  settings: PersistedSettings;
  updateSettings: (patch: Partial<PersistedSettings>) => Promise<void>;
};

const DEFAULT_SETTINGS: PersistedSettings = {
  apiKey: '',
  baseUrl: '',
  refreshMs: DEFAULT_REFRESH_MS,
  selectedDevice: '',
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function normalizeBaseUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return `${trimmed.replace(/\/+$/, '')}/`;
}

function readHostFromUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const match = value.match(/^[a-z]+:\/\/([^/:]+)/i);
  if (!match?.[1]) return null;
  const host = match[1].trim();
  if (!host || host === 'localhost' || host === '127.0.0.1') return null;
  return host;
}

function envBaseUrl(): string {
  return normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL ?? '');
}

function inferDevServerBaseUrl(): string {
  const envBase = envBaseUrl();
  if (envBase) return envBase;

  const linkingUrl = Linking.createURL('/');
  const configHostUri = (Constants.expoConfig as { hostUri?: string } | null)?.hostUri;
  const legacyHostUri = (Constants.manifest2 as { extra?: { expoClient?: { hostUri?: string } } } | null)?.extra?.expoClient?.hostUri;
  const host = readHostFromUrl(linkingUrl) ?? readHostFromUrl(configHostUri) ?? readHostFromUrl(legacyHostUri);
  return host ? `http://${host}:3010/` : '';
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PersistedSettings>(DEFAULT_SETTINGS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(STORAGE_KEY);
        if (!active || !raw) return;
        const parsed = JSON.parse(raw) as Partial<PersistedSettings>;
        setSettings({
          apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey : '',
          baseUrl: typeof parsed.baseUrl === 'string' ? parsed.baseUrl : '',
          refreshMs:
            typeof parsed.refreshMs === 'number' && Number.isFinite(parsed.refreshMs)
              ? Math.max(parsed.refreshMs, 2_000)
              : DEFAULT_REFRESH_MS,
          selectedDevice: typeof parsed.selectedDevice === 'string' ? parsed.selectedDevice : '',
        });
      } finally {
        if (active) setIsReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const updateSettings = async (patch: Partial<PersistedSettings>) => {
    setSettings((current) => {
      const next = {
        ...current,
        ...patch,
        baseUrl: patch.baseUrl !== undefined ? normalizeBaseUrl(patch.baseUrl) : current.baseUrl,
        refreshMs:
          patch.refreshMs !== undefined && Number.isFinite(patch.refreshMs)
            ? Math.max(patch.refreshMs, 2_000)
            : current.refreshMs,
      };
      void SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const effectiveBaseUrl = envBaseUrl() || normalizeBaseUrl(settings.baseUrl) || inferDevServerBaseUrl();

  return (
    <SettingsContext.Provider
      value={{
        effectiveBaseUrl,
        isReady,
        settings,
        updateSettings,
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within SettingsProvider');
  }
  return context;
}


