# report-demo

## Mobile App

The Android-native app is being replaced by the Expo Go client in [mobile-app](/d:/esp5.1/AirSENSE-Vietnam-main/AirSENSE-Vietnam-main/report-demo/mobile-app/README.md).

Current mobile workflow:

1. Start the backend in this repository with `npm start`.
2. Open `mobile-app/`, run `npm install`, then `npx expo start`.
3. Open the project in Expo Go on Android or iOS.

The legacy Kotlin app under `android-app/` is now deprecated and kept only as a migration reference until the Expo client is fully validated on devices.

Ứng dụng web **standalone** giám sát Electric-Nose: dashboard (sidebar), REST API (`/api/enose`), bridge **MQTT** → **MongoDB**, metadata và CRUD kênh cảm biến trên **SQL** (PostgreSQL hoặc MySQL).

---

## Yêu cầu

| Thành phần | Phiên bản / ghi chú |
| --- | --- |
| **Windows + PowerShell** | PowerShell 5+ hoặc PowerShell 7 |
| **Node.js** | 18+ (khuyến nghị LTS) |
| **npm** | đi kèm Node |
| **PostgreSQL** hoặc **MySQL** | Tuỳ `DB_CLIENT` trong `.env` |
| **MongoDB** | Lưu telemetry (`sensor`, `device_status`, `measurement_data`, …) |
| **MQTT broker** | Ví dụ Mosquitto — ESP hoặc tool test publish topic `electric-nose/device/...` |

---

## Khởi chạy nhanh (PowerShell thuần local)

### Bước 1 — Mở PowerShell tại thư mục dự án

```powershell
cd D:\esp5.1\AirSENSE-Vietnam-main\AirSENSE-Vietnam-main\report-demo
```

### Bước 2 — Tạo file `.env` từ mẫu

```powershell
Copy-Item .env.example .env
```

Sau đó mở `.env` và chỉnh đúng thông tin máy bạn:
- SQL: `DB_CLIENT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Mongo: `APP_MONGO`, `APP_MONGO_PORT`, `APP_MONGO_USER`, `APP_MONGO_PASSWORD`, `APP_MONGO_TABLE`
- MQTT: `MQTT_BROKER_URL`, `MQTT_PORT`, `MQTT_USERNAME`, `MQTT_PASSWORD`

### Bước 3 — Cài dependency

```powershell
npm install
```

### Bước 4 — Tạo schema SQL (nếu dùng PostgreSQL)

```powershell
node .\scripts\init-pg-schema.js
```

Script tạo các bảng `enose_devices`, `enose_control_history`, `enose_sensor_channels` và seed thiết bị `AirSENSE` + kênh mặc định.

### Bước 5 — Chạy ứng dụng

```powershell
npm start
```

Mặc định: `http://127.0.0.1:3010`

### Bước 6 — Kiểm tra nhanh

- Mở `http://127.0.0.1:3010`
- Mở `http://127.0.0.1:3010/config.json` để kiểm tra API config công khai.

---

## Biến môi trường chính (`.env`)

| Nhóm | Biến | Ý nghĩa |
| --- | --- | --- |
| App | `PORT` | Cổng HTTP (mặc định `3010`) |
|  | `REPORT_DEMO_REFRESH_MS` | Chu kỳ polling UI (ms) |
| SQL | `DB_CLIENT` | `pg` hoặc `mysql` |
|  | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Kết nối SQL |
| Mongo | `APP_MONGO`, `APP_MONGO_PORT`, `APP_MONGO_TABLE`, … | URI/host và tên database (mặc định DB `airsense`) |
| MQTT | `MQTT_BROKER_URL`, `MQTT_PORT`, … | Broker nhận dữ liệu từ ESP |

Chi tiết mặc định xem `.env.example`.

---

## Dữ liệu trên web hiển thị từ đâu?

- **Danh sách thiết bị, kênh cảm biến:** đọc từ **SQL** (`enose_*`).
- **KPI, biểu đồ, lịch sử điểm đo:** đọc từ **MongoDB** — do MQTT bridge ghi khi có message topic `electric-nose/device/<mã>/sensor`, `/status`, `/measurement/data`.

Nếu chưa có ESP hoặc chưa publish MQTT, giao diện vẫn mở được nhưng số đo có thể là `--` hoặc trống.

---

## Dùng chung 1 DB cho nhiều người (để hiển thị đúng và mượt)

Khi nhiều máy cùng truy cập chung SQL/Mongo, nên thống nhất các điểm sau:

1. **Chỉ 1 instance bridge ghi dữ liệu MQTT**
   - Chỉ chạy **một** backend có `mqttBridge` subscribe topic sensor.
   - Nếu bật nhiều backend cùng subscribe và cùng ghi Mongo, dữ liệu dễ bị lặp/tranh nhau theo thời gian nhận.

