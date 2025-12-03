# HƯỚNG DẪN TEST VÀ KIỂM TRA TÍCH HỢP E-NOSE VÀO AIRSENSE

## ✅ CÁC BƯỚC ĐÃ HOÀN THÀNH

- [x] Bước 2: Tích hợp Routes vào WebManage
- [x] Bước 3: Copy Views vào WebManage
- [x] Bước 4: Copy Controllers vào WebManage
- [x] Bước 5: Thêm Menu vào Navigation
- [x] Bước 6: Cấu hình Database (đã làm ở bước 4)
- [x] Bước 7: Cấu hình MQTT (đã làm ở bước 4)

## 🔧 KIỂM TRA TRƯỚC KHI TEST

### 1. Kiểm tra Database

```bash
# Kiểm tra database electric_nose đã được tạo
mysql -u root -p -e "SHOW DATABASES LIKE 'electric_nose';"

# Kiểm tra các bảng đã được import
mysql -u root -p -e "USE electric_nose; SHOW TABLES;"
```

**Các bảng cần có:**
- `devices`
- `control_history`
- `device_data`
- `users`
- `permissions`

### 2. Kiểm tra .env Configuration

Đảm bảo file `.env` của WebManage có các biến sau:

```env
# Database AirSENSE (đã có sẵn)
DB_CLIENT=mysql
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=airsense

# Database E-Nose (Optional - nếu dùng database riêng)
ENOSE_DB_CLIENT=mysql
ENOSE_DB_HOST=127.0.0.1
ENOSE_DB_USER=root
ENOSE_DB_PASSWORD=
ENOSE_DB_NAME=electric_nose

# MQTT (Optional - nếu dùng MQTT riêng)
ENOSE_MQTT_BROKER_URL=mqtt://localhost:1883
# Hoặc dùng chung
APP_MQTT=mqtt://localhost:1883
```

### 3. Kiểm tra Files đã được tạo

```bash
# Kiểm tra routes
ls WebManage/server/routes/enose-*.route.js

# Kiểm tra controllers
ls WebManage/server/controllers/enose*.js

# Kiểm tra views
ls WebManage/server/View/enose/*.ejs

# Kiểm tra config
ls WebManage/server/config/enoseDatabase.js
```

## 🧪 TEST CÁC CHỨC NĂNG

### Test 1: Kiểm tra Routes

```bash
# Khởi động server
cd WebManage
npm start

# Test page routes (không cần auth)
curl http://localhost:3000/enose/dashboard
curl http://localhost:3000/enose/settings
curl http://localhost:3000/enose/login
```

**Kết quả mong đợi:** Trả về HTML pages

### Test 2: Test API Endpoints (Cần Authentication)

#### 2.1. Đăng nhập để lấy token

```bash
# Đăng nhập
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your_email@example.com","password":"your_password"}'
```

**Lưu token từ response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2.2. Test API với token

```bash
# Thay YOUR_TOKEN bằng token vừa lấy
TOKEN="YOUR_TOKEN"

# Test system status
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/enose/control/status

# Test latest sensor data
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/enose/devices/data/latest

# Test measurement history
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/enose/devices/data/history?limit=10

# Test get settings
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/enose/control/settings

# Test get last measurement
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/enose/control/measurement/last
```

**Kết quả mong đợi:** Trả về JSON với format:
```json
{
  "result": {
    // data here
  }
}
```

### Test 3: Test MQTT Commands

#### 3.1. Test Start Measurement

```bash
curl -X POST http://localhost:3000/api/enose/control/measurement/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Kết quả mong đợi:**
```json
{
  "result": {
    "success": true,
    "message": "Đã bắt đầu đo",
    "device_id": 1,
    "file_name": "ENose_20241201_120000.csv",
    "started_at": "2024-12-01T12:00:00.000Z"
  }
}
```

#### 3.2. Test Update Settings

```bash
curl -X PUT http://localhost:3000/api/enose/control/settings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"wifi": true, "heating": false, "air_pump": true}'
```

**Kết quả mong đợi:**
```json
{
  "result": {
    "success": true,
    "message": "Cập nhật cài đặt thành công"
  }
}
```

### Test 4: Test Frontend Pages

1. **Mở browser:** `http://localhost:3000`

