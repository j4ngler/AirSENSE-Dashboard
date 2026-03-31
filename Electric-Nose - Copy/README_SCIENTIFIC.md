# Electric-Nose (Dashboard & Backend) — Mô tả theo phong cách khoa học

## Tóm tắt (Abstract)

Dự án **Electric-Nose** (E‑Nose) trong thư mục `Electric-Nose - Copy` là một hệ thống **thu thập–điều khiển–giám sát** cho thiết bị cảm biến mùi/khí dựa trên ESP32, với mục tiêu tạo ra chuỗi dữ liệu đo có cấu trúc (đặc biệt là **mảng ADC/MEMS**), phục vụ phân tích định lượng và phát triển các mô hình suy luận (classification/regression) trong tương lai.

Hệ thống được triển khai theo kiến trúc **IoT data pipeline** gồm: (i) thiết bị nhúng phát dữ liệu qua **MQTT**, (ii) backend Node.js tiếp nhận và lưu trữ vào **MongoDB** (dữ liệu thời gian thực) và **MySQL** (metadata/điều khiển), (iii) giao diện **Dashboard (EJS)** hiển thị trạng thái, hỗ trợ **start measurement**, và (iv) mô-đun **xử lý dữ liệu bằng Python** (thông qua virtual environment) phục vụ tiền xử lý/tổng hợp dữ liệu đo.

## Mục tiêu nghiên cứu/kỹ thuật (Objectives)

- **Thu nhận dữ liệu cảm biến** theo thời gian: nhiệt độ, độ ẩm và các kênh ADC (tương ứng MEMS).
- **Chuẩn hóa và lưu trữ dữ liệu** theo dạng có thể truy vấn, tái sử dụng cho phân tích hậu kỳ.
- **Điều khiển thí nghiệm/phiên đo (measurement session)**: phát lệnh đo, theo dõi tiến trình, ghi nhận file đo (CSV) và trạng thái chạy.
- **Giám sát vận hành thiết bị**: trạng thái online/offline, Wi‑Fi (SSID/IP), tài nguyên lưu trữ, và các actuator (heating/air pump).

## Phạm vi & thành phần hệ thống (System scope)

### 1) Thiết bị nhúng (ESP32)

Thiết bị ESP32 đóng vai trò:
- Phát **sensor stream** lên MQTT theo topic chuẩn hóa.
- Phát **status** định kỳ (Wi‑Fi, IP, storage, actuator state).
- Nhận lệnh điều khiển/đo và phát phản hồi tiến trình **measurement/data**.

### 2) Backend (Node.js/Express)

Backend được khởi chạy qua:

```bash
npm run dev
# hoặc
npm start
```

Các phụ thuộc chính (rút gọn):
- **Express/EJS**: server + render dashboard.
- **Mongoose (MongoDB)**: lưu dữ liệu thời gian thực.
- **MySQL/Knex**: bảng thiết bị, lịch sử điều khiển, metadata.
- **MQTT client**: subscribe/publish các topic thiết bị.

Điểm vào server: `server/server.js` (kết nối MongoDB, khởi chạy MQTT listener, mount routes).

### 3) Lưu trữ dữ liệu (Data stores)

- **MongoDB** (ưu tiên cho realtime/time-series):
  - Collection `sensor` (schema `dataSensor`): lưu bản ghi sensor theo topic, time, content.
  - Collection `enose_device_status`: lưu trạng thái thiết bị (Wi‑Fi, storage, actuator…).
  - Collection `enose_measurement_data`: lưu phiên đo (file_name, progress, samples_count, started_at/completed_at…).

- **MySQL** (ưu tiên cho quản trị/metadata):
  - `enose_devices`: danh sách thiết bị, trạng thái, last_seen, mqtt_topic…
  - `enose_control_history`: lịch sử phát lệnh điều khiển/đo.
  - (tùy cấu hình) `enose_device_data`: dữ liệu fallback trong trường hợp không có Mongo.

## Giao tiếp & luồng dữ liệu (Communication & data flow)

### MQTT topics (khuyến nghị/đang dùng)

Hệ thống sử dụng họ topic dạng:

- **Sensor stream**: `electric-nose/device/{device_id}/sensor`
- **Status**: `electric-nose/device/{device_id}/status`
- **Measurement progress/data**: `electric-nose/device/{device_id}/measurement/data`
- **Control channel**: `electric-nose/device/{device_id}/control`
- **Start measurement (publish)**: `electric-nose/device/{device_id}/measurement/start`

Backend listener `server/enose-mqtt-listener.js` subscribe wildcard:
- `electric-nose/device/+/sensor`
- `electric-nose/device/+/status`
- `electric-nose/device/+/measurement/data`

### Quy ước thời gian (Timestamping)

Một lựa chọn thiết kế quan trọng trong dự án là **ưu tiên thời gian server** khi lưu sensor:
- Khi nhận message `/sensor`, backend **bỏ qua timestamp từ ESP32** và dùng `Date.now()` (server) để tạo `time` (Unix seconds).
- Lý do: đồng hồ ESP32 có thể lệch/timezone sai hoặc chưa đồng bộ, gây nhiễu cho truy vấn theo thời gian và xác định “online/offline”.

Điều này giúp ổn định các phép đo dựa trên “tuổi dữ liệu” (data age) như: thiết bị online nếu có bản ghi mới trong \( \le 2 \) phút.

## API chính (Scientific/engineering interface)

Các endpoint E‑Nose được khai báo trong `server/routes/enose.route.js` (tất cả đều yêu cầu middleware `authenticate`):

