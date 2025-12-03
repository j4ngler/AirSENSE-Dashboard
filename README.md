# AirSENSE Vietnam

AirSENSE Vietnam là một monorepo tập hợp nhiều dịch vụ Node.js, cron worker và các ứng dụng React phục vụ bài toán quan trắc không khí (Electric Nose) và hệ thống chấm công/khảo sát. Dữ liệu từ thiết bị ngoài thực địa được đẩy qua MQTT, xử lý bởi các dịch vụ backend, lưu vào MongoDB/MySQL rồi hiển thị trên những portal riêng cho admin, khách hàng và người dùng nội bộ.

## Kiến trúc tổng thể
- Tầng thiết bị → MQTT: cảm biến AirSENSE phát topic lên broker nội bộ `mqttBroker` (Mosca) hoặc broker cấu hình qua biến môi trường `APP_MQTT`. Công cụ `mqtt_tool` hỗ trợ bắn dữ liệu giả lập để thử nghiệm nhanh.
- Tầng worker/cron: `MQTT_Broker`, `mqtt_client`, `attendance_system`, `calculation_data`, `DuplicateServer` thu nhận MQTT, chuẩn hóa và đồng bộ dữ liệu giữa MQTT ↔ MongoDB/MySQL/InfluxDB.
- Tầng dịch vụ web backend: `Electric-Nose/server` và `WebManage/server` cung cấp REST API, trang EJS và tích hợp Redis cho các portal quản trị.
- Tầng giao diện React: `reactjs_admin`, `react_customer`, `react_comment`, `attendance_view` là những ứng dụng chuyên biệt cho admin, khách hàng, chức năng bình luận và theo dõi chấm công.

## Cây thư mục chính

```
AirSENSE-Vietnam-main/
|-- attendance_system/      # REST + MQTT server ghi lịch sử/trạng thái thiết bị (Mongo + MySQL)
|-- attendance_view/        # Frontend React quản lý chấm công (Create React App)
|-- calculation_data/       # Cron job tính toán, đồng bộ dữ liệu (Mongo + MySQL)
|-- DuplicateServer/        # Worker nhân bản dữ liệu giữa 2 cụm Mongo
|-- Electric-Nose/          # Backend Electric Nose (Node/Express + MySQL + EJS)
|-- mqttBroker/             # Mosca broker port 1883 (tài khoản test/testadmin)
|-- MQTT_Broker/            # Worker ghi dữ liệu MQTT → Mongo/Influx
|-- mqtt_client/            # REST + MQTT client phục vụ comment/status
|-- mqtt_tool/              # CLI cron publish bản tin mẫu lên MQTT
|-- reactjs_admin/          # React Admin portal (webpack dev server port 3020)
|-- react_comment/          # React portal bình luận (port 3005)
|-- react_customer/         # React portal khách hàng (port 3006)
|-- react_customer/buildCustomer & attendance_view/buildAttendance # bản build sản phẩm
|-- WebManage/              # Backend + sale UI quản lý Electric Nose
`-- README.md               # Tài liệu tổng hợp (file này)
```

## Yêu cầu môi trường chung
- Node.js LTS (>= 16) và npm hoặc yarn.
- MongoDB cho các dịch vụ history/status (`attendance_system`, `mqtt_client`, `calculation_data`, `WebManage`, `Electric-Nose`).
- MySQL cho `Electric-Nose`, `WebManage`, một phần `mqtt_client` và `calculation_data`. Thư mục `Sql/` (Electric-Nose, WebManage) chứa file import mẫu.
- Redis (được sử dụng trong `WebManage/server.js`) và một MQTT broker (có thể dùng `mqttBroker` nội bộ hoặc broker ngoài).
- Công cụ hỗ trợ: `forever` hoặc `pm2` nếu cần chạy nền (README gốc khuyến nghị `forever start ...` cho các worker).

## Hướng dẫn từng thành phần

### 1. Nhóm Attendance (log + giao diện)

**attendance_system/**
- Vai trò: cung cấp API `/api/history`, `/api/status`, đồng thời chạy MQTT broker `aedes` để nhận dữ liệu và ghi log vào MongoDB/MySQL.
- Công nghệ: Express, Aedes, Mongoose, Knex.
- Biến môi trường chính: `APP_HOST`, `APP_PORT`, `APP_MONGO`, `APP_MONGO_PORT`, `APP_MONGO_USER`, `APP_MONGO_PASS`, `APP_MONGO_TABLE`, `DB_CLIENT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- Lệnh chạy:
  ```
  cd attendance_system
  npm install
  npm start   # nodemon server.js
  ```

