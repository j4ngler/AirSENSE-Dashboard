# AirSENSE Mobile

Expo Go client for the AirSENSE Electric-Nose backend in this repository. The app keeps feature parity with the old Android app across five tabs: Dashboard, Charts, History, Devices, and Settings.

## Prerequisites

- Node.js 18+
- Expo Go on Android or iOS
- The `report-demo` backend running on the same machine or a reachable LAN/HTTPS endpoint

## Install and run

```bash
cd mobile-app
npm install
npx expo start
```

Scan the QR code with Expo Go. If the phone cannot reach your computer over LAN, use:

```bash
npx expo start --tunnel
```

## Server URL resolution

The app resolves the API base URL in this order:

1. Saved URL from the Settings tab
2. `EXPO_PUBLIC_API_BASE_URL`
3. Expo Go host IP mapped to `http://<host-ip>:3010/`

If none of those work, open the Settings tab and enter the server URL manually.

## Environment

Optional local variable:

```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:3010
```

This is useful when Expo host inference is blocked by VPN, hotspot isolation, or non-standard backend ports.

## What the app uses

- Expo Router for 5-tab navigation
- TanStack Query for polling and mutations
- `expo-secure-store` for `baseUrl`, `apiKey`, `refreshMs`, and `selectedDevice`
- `react-native-svg` for charts that work in Expo Go

## Backend endpoints

The mobile app consumes the existing backend contract without adding new endpoints:

- `GET /config.json`
- `GET /api/health`
- `GET /api/enose/devices`
- `GET /api/enose/devices/:id/latest`
- `GET /api/enose/devices/:id/status`
- `GET /api/enose/devices/:id/history`
- `GET /api/enose/devices/:id/measurements`
- `GET /api/enose/devices/measurements/active`
- `GET /api/enose/control/status`
- `POST /api/enose/devices/:id/start`
- `POST /api/enose/devices/:id/stop`
- `POST /api/enose/devices/:id/heating`
- `POST /api/enose/devices/:id/air-pump`
- `GET/POST/PATCH` sensor-channel CRUD endpoints

## Notes

- Expo Go is the intended development target for this project.
- If future features need native modules outside Expo Go, switch to an Expo development build instead of forcing unsupported libraries into Expo Go.
