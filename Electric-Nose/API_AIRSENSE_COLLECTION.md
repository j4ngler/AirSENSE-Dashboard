# API ĐỌC DỮ LIỆU TỪ COLLECTION 'sensor' CHUNG CỦA AIRSENSE

## 📋 Tổng quan

Các API này đọc dữ liệu từ collection `sensor` chung của AirSENSE, nơi dữ liệu từ Electric-Nose được lưu bởi Ingestor service.

**Schema của collection `sensor`:**
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

## 🔗 Danh sách API

### 1. Lấy danh sách devices có dữ liệu

**Endpoint:** `GET /api/devices/airsense/devices`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "result": {
    "success": true,
    "count": 2,
    "devices": [
      {
        "device_id": "device001",
        "topic": "electric-nose/device001/sensor-data",
        "last_seen": "2025-01-15T10:30:00.000Z",
        "last_seen_timestamp": 1736941800
      }
    ]
  }
}
```

---

### 2. Lấy dữ liệu sensor mới nhất (tất cả devices)

**Endpoint:** `GET /api/devices/airsense/latest`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "result": {
    "success": true,
    "data": {
      "device_id": "device001",
      "timestamp": 1736941800,
      "timestamp_iso": "2025-01-15T10:30:00.000Z",
      "temperature": 27.5,
      "humidity": 61.2,
      "adc": [123, 456, 789, 101, 112, 131, 415, 161]
    }
  }
}
```

---

### 3. Lấy dữ liệu sensor mới nhất theo device ID

**Endpoint:** `GET /api/devices/:id/airsense/latest`

**Parameters:**
- `id` (path): Device ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "result": {
    "success": true,
    "data": {
      "device_id": "device001",
      "timestamp": 1736941800,
      "timestamp_iso": "2025-01-15T10:30:00.000Z",
      "temperature": 27.5,
      "humidity": 61.2,
      "adc": [123, 456, 789, 101, 112, 131, 415, 161]
    }
  }
}
```

---

### 4. Lấy lịch sử đo (tất cả devices)

**Endpoint:** `GET /api/devices/airsense/history`

**Query Parameters:**
- `limit` (optional): Số lượng bản ghi (default: 100)
- `from_time` (optional): Thời gian bắt đầu (epoch seconds)
- `to_time` (optional): Thời gian kết thúc (epoch seconds)

**Headers:**
```
Authorization: Bearer <token>
```

**Example:**
```
GET /api/devices/airsense/history?limit=50&from_time=1736940000&to_time=1736943600
```

**Response:**
```json
{
  "result": {
    "success": true,
    "count": 50,
    "data": [
      {
        "timestamp": 1736941800,
        "timestamp_iso": "2025-01-15T10:30:00.000Z",
        "temperature": 27.5,
        "humidity": 61.2,
        "adc": [123, 456, 789, 101, 112, 131, 415, 161]
      }
    ]
  }
}
```

---

### 5. Lấy lịch sử đo theo device ID

**Endpoint:** `GET /api/devices/:id/airsense/history`

**Parameters:**
- `id` (path): Device ID

**Query Parameters:**
- `limit` (optional): Số lượng bản ghi (default: 100)
- `from_time` (optional): Thời gian bắt đầu (epoch seconds)
- `to_time` (optional): Thời gian kết thúc (epoch seconds)

**Headers:**
```
Authorization: Bearer <token>
```

**Example:**
```
GET /api/devices/device001/airsense/history?limit=100
```

**Response:**
```json
{
  "result": {
    "success": true,
    "count": 100,
    "data": [
      {
        "timestamp": 1736941800,
        "timestamp_iso": "2025-01-15T10:30:00.000Z",
        "temperature": 27.5,
        "humidity": 61.2,
        "adc": [123, 456, 789, 101, 112, 131, 415, 161]
      }
    ]
  }
}
```

---

## 🔧 Sử dụng trong Frontend

### JavaScript Example

```javascript
// Lấy danh sách devices
async function loadDevices() {
  const response = await fetch('/api/devices/airsense/devices', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const result = await response.json();
  console.log('Devices:', result.result.devices);
}

// Lấy dữ liệu mới nhất
async function loadLatestData(deviceId) {
  const response = await fetch(`/api/devices/${deviceId}/airsense/latest`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const result = await response.json();
  if (result.result.success) {
    console.log('Latest data:', result.result.data);
  }
}

// Lấy lịch sử đo
async function loadHistory(deviceId, limit = 100) {
  const response = await fetch(`/api/devices/${deviceId}/airsense/history?limit=${limit}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const result = await response.json();
  if (result.result.success) {
    console.log('History:', result.result.data);
  }
}
```

---

## ⚠️ Lưu ý

1. **Topic Format:** Topic phải theo format `electric-nose/<device_id>/sensor-data`
2. **Time Format:** Thời gian được lưu dưới dạng epoch seconds (Unix timestamp)
3. **ADC Values:** Mảng 8 giá trị ADC (ADC0 đến ADC7)
4. **Authentication:** Tất cả API đều yêu cầu authentication token
5. **Collection:** Dữ liệu được lưu trong collection `sensor` chung của AirSENSE

---

## 📊 So sánh với API cũ

| API cũ | API mới (AirSENSE collection) |
|--------|------------------------------|
| `/api/devices/data/latest` | `/api/devices/airsense/latest` |
| `/api/devices/data/history` | `/api/devices/airsense/history` |
| Collection: `sensor_data` | Collection: `sensor` (chung) |
| Schema riêng | Schema chung với AirSENSE |

---

## 🚀 Tích hợp vào Dashboard

Dashboard đã được cập nhật để tự động:
1. Load danh sách devices từ AirSENSE collection
2. Load dữ liệu mới nhất mỗi 5 giây
3. Load lịch sử đo và cập nhật charts
4. Hỗ trợ chọn device từ dropdown (nếu có)

Xem file `server/View/home/dashboard.ejs` để biết chi tiết implementation.

