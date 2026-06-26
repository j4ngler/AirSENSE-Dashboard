# AirSENSE Android (Kotlin + Jetpack Compose)

> Deprecated: active development has moved to the Expo Go client in `../mobile-app/`. Keep this folder only as migration reference while validating the new client on Android and iOS.

Ứng dụng Android cho hệ thống **AirSENSE Electric-Nose**, tiêu thụ REST API của `report-demo` (Node.js + Express). 5 tab tương đương web UI: Dashboard, Charts, History, Devices (CRUD kênh), Settings.

## Yêu cầu

| Thành phần | Phiên bản |
| --- | --- |
| Android Studio | Ladybug 2024.2 trở lên |
| JDK | 17 (đi kèm Android Studio) |
| Gradle | 8.10.2 (wrapper sẽ tự tải) |
| AGP | 8.7.x |
| Kotlin | 2.0.21 |
| Min SDK | 26 (Android 8.0) |
| Target SDK | 34 (Android 14) |

## Mở project

1. Mở Android Studio → `File` → `Open` → chọn thư mục `report-demo/android-app/`.
2. Đợi Gradle sync (lần đầu mất 3–5 phút để tải dependency).
3. Sau khi sync xong: chạy `app` → chọn máy thật (đã bật USB Debug) hoặc Emulator.

> Nếu là lần đầu chưa có Gradle Wrapper executables (`gradlew`, `gradlew.bat`):
> trong Android Studio menu `Tasks` → chạy `wrapper`, hoặc terminal:
> ```powershell
> gradle wrapper --gradle-version 8.10.2
> ```

## Cấu hình URL & API key (trên app, lần đầu chạy)

Vào tab **Cài đặt**:
- **URL máy chủ**: tuỳ môi trường
  - **Android Emulator** + backend chạy trên Windows host: `http://10.0.2.2:3010`
  - **LAN**: `http://192.168.x.x:3010`
  - **Internet**: `https://airsense.example.com` (nên dùng HTTPS qua reverse-proxy)
- **API key (X-API-Key)**: nếu backend đặt `APP_API_KEY` trong `.env` thì điền đúng giá trị; bỏ trống nếu không bật.
- Bấm **Kiểm tra kết nối** — nếu thấy `mongo=ok, pg=ok` là sẵn sàng.

## Cài đặt backend tương thích (đã sửa sẵn)

File `report-demo/src/server.js` đã được cập nhật:
- `GET /api/health` (không cần API key) → cho phép app probe nhanh.
- Middleware `X-API-Key` opt-in: chỉ bật khi `.env` đặt `APP_API_KEY=...`.
- Web tại chính máy chủ (localhost) **bypass** key để không phá UI hiện có.
- CORS headers cơ bản (`*`, hỗ trợ `X-API-Key`).

Bật xác thực cho app:
```env
# .env trên server
APP_API_KEY=mot-chuoi-bi-mat-dai-32-ky-tu
```
Sau đó nhập đúng key này vào tab **Cài đặt** của app.

## Triển khai ra Internet (an toàn)

Backend chạy HTTP cleartext không phù hợp để mở port public. Khuyến nghị:

### Caddy (đơn giản nhất, auto HTTPS Let's Encrypt)
`Caddyfile`:
```
airsense.example.com {
    encode zstd gzip
    reverse_proxy 127.0.0.1:3010
}
```
Mở port 80/443, cài Caddy, chạy:
```bash
caddy run --config /etc/caddy/Caddyfile
```

### Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name airsense.example.com;
    ssl_certificate     /etc/letsencrypt/live/airsense.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/airsense.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Sau khi có HTTPS:
- Trong app điền `https://airsense.example.com` (không kèm `:3010`).
- Cấu hình `network_security_config.xml` của app mặc định đã **cho phép HTTPS** và chỉ cho cleartext với dải LAN. Không cần sửa.

## Build APK release

```powershell
cd report-demo\android-app
.\gradlew.bat assembleRelease
```

