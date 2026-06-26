import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';

import { useAuth } from '@/providers/auth-provider';
import { useAppSettings } from '@/providers/settings-provider';

export function AppNavigator() {
  const { isReady } = useAppSettings();
  const { isLoggedIn } = useAuth();

  if (!isReady) {
    return (
      <View style={{ alignItems: 'center', backgroundColor: '#4e54c8', flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
