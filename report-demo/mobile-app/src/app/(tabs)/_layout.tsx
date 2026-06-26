import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#f1f5f9' },
        tabBarActiveTintColor: '#4e54c8',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          borderTopColor: '#e2e8f0',
          backgroundColor: '#fff',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="grid-outline" size={size} />,
          title: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="charts"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="stats-chart-outline" size={size} />,
          title: 'Charts',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="time-outline" size={size} />,
          title: 'History',
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="hardware-chip-outline" size={size} />,
          title: 'Devices',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="settings-outline" size={size} />,
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}

