# HƯỚNG DẪN TÍCH HỢP E-NOSE VÀO AIRSENSE

## 🎯 MỤC TIÊU

Tích hợp E-Nose thành một dịch vụ con trong hệ thống AirSENSE, tương tự như:
- `/smart_home/power_measure` (Smart Home)
- `/IoT_dam_tom/measure` (IoT Đầm Tôm)

## 📋 CÁC BƯỚC THỰC HIỆN

### Bước 1: Copy Controllers và Routes vào WebManage

#### 1.1. Copy Controllers

```bash
# Copy controllers từ Electric-Nose sang WebManage
cp Electric-Nose/server/controllers/control.controller.js WebManage/server/controllers/enose.controller.js
cp Electric-Nose/server/controllers/device.controller.js WebManage/server/controllers/enose-device.controller.js
```

**Lưu ý:** Đổi tên để tránh conflict:
- `control.controller.js` → `enose.controller.js`
- `device.controller.js` → `enose-device.controller.js`

#### 1.2. Copy Routes

```bash
# Copy routes
cp Electric-Nose/server/routes/control.route.js WebManage/server/routes/enose-control.route.js
cp Electric-Nose/server/routes/device.route.js WebManage/server/routes/enose-device.route.js
```

**Sửa trong routes:**
- Đổi `require("../controllers/control.controller")` → `require("../controllers/enose.controller")`
- Đổi `require("../controllers/device.controller")` → `require("../controllers/enose-device.controller")`

### Bước 2: Tích hợp Routes vào WebManage

#### 2.1. Thêm API Routes vào `WebManage/server/routes/index.route.js`

```javascript
const express = require("express");
const authRoutes = require("./auth.route.js");
const userRoutes = require("./user.route.js");
// ... existing routes ...
const enoseControlRoutes = require("./enose-control.route.js");
const enoseDeviceRoutes = require("./enose-device.route.js");
const router = express.Router();

// ... existing routes ...

// E-Nose routes
router.use("/enose/control", enoseControlRoutes);
router.use("/enose/devices", enoseDeviceRoutes);

module.exports = router;
```

#### 2.2. Thêm Pages Routes vào `WebManage/server/routes/pages.route.js`

```javascript
// E-Nose pages
router.get("/enose/dashboard", (req, res) => {
  res.render("enose/dashboard", { route: "enose", title: "E-Nose Dashboard" });
});

router.get("/enose/settings", (req, res) => {
  res.render("enose/settings", { route: "enose", title: "E-Nose Settings" });
});

router.get("/enose/login", (req, res) => {
  res.render("enose/login", { route: "enose" });
});
```

### Bước 3: Copy Views vào WebManage

```bash
# Tạo thư mục enose trong WebManage
mkdir -p WebManage/server/View/enose

# Copy views
cp Electric-Nose/server/View/home/dashboard.ejs WebManage/server/View/enose/dashboard.ejs
cp Electric-Nose/server/View/home/settings.ejs WebManage/server/View/enose/settings.ejs
cp Electric-Nose/server/View/authen/login.ejs WebManage/server/View/enose/login.ejs
```

**Sửa trong views:**
- Đổi các API endpoint từ `/api/control/...` → `/api/enose/control/...`
- Đổi các API endpoint từ `/api/devices/...` → `/api/enose/devices/...`
- Cập nhật các link navigation để phù hợp với cấu trúc AirSENSE

### Bước 4: Thêm Menu vào Navigation

#### 4.1. Sửa `WebManage/server/View/Layout/topbar.ejs`

Thêm vào menu dropdown "Các dự án" hoặc tạo menu mới:

```html
<li class="dropdown">
  <a href="#"><span>Giải pháp</span> <i class="bi bi-chevron-down"></i></a>
  <ul>
    <li><a href="/smart_home/power_measure">Smart Home</a></li>
    <li><a href="/IoT_dam_tom/measure">IoT Đầm Tôm</a></li>
    <li><a href="/enose/dashboard">E-Nose</a></li>  <!-- Thêm dòng này -->
  </ul>
</li>
```

### Bước 5: Chia sẻ Authentication

#### 5.1. Sử dụng Authentication hiện có của WebManage

Trong `enose-control.route.js` và `enose-device.route.js`:

```javascript
const isAuthenticated = require("../middlewares/authenticate.js");

// Sử dụng middleware chung
router.get("/", isAuthenticated, (req, res) => {
  // ...
});
```

#### 5.2. Hoặc tạo middleware riêng nếu cần

Nếu E-Nose cần logic authentication riêng, tạo `WebManage/server/middlewares/authenticateEnose.js`:

```javascript
const isAuthenticated = require("./authenticate.js");

module.exports = (req, res, next) => {
  // Kiểm tra quyền truy cập E-Nose
  if (req.currentUser && req.currentUser.permission_id <= 10) {
    return isAuthenticated(req, res, next);
  }
  return res.status(403).json({ error: "Không có quyền truy cập E-Nose" });
};
```

### Bước 6: Cấu hình Database