2. **Kiểm tra menu:**
   - Click vào "Các dự án" → Phải thấy dropdown với:
     - Smart Home
     - IoT Đầm Tôm
     - E-Nose

3. **Truy cập E-Nose Dashboard:**
   - Click "E-Nose" trong menu
   - Hoặc truy cập trực tiếp: `http://localhost:3000/enose/dashboard`

4. **Kiểm tra Dashboard:**
   - Hiển thị nhiệt độ, độ ẩm
   - Hiển thị Wi-Fi status
   - Hiển thị storage info
   - Có nút "Start measurement"
   - Có biểu đồ measurement history
   - Hiển thị tên file đo gần nhất

5. **Truy cập Settings:**
   - Click vào "Settings" hoặc truy cập: `http://localhost:3000/enose/settings`
   - Kiểm tra các toggle:
     - Wi-Fi
     - Heating sensor
     - Air pump

## 🐛 XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 1: `Cannot find module '../config/enoseDatabase.js'`

**Nguyên nhân:** File config chưa được tạo

**Giải pháp:**
```bash
# Kiểm tra file có tồn tại không
ls WebManage/server/config/enoseDatabase.js

# Nếu không có, tạo lại theo hướng dẫn bước 4
```

### Lỗi 2: `Access denied for user` (Database)

**Nguyên nhân:** Sai thông tin database trong `.env`

**Giải pháp:**
- Kiểm tra lại `ENOSE_DB_USER`, `ENOSE_DB_PASSWORD` trong `.env`
- Đảm bảo user có quyền truy cập database `electric_nose`

### Lỗi 3: `Table 'electric_nose.devices' doesn't exist`

**Nguyên nhân:** Chưa import database schema

**Giải pháp:**
```bash
# Import schema
mysql -u root -p electric_nose < Electric-Nose/Sql/filesql.sql
```

### Lỗi 4: `401 Unauthorized` khi gọi API

**Nguyên nhân:** Token không hợp lệ hoặc hết hạn

**Giải pháp:**
- Đăng nhập lại để lấy token mới
- Kiểm tra token có được gửi đúng trong header không

### Lỗi 5: `404 Not Found` cho routes

**Nguyên nhân:** Routes chưa được đăng ký đúng

**Giải pháp:**
- Kiểm tra `WebManage/server/routes/index.route.js` có import và use routes E-Nose chưa
- Kiểm tra `WebManage/server/server.js` có mount routes chưa

### Lỗi 6: MQTT không kết nối

**Nguyên nhân:** MQTT broker chưa chạy hoặc sai URL

**Giải pháp:**
- Kiểm tra MQTT broker đang chạy: `netstat -an | grep 1883`
- Kiểm tra `ENOSE_MQTT_BROKER_URL` hoặc `APP_MQTT` trong `.env`

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Database `electric_nose` đã được tạo
- [ ] Schema đã được import
- [ ] `.env` đã được cấu hình đúng
- [ ] Server WebManage đã khởi động thành công
- [ ] Menu "Các dự án" hiển thị E-Nose
- [ ] Trang `/enose/dashboard` load được
- [ ] Trang `/enose/settings` load được
- [ ] API `/api/enose/control/status` trả về data
- [ ] API `/api/enose/devices/data/latest` trả về data
- [ ] MQTT commands hoạt động (nếu có broker)

## 🎯 KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành tất cả các bước:
- ✅ E-Nose xuất hiện trong menu "Các dự án"
- ✅ Dashboard hiển thị đầy đủ thông tin
- ✅ Settings page hoạt động
- ✅ API endpoints trả về data đúng format
- ✅ MQTT commands được gửi thành công
- ✅ Không có lỗi trong console/logs

## 📝 GHI CHÚ

- Nếu dùng database chung với AirSENSE, đảm bảo không có conflict tên bảng
- Nếu dùng MQTT riêng, đảm bảo broker đang chạy
- Token authentication dùng chung với AirSENSE, không cần tạo riêng