File sinh ra ở `app\build\outputs\apk\release\app-release-unsigned.apk` (chưa ký số). Để cài lên máy thật cần ký số:
- Cách nhanh (testing): bật **debug signing** — vào Android Studio → `Build` → `Generate Signed App Bundle / APK…` → tạo keystore.
- Hoặc tạo keystore CLI:
```powershell
keytool -genkey -v -keystore airsense.keystore -alias airsense -keyalg RSA -keysize 2048 -validity 10000
```

## Cấu trúc thư mục

```
android-app/
├── build.gradle.kts                root project
├── settings.gradle.kts
├── gradle.properties
├── gradle/libs.versions.toml       version catalog (AGP, Kotlin, Compose, …)
├── gradle/wrapper/                 gradle-wrapper.properties
└── app/
    ├── build.gradle.kts
    ├── proguard-rules.pro
    └── src/main/
        ├── AndroidManifest.xml
        ├── res/
        │   ├── values/ (strings, colors, themes)
        │   ├── xml/network_security_config.xml
        │   ├── mipmap-anydpi-v26/  (launcher icon)
        │   └── drawable/           (foreground vector)
        └── java/vn/airsense/enose/
            ├── App.kt                  Hilt entry
            ├── MainActivity.kt
            ├── data/
            │   ├── remote/EnoseApi.kt
            │   ├── remote/dto/         Devices, Sensor, Channels
            │   └── repo/               ConfigRepository, EnoseRepository
            ├── di/NetworkModule.kt     Retrofit/OkHttp/Moshi + dynamic baseUrl
            └── ui/
                ├── theme/
                ├── common/             UiState, TimeFmt, error mapping
                ├── MainNav.kt          NavHost 5 tab
                ├── dashboard/
                ├── charts/             LineChart (Compose Canvas)
                ├── history/
                ├── devices/            CRUD enose_sensor_channels
                └── settings/
```

## Endpoint backend mà app sử dụng

| Method | Path | Mục đích |
| --- | --- | --- |
| GET  | `/config.json` | refreshMs + cờ `requireApiKey` |
| GET  | `/api/health` | probe Mongo/PG/MQTT (mới thêm) |
| GET  | `/api/enose/devices` | danh sách thiết bị |
| GET  | `/api/enose/devices/:id/latest` | tick cảm biến mới nhất |
| GET  | `/api/enose/devices/:id/status` | WiFi/storage/heating/pump |
| GET  | `/api/enose/devices/:id/history` | 120 mẫu gần nhất (vẽ chart, bảng) |
| GET  | `/api/enose/devices/:id/measurements` | phiên đo dài |
| GET  | `/api/enose/devices/measurements/active` | có phiên đang chạy không |
| GET  | `/api/enose/control/status` | tổng kê thiết bị |
| POST | `/api/enose/devices/:id/start` | bắt đầu đo |
| POST | `/api/enose/devices/:id/stop` | dừng đo |
| POST | `/api/enose/devices/:id/heating` | bật/tắt heating |
| POST | `/api/enose/devices/:id/air-pump` | bật/tắt air-pump |
| GET  | `/api/enose/devices/:id/sensor-channels` | đọc cấu hình kênh |
| POST | `/api/enose/devices/:id/sensor-channels` | thêm kênh |
| PATCH| `/api/enose/sensor-channels/:channelId` | sửa kênh |
| POST | `/api/enose/sensor-channels/:channelId/delete` | xóa mềm kênh |

## Roadmap mở rộng (sau MVP)

1. **Push realtime** thay polling 10s:
   - Hoặc thêm WebSocket trên `report-demo` (`socket.io`) → app subscribe events.
   - Hoặc app MQTT subscribe trực tiếp (`com.hivemq:hivemq-mqtt-client`) topic `electric-nose/device/+/sensor`.
2. **Push notification** khi `status=down` quá 5 phút (FCM).
3. **Foreground service** giữ polling khi app nền cho lab monitoring.
4. **Xuất CSV** ngay trên điện thoại từ `GET /api/enose/devices/:id/measurement-csv`.
5. **Offline cache 24h** vào Room để xem khi mất mạng.
6. **iOS** bằng Kotlin Multiplatform Mobile (chia sẻ data/network module với Android).
