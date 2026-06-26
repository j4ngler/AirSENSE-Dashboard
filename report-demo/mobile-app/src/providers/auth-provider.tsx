import React, { createContext, useContext, useState } from 'react';
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


  const login = async (username: string, password: string) => {
    const normalizedUsername = username.trim();
    if (!normalizedUsername || !password) {
      throw new Error('Vui long nhap ten dang nhap va mat khau.');
    }

    const users = await readUsers();
    const foundUser = users.find((user) => user.username.toLowerCase() === normalizedUsername.toLowerCase());
    if (!foundUser || foundUser.password !== password) {
      throw new Error('Ten dang nhap hoac mat khau khong dung.');
    }

    const authToken = `local-${normalizedUsername}-${Date.now()}`;
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, authToken);
    await SecureStore.setItemAsync(AUTH_DEVICE_KEY, normalizedUsername);
    setToken(authToken);
    setDeviceId(normalizedUsername);
  };

  const register = async (username: string, password: string, confirmPassword: string) => {
    const normalizedUsername = username.trim();
    if (!normalizedUsername) throw new Error('Vui long nhap ten dang nhap.');
    if (!password) throw new Error('Vui long nhap mat khau.');
    if (password !== confirmPassword) throw new Error('Mat khau xac nhan khong khop.');

    const users = await readUsers();
    const existed = users.some((user) => user.username.toLowerCase() === normalizedUsername.toLowerCase());
    if (existed) throw new Error('Ten dang nhap da ton tai.');

    await writeUsers([...users, { password, username: normalizedUsername }]);
  };

  const logout = async () => {
    disconnectMqtt();
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(AUTH_DEVICE_KEY);
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