- **Thiết bị**
  - `GET /api/enose/devices`: danh sách thiết bị (MySQL).
  - `GET /api/enose/devices/:id/latest`: dữ liệu mới nhất (ưu tiên Mongo `sensor`, fallback các nguồn khác).
  - `GET /api/enose/devices/:id/history?from=&to=&limit=`: lịch sử sensor.
  - `GET /api/enose/devices/:id/status`: status gần nhất.

- **Measurement**
  - `GET /api/enose/devices/measurements/active`: phiên đo đang chạy (nếu có), có cơ chế timeout/fail-safe.
  - `GET /api/enose/devices/measurements/files?limit=`: danh sách file đo (Mongo).
  - `GET /api/enose/control/measurement/last`: phiên đo hoàn thành gần nhất.

- **Điều khiển**
  - `GET /api/enose/control/status`: trạng thái hệ thống (tổng device online/offline, Wi‑Fi/storage từ Mongo).
  - `POST /api/enose/control/measurement/start`: phát lệnh start measurement (tự chọn thiết bị mặc định).
  - `POST /api/enose/devices/:id/heating`: bật/tắt heating.
  - `POST /api/enose/devices/:id/air-pump`: bật/tắt air pump.

## Dashboard (UI) & giám sát thời gian thực

Giao diện dashboard được render bằng EJS (ví dụ trang `/enose`) và định kỳ gọi API để:
- cập nhật trạng thái hệ thống (mỗi ~5 giây),
- kiểm tra “thiết bị online” dựa trên bản ghi sensor gần nhất,
- hiển thị các kênh MEMS/ADC theo thời gian thực khi có dữ liệu.

Trong thiết kế hiện tại, **ADC/MEMS** được hiểu như mảng 8 kênh:
- `ADC0 … ADC7` được map từ payload `adc[]`, `adc0..7`, hoặc `mems1..8` (fallback).

## Measurement: quản lý phiên đo & an toàn vận hành (Fail-safe)

Hệ thống có các cơ chế nhằm giảm lỗi trạng thái “treo đo”:

- **Timeout measurement**: nếu measurement chạy quá ~40 phút, backend có thể đánh dấu `failed` để cho phép chạy phiên mới.
- **Device offline detection**: nếu không có sensor data trong ~2 phút, backend có thể chặn `start measurement` để tránh tạo session “ảo”.
- **Measurement/data missing**: nếu chạy lâu nhưng không có cập nhật measurement/data, hệ thống có thể cảnh báo và/hoặc fail tùy điều kiện.

Các cơ chế này nhằm đảm bảo tính nhất quán của dữ liệu và tránh tình trạng UI/DB lệch trạng thái so với thiết bị thực.

## Xử lý dữ liệu hậu kỳ bằng Python (Data processing)

Thư mục `server/scripts` được thiết kế để chạy pipeline Python phục vụ xử lý dữ liệu đo (CSV), với các thư viện:
- `pandas`, `numpy`: thao tác dữ liệu và tính toán.
- `scipy`: xử lý tín hiệu (ví dụ low-pass filter).
- `matplotlib`: trực quan hóa.
- `scikit-learn`: tiện ích ML (tiền xử lý/đánh giá).

Tài liệu thiết lập môi trường: `server/scripts/README_SETUP.md`.

Điểm nhấn triển khai:
- Backend có thể **tự động dùng Python trong virtual environment** tại `server/scripts/venv/` (không cần activate thủ công trước khi chạy server), hoặc cấu hình `PYTHON_PATH` trong `.env`.

## Chỉ số đánh giá đề xuất (Evaluation metrics — gợi ý cho phát triển tiếp)

Tùy bài toán đích, có thể áp dụng:

- **Chất lượng dữ liệu/độ ổn định**
  - Tỷ lệ missing per-channel (ADC) theo thời gian.
  - Độ trễ cập nhật (median/p95 data age).
  - Drift theo phiên đo (baseline shift).

- **Mô hình suy luận (nếu có classification)**
  - Accuracy, F1-score (macro/micro), ROC-AUC.
  - Confusion matrix theo lớp mùi/khí.

- **Mô hình hồi quy (nếu ước lượng nồng độ)**
  - MAE/RMSE, \(R^2\), độ ổn định theo nhiệt độ/độ ẩm.

## Giới hạn hiện tại (Limitations)

- Dữ liệu sensor phụ thuộc điều kiện vận hành (nhiệt/ẩm, flow), dễ gây nhiễu nếu chưa có hiệu chuẩn.
- Đồng bộ “phiên đo” giữa thiết bị và backend cần kiểm chứng thêm trong các tình huống mất điện/restart.
- Pipeline Python hiện thiên về setup môi trường; quy trình xử lý/chuẩn hóa dữ liệu cụ thể cần được định nghĩa rõ theo mục tiêu nghiên cứu (feature engineering, baseline correction, normalization…).

## Hướng phát triển (Future work)

- Thiết kế protocol measurement đầy đủ: start/stop, metadata môi trường, nhãn mẫu (labeling).
- Chuẩn hóa schema time-series (index, retention policy) và/hoặc tích hợp TSDB nếu cần.
- Bổ sung module phân tích: tiền xử lý (lọc, drift correction), trích đặc trưng, huấn luyện mô hình, và đánh giá định lượng.
- Nâng cấp UI để trực quan hóa theo phiên đo: overlay, heatmap ADC, và so sánh mẫu.

---

## Phụ lục: Tóm tắt “điểm bám” trong codebase

- **Server entry**: `server/server.js`
- **MQTT listener**: `server/enose-mqtt-listener.js`
- **Routes**: `server/routes/enose.route.js`
- **Controllers**: `server/controllers/enose-device.controller.js`, `server/controllers/enose-control.controller.js`
- **Python setup**: `server/scripts/README_SETUP.md`

