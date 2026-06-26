import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { SettingsProvider } from '@/providers/settings-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { AppNavigator } from '@/components/AppNavigator';

const [queryClient] = [
  new QueryClient({ defaultOptions: { queries: { retry: 1 } } }),
];

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* SettingsProvider trước để AuthProvider dùng được effectiveBaseUrl */}
        <SettingsProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <StatusBar style="auto" />
              <AppNavigator />
            </QueryClientProvider>
          </AuthProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
