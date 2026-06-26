import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/auth-provider';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !password || !confirmPassword) {
      Alert.alert('Thieu thong tin', 'Vui long nhap day du ten dang nhap, mat khau va xac nhan.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mat khau khong khop', 'Mat khau va xac nhan phai giong nhau.');
      return;
    }
    try {
      setLoading(true);
      await register(username.trim(), password, confirmPassword);
      Alert.alert('Dang ky thanh cong', 'Hay dang nhap bang tai khoan vua tao.');
      router.replace('/login');
    } catch (e: unknown) {
      Alert.alert('Dang ky that bai', e instanceof Error ? e.message : 'Khong the tao tai khoan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>AirSENSE</Text>
          <Text style={styles.subtitle}>Tao tai khoan cuc bo tren ung dung</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Dang ky</Text>
          <Text style={styles.label}>Ten dang nhap</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setUsername}
            placeholder="Nhap ten dang nhap"
            style={styles.input}
            value={username}
          />

          <Text style={styles.label}>Mat khau</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setPassword}
            placeholder="Nhap mat khau"
            secureTextEntry
            style={styles.input}
            value={password}
          />

          <Text style={styles.label}>Xac nhan mat khau</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setConfirmPassword}
            onSubmitEditing={handleRegister}
            placeholder="Nhap lai mat khau"
            secureTextEntry
            style={[styles.input, confirmPassword && password !== confirmPassword ? styles.inputError : null]}
            value={confirmPassword}
          />

          <Pressable disabled={loading} onPress={handleRegister} style={[styles.primaryButton, loading && styles.disabled]}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Tao tai khoan</Text>}
          </Pressable>

          <Pressable onPress={() => router.replace('/login')} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Quay lai dang nhap</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    gap: 12,
    padding: 20,
  },
  disabled: {
    opacity: 0.65,
  },
  header: {
    gap: 8,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderRadius: 12,
    borderWidth: 1,
    color: '#0f172a',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#dc2626',
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  logo: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    marginTop: 6,
    paddingVertical: 14,
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  root: {
    backgroundColor: '#0f172a',
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#cbd5e1',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 13,
  },
  secondaryText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 14,
    textAlign: 'center',
  },
  title: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
});

