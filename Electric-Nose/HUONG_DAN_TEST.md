# Hướng Dẫn Test Hệ Thống Electric-Nose

## 📋 Mục Lục
1. [Chuẩn Bị](#chuẩn-bị)
2. [Test Dashboard - Hiển Thị Dữ Liệu](#test-dashboard)
3. [Test Nút Đo (Measurement)](#test-nút-đo)
4. [Test Settings - WiFi, Heating, Air Pump](#test-settings)
5. [Test MQTT Communication](#test-mqtt)
6. [Kiểm Tra Lỗi](#kiểm-tra-lỗi)

---

## 🔧 Chuẩn Bị

### 1. Đảm bảo Server đang chạy
```bash
cd Electric-Nose
npm start
```

### 2. Kiểm tra kết nối
- ✅ MongoDB: Server log hiển thị `✅ Successfully connected to MongoDB database`
- ✅ MQTT: Server log hiển thị `✅ MQTT Client connected to broker`
- ✅ MySQL: Server không báo lỗi kết nối

### 3. Truy cập Dashboard
- Mở trình duyệt: `http://localhost:3001/dashboard`
- Đăng nhập nếu cần (token được lưu trong localStorage)

---

## 📊 Test Dashboard - Hiển Thị Dữ Liệu

### Test 1: Hiển thị Sensor Data

**Bước 1:** Publish dữ liệu sensor từ MQTT Explorer hoặc ESP32

**Topic:** `electric-nose/device/ESP32_001/sensor`

**Payload:**
```json
{
  "temperature": 33.5,
  "humidity": 61.2,
  "mems1": 2.45,
  "mems2": 2.38,
  "mems3": 2.52,
  "mems4": 2.41,
  "mems5": 2.47,
  "mems6": 2.39,
  "mems7": 2.44,
  "mems8": 2.46,
  "timestamp": "2025-12-20T04:36:47.553Z"
}
```

**Kiểm tra:**
- ✅ Temperature hiển thị: `33.5°C`
- ✅ Humidity hiển thị: `61%`
- ✅ SHT85 Sensor Card hiển thị đúng giá trị
- ✅ 8 MEMS Sensors Cards hiển thị (mems1 đến mems8)
- ✅ Dữ liệu tự động refresh mỗi 2 giây

### Test 2: Hiển thị Device Status

**Bước 1:** Publish device status từ MQTT Explorer

**Topic:** `electric-nose/device/ESP32_001/status`

**Payload:**
```json
{
  "status": "online",
  "wifi_ssid": "MyWiFi",
  "wifi_signal": -45,
  "wifi_status": "connected",
  "storage": {
    "total": 4096,
    "used": 1024,
    "free": 3072
  },
  "heating_enabled": true,
  "air_pump_enabled": false,
  "wifi_enabled": true
}
```

**Kiểm tra:**
- ✅ Wi-Fi Signal hiển thị: `-45 dBm`
- ✅ SSID hiển thị: `SSID: MyWiFi`
- ✅ Storage Usage hiển thị đúng %
- ✅ Wi-Fi chip ở header hiển thị "Connected" (màu xanh)

### Test 3: Filter và Chart

**Bước 1:** Chọn device từ dropdown
**Bước 2:** Chọn "Từ ngày" và "Đến ngày"
**Bước 3:** Click "Xem biểu đồ"

**Kiểm tra:**
- ✅ Chart Temperature & Humidity hiển thị dữ liệu theo khoảng thời gian
- ✅ Chart MEMS Sensors hiển thị 8 đường line với màu khác nhau
- ✅ Dữ liệu được lọc đúng theo device và thời gian

---

## 🎯 Test Nút Đo (Measurement)

### Test 1: Start Measurement

**Bước 1:** Mở Dashboard (`http://localhost:3001/dashboard`)
**Bước 2:** Click nút **"Start measurement"**

**Kiểm tra:**
- ✅ Nút chuyển sang "Measuring..." và bị disable
- ✅ Status panel hiển thị: `Measurement started: ENose_YYYYMMDD_HHMMSS.csv`
- ✅ Last measurement file được cập nhật
- ✅ Server log hiển thị MQTT publish thành công:
  ```
  📤 Published to electric-nose/device/ESP32_001/measurement/start
  ```

**MQTT Message được gửi:**
- **Topic:** `electric-nose/device/ESP32_001/measurement/start`
- **Payload:**
```json
{
  "command": "start_measurement",
  "file_name": "ENose_20251220_043647.csv",
  "timestamp": "2025-12-20T04:36:47.553Z"
}
```

### Test 2: Nhận Measurement Data từ ESP32

**Bước 1:** ESP32 publish measurement data

**Topic:** `electric-nose/device/ESP32_001/measurement/data`

**Payload:**
```json
{
  "file_name": "ENose_20251220_043647.csv",
  "status": "in_progress",
  "progress": 45,
  "samples_count": 45,
  "measurement_data": {
    "temperature": 33.5,
    "humidity": 61.2,
    "mems1": 2.45,
    "mems2": 2.38
  },
  "started_at": "2025-12-20T04:36:47.553Z"
}
```

**Kiểm tra:**
- ✅ Server log hiển thị: `📈 Measurement data saved from device ESP32_001`
- ✅ MongoDB collection `measurement_data` có document mới
- ✅ Dashboard có thể load measurement files từ API

---

## ⚙️ Test Settings - WiFi, Heating, Air Pump

### Test 1: Truy cập Settings Page

**Bước 1:** Mở `http://localhost:3001/settings`
**Bước 2:** Kiểm tra trạng thái ban đầu

**Kiểm tra:**
- ✅ 3 toggle switches hiển thị (WiFi, Heating, Air Pump)
- ✅ Status boxes hiển thị trạng thái hiện tại
- ✅ Dữ liệu được load từ MongoDB device status

### Test 2: Toggle WiFi

**Bước 1:** Click toggle WiFi (bật/tắt)
**Bước 2:** Kiểm tra server log

**Kiểm tra:**
- ✅ Toggle chuyển đổi mượt mà
- ✅ Status box cập nhật: "Connected" hoặc "Not connected"
- ✅ Server log hiển thị MQTT publish:
  ```
  📤 Published to electric-nose/device/ESP32_001/settings/wifi
  ```
- ✅ MQTT message:
  - **Topic:** `electric-nose/device/ESP32_001/settings/wifi`
  - **Payload:** `{"enabled": true}` hoặc `{"enabled": false}`

### Test 3: Toggle Heating

**Bước 1:** Click toggle Heating
**Kiểm tra:**
- ✅ Status box cập nhật: "Turned on" hoặc "Turned off"
- ✅ MQTT message được gửi đến topic: `electric-nose/device/ESP32_001/settings/heating`

### Test 4: Toggle Air Pump

**Bước 1:** Click toggle Air Pump
**Kiểm tra:**
- ✅ Status box cập nhật đúng
- ✅ MQTT message được gửi đến topic: `electric-nose/device/ESP32_001/settings/air_pump`

### Test 5: ESP32 Phản Hồi Settings

**Bước 1:** ESP32 publish status sau khi nhận settings

**Topic:** `electric-nose/device/ESP32_001/status`

**Payload:**
```json
{
  "status": "online",
  "wifi_enabled": true,
  "heating_enabled": false,
  "air_pump_enabled": true,
  "wifi_ssid": "MyWiFi",
  "wifi_signal": -45,
  "wifi_status": "connected"
}
```

**Kiểm tra:**
- ✅ Settings page tự động refresh và hiển thị trạng thái mới
- ✅ MongoDB device_status được cập nhật

---

## 📡 Test MQTT Communication

### Test 1: Subscribe Topics

**Kiểm tra server log khi khởi động:**
```
✅ Subscribed to: electric-nose/device/+/sensor
✅ Subscribed to: electric-nose/device/+/status
✅ Subscribed to: electric-nose/device/+/measurement/data
```

### Test 2: Publish từ ESP32/MQTT Explorer

**Test Sensor Data:**
- Topic: `electric-nose/device/ESP32_001/sensor`
- Kiểm tra server log: `📨 Received from electric-nose/device/ESP32_001/sensor`
- Kiểm tra MongoDB: Collection `sensor_data` có document mới

**Test Device Status:**
- Topic: `electric-nose/device/ESP32_001/status`
- Kiểm tra server log: `📡 Status update saved from device ESP32_001`
- Kiểm tra MongoDB: Collection `device_status` được cập nhật

**Test Measurement Data:**
- Topic: `electric-nose/device/ESP32_001/measurement/data`
- Kiểm tra server log: `📈 Measurement data saved from device ESP32_001`

### Test 3: Publish từ Server (Control Commands)

**Test Start Measurement:**
- Dashboard click "Start measurement"
- Kiểm tra MQTT Explorer nhận được message tại topic: `electric-nose/device/ESP32_001/measurement/start`

**Test Settings:**
- Settings page toggle WiFi/Heating/Air Pump
- Kiểm tra MQTT Explorer nhận được message tại:
  - `electric-nose/device/ESP32_001/settings/wifi`
  - `electric-nose/device/ESP32_001/settings/heating`
  - `electric-nose/device/ESP32_001/settings/air_pump`

---

## 🔍 Kiểm Tra Lỗi

### Lỗi 1: Dashboard không hiển thị dữ liệu

**Nguyên nhân:**
- MongoDB chưa có dữ liệu
- API endpoint không hoạt động
- Token authentication lỗi

**Giải pháp:**
1. Kiểm tra MongoDB có dữ liệu:
   ```bash
   # Kết nối MongoDB
   mongosh
   use electric_nose
   db.sensor_data.find().limit(5)
   ```
2. Kiểm tra API trong browser console:
   - F12 → Network tab
   - Xem request `/api/devices/data/latest` có lỗi không
3. Kiểm tra token trong localStorage:
   ```javascript
   localStorage.getItem('token')
   ```

### Lỗi 2: MQTT không nhận được message

**Nguyên nhân:**
- MQTT broker không kết nối được
- Topic không đúng format
- Username/password sai

**Giải pháp:**
1. Kiểm tra `.env` file:
   ```
   MQTT_BROKER_URL=mqtt://103.1.238.175:1883
   MQTT_USERNAME=test
   MQTT_PASSWORD=testadmin
   ```
2. Kiểm tra server log:
   - `✅ MQTT Client connected to broker`
   - Nếu có lỗi `ECONNREFUSED`, kiểm tra broker có đang chạy không
3. Test với MQTT Explorer:
   - Kết nối đến broker
   - Subscribe topic: `electric-nose/device/+/sensor`
   - Publish test message

### Lỗi 3: Settings không cập nhật

**Nguyên nhân:**
- Device chưa tồn tại trong MySQL
- MQTT message không được gửi
- ESP32 không nhận được message

**Giải pháp:**
1. Kiểm tra device có trong MySQL:
   ```sql
   SELECT * FROM devices WHERE device_id = 'ESP32_001';
   ```
2. Kiểm tra server log khi toggle settings
3. Kiểm tra MQTT Explorer có nhận được message không

### Lỗi 4: Measurement không start

**Nguyên nhân:**
- Không có device trong database
- MQTT publish lỗi
- API endpoint lỗi

**Giải pháp:**
1. Kiểm tra device:
   ```sql
   SELECT * FROM devices WHERE delete_flag = 0 LIMIT 1;
   ```
2. Kiểm tra browser console khi click nút
3. Kiểm tra server log có MQTT publish không

---

## ✅ Checklist Test Hoàn Chỉnh

### Dashboard
- [ ] Hiển thị Temperature và Humidity
- [ ] Hiển thị 8 MEMS sensors
- [ ] Hiển thị Wi-Fi signal và SSID
- [ ] Hiển thị Storage usage
- [ ] Chart Temperature & Humidity hoạt động
- [ ] Chart MEMS Sensors hoạt động
- [ ] Filter theo device và thời gian hoạt động
- [ ] Auto-refresh dữ liệu

### Measurement
- [ ] Nút "Start measurement" hoạt động
- [ ] MQTT message được gửi đúng topic
- [ ] Measurement data được lưu vào MongoDB
- [ ] Last measurement file được cập nhật

### Settings
- [ ] Toggle WiFi hoạt động
- [ ] Toggle Heating hoạt động
- [ ] Toggle Air Pump hoạt động
- [ ] MQTT messages được gửi đúng topic
- [ ] Status boxes cập nhật đúng

### MQTT
- [ ] Server subscribe đúng topics
- [ ] Nhận sensor data từ ESP32
- [ ] Nhận device status từ ESP32
- [ ] Nhận measurement data từ ESP32
- [ ] Publish control commands thành công
- [ ] Publish settings commands thành công

### Database
- [ ] MongoDB lưu sensor_data
- [ ] MongoDB lưu device_status
- [ ] MongoDB lưu measurement_data
- [ ] MySQL tự động tạo device nếu chưa có
- [ ] MySQL lưu control_history

---

## 📞 Hỗ Trợ

Nếu gặp lỗi, kiểm tra:
1. Server log trong terminal
2. Browser console (F12)
3. MongoDB collections
4. MySQL tables
5. MQTT Explorer messages

**Lưu ý:** Đảm bảo ESP32 firmware đang publish đúng format JSON và topics như trong hướng dẫn này.