**mqtt_client/**
- Vai trò: kết nối broker (qua `APP_MQTT_*`), đồng bộ trạng thái thiết bị vào MongoDB và cung cấp API CRUD.
- Công nghệ: Express, MQTT.js, Mongoose, Knex.
- Biến môi trường: giống `attendance_system` + `APP_MQTT`, `APP_MQTT_PORT`, `APP_MQTT_USER`, `APP_MQTT_PASS`.
- Chạy: `npm install && npm start`.

**attendance_view/**
- Vai trò: giao diện React hiển thị bảng chấm công/trạng thái.
- Công nghệ: Create React App + Ant Design (port mặc định 3005 theo `package.json`).
- Thiết lập: `npm install`, `npm start`. Có thể cấu hình endpoint API qua `.env`.

### 2. Nhóm MQTT / đường ống dữ liệu

**mqttBroker/**
- Vai trò: broker Mosca nội bộ (port 1883) với tài khoản mặc định `test/testadmin`.
- Cách chạy: `npm install`, `node MqttBroker1885.js`. Tùy chỉnh port/credential trực tiếp trong file nếu cần.

**MQTT_Broker/**
- Vai trò: worker `ListenAndSave.js` kết nối broker ngoài (APP_MQTT_*), ghi dữ liệu về Mongo/Influx và lập lịch bằng `node-cron`.
- Biến môi trường: `APP_MQTT`, `APP_MQTT_PORT`, `APP_MQTT_USER`, `APP_MQTT_PASS`, `APP_MONGO`, `APP_MONGO_PORT`, `APP_MONGO_USER`, `APP_MONGO_PASS`, `APP_MONGO_TABLE`.
- Lệnh: `npm install`, `npm start` (nodemon ListenAndSave.js) hoặc `forever start ListenAndSave.js`.

**calculation_data/**
- Vai trò: cron `index.js` xử lý block dữ liệu, đọc từ Mongo/SQL và ghi kết quả sang bảng khác.
- Biến môi trường: `APP_MONGO*`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- Lệnh: `npm install`, `npm start`.

**DuplicateServer/**
- Vai trò: worker `service/cronJob.js` gọi `BlockMemory` để di chuyển dữ liệu giữa cluster Mongo READ/WRITE theo từng block 60 giây.
- Biến môi trường: `APP_MONGO_*_READ`, `APP_MONGO_*_WRITE` (host, port, user, password, table).
- Lệnh: `npm install`, `node index.js` (cron 10 giây).

**mqtt_tool/**
- Vai trò: script CLI mô phỏng publish dữ liệu (cron 10 giây) lên topic `myTopic/1` hoặc các ID sensor.
- Biến môi trường: `MQTT_BROKER_URL`, `MQTT_BROKER_PORT`, `MQTT_USER`, `MQTT_PASS`.
- Lệnh: `npm install`, `npm start` (node index.js).

### 3. Backend Electric Nose / WebManage

**Electric-Nose/**
- Vai trò: backend Express + EJS (`server/server.js`) cho hệ thống Electric Nose.
- Biến môi trường (theo `readme.txt`): `DB_CLIENT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `APP_PORT`, `APP_HOST`.
- Thiết lập:
  1. `npm install`
  2. Khởi động MySQL, tạo DB `electric_nose`, import `Sql/filesql.sql`.
  3. Tạo `.env` theo hướng dẫn và chạy `npm start` hoặc `node server/server.js` (mặc định http://localhost:3001).

**WebManage/**
- Vai trò: backend tổng hợp (Express + Mongo + MySQL + EJS) phục vụ sale/public và API `/api`.
- Cấu trúc: code backend nằm trong `server/`, phần sale/public đã build ở `sale/`.
- Biến môi trường: `APP_HOST`, `APP_PORT`, `APP_MONGO*`, cấu hình MySQL trong `knexfile.js`, thông số Redis (được sử dụng trong `server/server.js`).
- Thiết lập:
  1. `npm install`
  2. Tạo DB MySQL `airsense`, import `Sql/filesql.sql`.
  3. Cài Redis nếu muốn dùng cache.
  4. Thiết lập `.env`, chạy `npm start` hoặc `node server/server.js`.

### 4. Các portal React

| Thư mục          | Mô tả                                      | Script chính                                                                           |
|------------------|-------------------------------------------|----------------------------------------------------------------------------------------|
| `reactjs_admin`  | Portal admin (react-admin + webpack dev). | `npm install`, `npm run startx` (webpack dev server port 3020) hoặc `npm start` (CRA). |
| `react_comment`  | Trang bình luận (CRA port 3005).          | `npm install`, `npm start`.                                                            |
| `react_customer` | Trang khách hàng (bản đồ, biểu đồ) 3006.  | `npm install`, `npm start`.                                                            |

Các app CRA đều có script `build`, `test` mặc định, bản build nằm trong `build`, `buildCustomer`, `buildAttendance` tương ứng.

## Quy trình khởi động gợi ý
1. Chuẩn bị hạ tầng: bật MongoDB, MySQL, Redis và một MQTT broker (có thể chạy `node mqttBroker/MqttBroker1885.js`).
2. Chuẩn hóa file `.env` cho từng dịch vụ (tham khảo `.env` mẫu trong mỗi thư mục, tránh commit thông tin nhạy cảm).
3. Khởi động các worker dữ liệu: `MQTT_Broker`, `mqtt_client`, `attendance_system`, `calculation_data`, `DuplicateServer`.
4. Khởi động các backend phục vụ UI: `Electric-Nose`, `WebManage`.
5. Cuối cùng chạy các portal React (`attendance_view`, `reactjs_admin`, `react_comment`, `react_customer`) để kiểm tra hiển thị.

Tài liệu này giúp hệ thống lại những module chính và các điểm cấu hình quan trọng. Để tìm hiểu sâu hơn (API chi tiết, cấu trúc DB), hãy đọc README riêng trong từng thư mục hoặc xem trực tiếp code trong `routes/`, `models/`.