#### Option 1: Dùng chung database AirSENSE (Khuyến nghị)

Trong `.env` của WebManage, thêm:

```env
# E-Nose Database (có thể dùng chung hoặc riêng)
ENOSE_DB_NAME=electric_nose
ENOSE_DB_HOST=127.0.0.1
ENOSE_DB_USER=root
ENOSE_DB_PASSWORD=
```

Tạo file `WebManage/server/config/enoseDatabase.js`:

```javascript
require('dotenv').config();

module.exports = {
  client: 'mysql',
  connection: {
    host: process.env.ENOSE_DB_HOST || process.env.DB_HOST || '127.0.0.1',
    user: process.env.ENOSE_DB_USER || process.env.DB_USER,
    password: process.env.ENOSE_DB_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.ENOSE_DB_NAME || 'electric_nose',
    charset: 'utf8',
    port: 3306,
  },
};
```

Sửa trong controllers:

```javascript
// Thay vì
const knex = require("../config/knex.js");

// Dùng
const enoseKnex = require("../config/enoseDatabase.js");
const knex = require('knex')(enoseKnex);
```

#### Option 2: Dùng database riêng

Giữ nguyên cấu hình database riêng như hiện tại.

### Bước 7: Cập nhật Controllers để dùng chung Utils

#### 7.1. Sử dụng Utils của WebManage

Trong controllers E-Nose, thay:

```javascript
// Thay vì
const { returnOK, returnFalse } = require("../utils/returnResponse.js");

// Dùng utils của WebManage
const { returnOK, returnFalse } = require("../../utils/returnResponse.js");
```

### Bước 8: Cấu hình MQTT

#### 8.1. Dùng chung MQTT Broker với AirSENSE

Trong `.env` của WebManage:

```env
# MQTT cho E-Nose (dùng chung với AirSENSE)
ENOSE_MQTT_BROKER_URL=mqtt://localhost:1883
```

Trong controllers:

```javascript
const mqtt = require("mqtt");
const mqttClient = mqtt.connect(process.env.ENOSE_MQTT_BROKER_URL || "mqtt://localhost:1883");
```

### Bước 9: Import Database Schema

```bash
# Import schema E-Nose vào MySQL
mysql -u root -p airsense < Electric-Nose/Sql/filesql.sql

# Hoặc tạo database riêng
mysql -u root -p
CREATE DATABASE electric_nose CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
mysql -u root -p electric_nose < Electric-Nose/Sql/filesql.sql
```

### Bước 10: Test và Kiểm tra

1. **Test API:**
   ```bash
   curl http://localhost:3000/api/enose/control/status
   ```

2. **Test Pages:**
   - Truy cập: `http://localhost:3000/enose/dashboard`
   - Kiểm tra menu có hiển thị "E-Nose"

3. **Test Authentication:**
   - Đăng nhập vào AirSENSE
   - Truy cập `/enose/dashboard`
   - Kiểm tra session được chia sẻ

## 📁 CẤU TRÚC SAU KHI TÍCH HỢP

```
WebManage/
├── server/
│   ├── controllers/
│   │   ├── enose.controller.js          # Control E-Nose
│   │   └── enose-device.controller.js   # Device management
│   ├── routes/
│   │   ├── enose-control.route.js       # API routes
│   │   └── enose-device.route.js        # Device routes
│   ├── View/
│   │   └── enose/
│   │       ├── dashboard.ejs
│   │       ├── settings.ejs
│   │       └── login.ejs
│   └── config/
│       └── enoseDatabase.js            # DB config riêng (nếu cần)
```

## 🔗 URL STRUCTURE

Sau khi tích hợp:
- **Dashboard:** `http://airsense.vn/enose/dashboard`
- **Settings:** `http://airsense.vn/enose/settings`
- **API Control:** `http://airsense.vn/api/enose/control/status`
- **API Devices:** `http://airsense.vn/api/enose/devices`

## ✅ LỢI ÍCH

1. ✅ **Chia sẻ Authentication:** User đăng nhập một lần, dùng cho cả AirSENSE và E-Nose
2. ✅ **Chia sẻ Infrastructure:** Dùng chung server, database, MQTT broker
3. ✅ **UI/UX thống nhất:** Menu, navigation, styling giống nhau
4. ✅ **Dễ bảo trì:** Code tập trung, dễ quản lý
5. ✅ **Tích hợp sâu:** Có thể chia sẻ dữ liệu giữa các dịch vụ

## ⚠️ LƯU Ý

1. **Backup trước khi tích hợp:** Backup code và database hiện tại
2. **Test kỹ:** Test từng bước, đảm bảo không ảnh hưởng AirSENSE đang chạy
3. **Giữ code gốc:** Giữ nguyên Electric-Nose để có thể rollback
4. **Database:** Quyết định dùng chung hay riêng database
5. **Permissions:** Cấu hình quyền truy cập E-Nose phù hợp

## 🚀 DEPLOY

Sau khi tích hợp xong:

```bash
cd WebManage
npm install  # Nếu có package mới
pm2 restart webmanage  # Hoặc restart service
```

