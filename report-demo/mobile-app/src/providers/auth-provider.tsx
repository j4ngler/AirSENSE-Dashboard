import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { disconnectMqtt } from '@/lib/mqtt';

type AuthContextType = {
  token: string | null;
  deviceId: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
};

type StoredUser = {
  password: string;
  username: string;
};

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_DEVICE_KEY = 'authDeviceId';
const USERS_KEY = 'airsense-mobile-users';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function readUsers(): Promise<StoredUser[]> {
  const raw = await SecureStore.getItemAsync(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed.filter((item) => item.username && item.password) : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]) {
  await SecureStore.setItemAsync(USERS_KEY, JSON.stringify(users));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const isLoggedIn = !!token && !!deviceId;

  useEffect(() => {
    // Phiên đăng nhập chỉ tồn tại trong lần chạy hiện tại; tài khoản đăng ký vẫn được lưu.
    void Promise.all([SecureStore.deleteItemAsync(AUTH_TOKEN_KEY), SecureStore.deleteItemAsync(AUTH_DEVICE_KEY)]);
  }, []);

  const login = async (username: string, password: string) => {
    const normalizedUsername = username.trim();
    if (!normalizedUsername || !password) {
      throw new Error('Vui lòng nhập tên đăng nhập và mật khẩu.');
    }

    const users = await readUsers();
    const foundUser = users.find((user) => user.username.toLowerCase() === normalizedUsername.toLowerCase());
    if (!foundUser || foundUser.password !== password) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
    }

    const authToken = `local-${normalizedUsername}-${Date.now()}`;
    setToken(authToken);
    setDeviceId(normalizedUsername);
  };

  const register = async (username: string, password: string, confirmPassword: string) => {
    const normalizedUsername = username.trim();
    if (!normalizedUsername) throw new Error('Vui lòng nhập tên đăng nhập.');
    if (!password) throw new Error('Vui lòng nhập mật khẩu.');
    if (password !== confirmPassword) throw new Error('Mật khẩu xác nhận không khớp.');

    const users = await readUsers();
    const existed = users.some((user) => user.username.toLowerCase() === normalizedUsername.toLowerCase());
    if (existed) throw new Error('Tên đăng nhập đã tồn tại.');

    await writeUsers([...users, { password, username: normalizedUsername }]);
  };

  const logout = async () => {
    disconnectMqtt();
    await Promise.all([SecureStore.deleteItemAsync(AUTH_TOKEN_KEY), SecureStore.deleteItemAsync(AUTH_DEVICE_KEY)]);
    setToken(null);
    setDeviceId(null);
  };

  return (
    <AuthContext.Provider value={{ token, deviceId, login, register, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