2. **Tất cả máy dùng cùng cấu hình `.env` (trừ `PORT`)**
   - Các biến `DB_*`, `APP_MONGO*`, `MQTT_*` phải trỏ cùng server.
   - Mỗi máy chỉ khác `PORT` nếu chạy song song frontend/backend trên nhiều máy.

3. **Đồng bộ múi giờ**
   - Khuyến nghị đặt cùng timezone hệ thống (ví dụ UTC+7).
   - Dữ liệu `sensor.time` được lưu theo thời điểm server nhận message; lệch giờ máy local sẽ gây cảm giác sai cửa sổ thời gian khi đối chiếu.

4. **Giữ polling vừa phải**
   - Giá trị mặc định phù hợp: `REPORT_DEMO_REFRESH_MS=10000` (10 giây).
   - Nếu nhiều người cùng mở dashboard, không nên giảm quá thấp (ví dụ 1-2 giây) vì sẽ tăng tải API và DB.

5. **Khởi tạo SQL một lần**
   - Chỉ cần chạy `node .\scripts\init-pg-schema.js` một lần trên DB dùng chung.
   - Chạy lặp lại nhiều nơi không hỏng dữ liệu chính, nhưng không cần thiết.

6. **Kiểm tra nhanh khi nghi dữ liệu hiển thị lệch**
   - Mở `GET /api/enose/devices/:id/latest`: xác nhận có `content.adc` hoặc `ADC0...`.
   - Mở `GET /api/enose/devices/:id/history?limit=120`: xác nhận có mẫu trong 24h gần nhất.
   - Nếu KPI có mà chart ADC trống: kiểm tra nguồn publish có gửi `adc` đầy đủ mỗi bản tin hay không.

---

## Xuất báo cáo Word (tuỳ chọn)

```powershell
npm run export:docx
```

Tạo file `group01_ltweb_electric-nose-report-demo.docx` từ `BAO_CAO_TEMPLATE_WORD.md`.

---

## Báo cáo AC2070

- Nội dung theo HD: `BAO_CAO_TEMPLATE_WORD.md` (điền nhóm, chèn hình PH/PM, ảnh demo).
- Tổng hợp kỹ thuật / slide nháp: `BAO_CAO_TONG_HOP_REPORT_DEMO.md`.

Gợi ý chuẩn bị trình bày:
1. Chụp màn hình: Dashboard (KPI + thẻ ADC), tab Biểu đồ (temp/hum + 8 ADC), tab Lịch sử, CRUD kênh.
2. Nêu rõ nguồn dữ liệu: KPI/sparkline từ `GET /api/enose/devices/:id/latest`; biểu đồ dài từ `GET /api/enose/devices/:id/history`.
3. Không đưa nội dung `.env` thật (mật khẩu, broker) lên slide hay bản nộp.

---

## Cấu trúc thư mục

| Đường dẫn | Vai trò |
| --- | --- |
| `public/` | `index.html`, `report.js`, `styles.css` — giao diện |
| `src/server.js` | Express, static, `/api/enose`, `/config.json` |
| `src/config.js` | Đọc `.env` |
| `src/db.js` | Knex (SQL) + Mongoose (Mongo) |
| `src/routes/enose.js` | API đọc/ghi, điều khiển, CRUD kênh |
| `src/services/mqttBridge.js` | Subscribe MQTT → ghi Mongo/SQL |
| `scripts/init-pg-schema.js` | Khởi tạo schema + seed PostgreSQL |

---

## CRUD cấu hình kênh cảm biến

- Bảng SQL `enose_sensor_channels`: `channel_index` 0..31, `label`, `unit`, `sort_order`, soft-delete.
- API:
  - `GET /api/enose/devices/:id/sensor-channels`
  - `POST /api/enose/devices/:id/sensor-channels`
  - `PATCH /api/enose/sensor-channels/:channelId`
  - `POST /api/enose/sensor-channels/:channelId/delete`

Nếu API báo thiếu bảng: chạy lại:

```powershell
node .\scripts\init-pg-schema.js
```

---

## Xử lý sự cố thường gặp

| Hiện tượng | Gợi ý |
| --- | --- |
| `ECONNREFUSED` SQL/Mongo/MQTT | Kiểm tra dịch vụ đã chạy, `.env` đúng host/port, firewall. |
| Trang trắng / 404 tĩnh | Chạy `npm start` từ đúng thư mục `report-demo`, mở đúng `PORT`. |
| Dropdown không có thiết bị | Chạy `node .\scripts\init-pg-schema.js` (PG) hoặc kiểm tra bảng `enose_devices`, `delete_flag = 0`. |
| KPI luôn `--` | Mongo chưa có document `sensor` — cần MQTT từ ESP hoặc nguồn publish test. |
| Cổng 5432 / 27017 / 1883 bận | Đổi cổng dịch vụ SQL/Mongo/MQTT trên máy và cập nhật `.env`. |
