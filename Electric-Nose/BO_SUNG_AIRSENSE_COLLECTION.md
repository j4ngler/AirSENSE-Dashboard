# BỔ SUNG ĐỌC DỮ LIỆU TỪ COLLECTION 'sensor' CHUNG CỦA AIRSENSE

## 📋 Tổng quan

Đã bổ sung các functions và routes để đọc dữ liệu từ collection `sensor` chung của AirSENSE, nơi dữ liệu từ Electric-Nose được lưu bởi Ingestor service.

## ✅ Các file đã được bổ sung/sửa đổi

### 1. Model mới: `server/models/mongoDB/sensor.model.js`
- Model để đọc từ collection `sensor` chung của AirSENSE
- Schema: `{ topic, time, content }`
- Topic format: `electric-nose/<device_id>/sensor-data`
- Có virtual method `device_id` để extract từ topic
- Có method `toSensorData()` để format dữ liệu cho frontend

### 2. Controller: `server/controllers/device.controller.js`
Đã thêm 3 functions mới:

#### `getLatestSensorDataFromAirSENSE(req, res)`
- Lấy dữ liệu sensor mới nhất từ collection `sensor`
- Hỗ trợ filter theo `deviceId` (từ params hoặc query)
- Trả về format: `{ device_id, timestamp, timestamp_iso, temperature, humidity, adc[] }`

#### `getMeasurementHistoryFromAirSENSE(req, res)`
- Lấy lịch sử đo từ collection `sensor`
- Hỗ trợ filter theo `deviceId`, `limit`, `from_time`, `to_time`
- Trả về mảng dữ liệu đã format

#### `getDeviceListFromAirSENSE(req, res)`
- Lấy danh sách tất cả devices có dữ liệu trong collection `sensor`
- Trả về thông tin: `device_id`, `topic`, `last_seen`, `last_seen_timestamp`

### 3. Routes: `server/routes/device.route.js`
Đã thêm 5 routes mới:

- `GET /api/devices/airsense/devices` - Danh sách devices
- `GET /api/devices/airsense/latest` - Dữ liệu mới nhất (tất cả)
- `GET /api/devices/:id/airsense/latest` - Dữ liệu mới nhất theo device ID
- `GET /api/devices/airsense/history` - Lịch sử đo (tất cả)
- `GET /api/devices/:id/airsense/history` - Lịch sử đo theo device ID

### 4. Dashboard: `server/View/home/dashboard.ejs`
Đã thêm JavaScript functions:

- `loadDeviceListFromAirSENSE()` - Load danh sách devices
- `loadLatestSensorDataFromAirSENSE()` - Load dữ liệu mới nhất
- `loadMeasurementHistoryFromAirSENSE()` - Load lịch sử đo
- `updateChartsFromAirSENSE()` - Cập nhật charts với dữ liệu mới
- `startAirSENSERefresh()` - Auto-refresh mỗi 5 giây

Dashboard sẽ tự động:
1. Load danh sách devices khi trang load
2. Load dữ liệu mới nhất mỗi 5 giây
3. Cập nhật charts với dữ liệu lịch sử

### 5. Tài liệu: `API_AIRSENSE_COLLECTION.md`
- Tài liệu chi tiết về các API mới
- Examples sử dụng
- So sánh với API cũ

## 🔄 Luồng dữ liệu

```
[ESP32 Firmware]
    ↓ (MQTT publish)
[ElectricNose_Ingestor]
    ↓ (Lưu vào MongoDB)
[Collection 'sensor' - AirSENSE common]
    ↓ (Đọc qua API mới)
[Electric-Nose Dashboard]
    ↓ (Hiển thị real-time)
[User Interface]
```

## 📊 Schema dữ liệu

### Collection `sensor` (AirSENSE common)
```javascript
{
  topic: "electric-nose/<device_id>/sensor-data",
  time: 1730090000, // epoch seconds
  content: {
    Temperature: 27.5,
    Humidity: 61.2,
    ADC0: 123,
    ADC1: 456,
    ADC2: 789,
    ADC3: 101,
    ADC4: 112,
    ADC5: 131,
    ADC6: 415,
    ADC7: 161
  }
}
```

### Response format
```javascript
{
  success: true,
  data: {
    device_id: "device001",
    timestamp: 1730090000,
    timestamp_iso: "2025-01-15T10:30:00.000Z",
    temperature: 27.5,
    humidity: 61.2,
    adc: [123, 456, 789, 101, 112, 131, 415, 161]
  }
}
```

## 🚀 Cách sử dụng

### 1. Đảm bảo MongoDB đã có dữ liệu
- Kiểm tra collection `sensor` có dữ liệu với topic pattern `electric-nose/*/sensor-data`
- Nếu chưa có, cần chạy Ingestor service để lưu dữ liệu từ MQTT

### 2. Khởi động server
```bash
cd Electric-Nose
npm start
```

### 3. Truy cập dashboard
```
http://localhost:3001/home/dashboard
```

Dashboard sẽ tự động:
- Load danh sách devices
- Load và hiển thị dữ liệu mới nhất
- Auto-refresh mỗi 5 giây

### 4. Test API bằng curl
```bash
# Lấy danh sách devices
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/devices/airsense/devices

# Lấy dữ liệu mới nhất
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/devices/device001/airsense/latest

# Lấy lịch sử đo
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/devices/device001/airsense/history?limit=100
```

## ⚠️ Lưu ý

1. **Collection name:** Collection phải là `sensor` (không phải `sensor_data`)
2. **Topic format:** Topic phải theo format `electric-nose/<device_id>/sensor-data`
3. **Time format:** Thời gian phải là epoch seconds (Unix timestamp)
4. **Authentication:** Tất cả API đều yêu cầu authentication token
5. **MongoDB connection:** Đảm bảo MongoDB đã được kết nối trong `server.js`

## 🔍 Kiểm tra

### Kiểm tra MongoDB có dữ liệu
```javascript
// Trong MongoDB shell hoặc Compass
use <database_name>
db.sensor.find({ topic: /^electric-nose\/.+\/sensor-data$/ }).limit(5)
```

### Kiểm tra API hoạt động
```bash
# Test với Postman hoặc curl
GET http://localhost:3001/api/devices/airsense/devices
Headers: Authorization: Bearer <token>
```

## 📝 TODO (Nếu cần)

- [ ] Thêm pagination cho history API
- [ ] Thêm filter theo temperature/humidity range
- [ ] Thêm export data to CSV/Excel
- [ ] Thêm real-time WebSocket updates
- [ ] Thêm caching để tăng performance

## 🎯 Kết quả

Sau khi bổ sung, hệ thống có thể:
✅ Đọc dữ liệu từ collection `sensor` chung của AirSENSE
✅ Hiển thị dữ liệu real-time trên dashboard
✅ Lấy lịch sử đo và hiển thị trên charts
✅ Hỗ trợ nhiều devices cùng lúc
✅ Auto-refresh dữ liệu mỗi 5 giây

