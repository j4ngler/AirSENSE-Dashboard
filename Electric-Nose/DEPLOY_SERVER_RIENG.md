# HƯỚNG DẪN DEPLOY ELECTRIC-NOSE TRÊN SERVER RIÊNG

## ✅ ĐIỀU KIỆN

Electric-Nose có thể chạy hoàn toàn độc lập trên server riêng vì:
- ✅ Cấu trúc giống AirSENSE (Express + MySQL + EJS)
- ✅ Database riêng (`electric_nose`)
- ✅ Port riêng (3001)
- ✅ Config riêng (`.env`)
- ✅ Giao tiếp qua MQTT (có thể dùng chung broker hoặc broker riêng)

## 📋 CÁC BƯỚC TRIỂN KHAI

### Bước 1: Chuẩn bị Server

```bash
# Cài đặt Node.js (nếu chưa có)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt MySQL (nếu chưa có)
sudo apt-get install mysql-server

# Cài đặt PM2 để chạy nền (tương tự AirSENSE)
sudo npm install -g pm2
```

### Bước 2: Upload Code lên Server

```bash
# Trên máy local
# Option 1: Sử dụng Git
git clone <repository-url>
cd Electric-Nose

# Option 2: Upload qua SCP
scp -r Electric-Nose/ user@server-ip:/var/www/
```

### Bước 3: Cài đặt Dependencies

```bash
cd /var/www/Electric-Nose
npm install
```

### Bước 4: Thiết lập Database

```bash
# Đăng nhập MySQL
mysql -u root -p

# Tạo database
CREATE DATABASE electric_nose CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import schema
mysql -u root -p electric_nose < Sql/filesql.sql
```

### Bước 5: Cấu hình Environment Variables

Tạo file `.env` trong thư mục `Electric-Nose/`:

```env
# MySQL Database Configuration
DB_CLIENT=mysql
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=electric_nose

# Server Configuration
APP_PORT=3001
APP_HOST=0.0.0.0

# MongoDB Configuration (nếu cần)
APP_MONGO=mongodb://localhost
APP_MONGO_PORT=27017
APP_MONGO_USER=
APP_MONGO_PASS=
APP_MONGO_TABLE=electric_nose

# MQTT Configuration
# Nếu dùng chung MQTT broker với AirSENSE:
MQTT_BROKER_URL=mqtt://airsense-server-ip:1883
# Hoặc nếu dùng broker riêng:
# MQTT_BROKER_URL=mqtt://localhost:1883
```

### Bước 6: Chạy với PM2 (Giống AirSENSE)

```bash
# Tạo file ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'electric-nose',
    script: 'server/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF

# Khởi động với PM2
pm2 start ecosystem.config.js

# Lưu cấu hình PM2
pm2 save
pm2 startup
```

### Bước 7: Cấu hình Nginx (Nếu cần domain riêng)

```nginx
# /etc/nginx/sites-available/electric-nose
server {
    listen 80;
    server_name enose.airsense.vn;  # hoặc domain riêng

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Kích hoạt site
sudo ln -s /etc/nginx/sites-available/electric-nose /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Bước 8: Cấu hình Firewall

```bash
# Mở port 3001 (nếu cần truy cập trực tiếp)
sudo ufw allow 3001/tcp

# Hoặc chỉ dùng qua Nginx (port 80/443)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## 🔗 TÍCH HỢP VỚI AIRSENSE

### Option 1: Dùng chung MQTT Broker

Trong `.env` của Electric-Nose:
```env
MQTT_BROKER_URL=mqtt://airsense-server-ip:1883
```

### Option 2: Dùng MQTT Broker riêng

Chạy MQTT broker riêng trên server Electric-Nose:
```bash
cd mqttBroker
npm install
node MqttBroker1885.js
```

### Option 3: Link từ AirSENSE Website

Thêm vào menu AirSENSE:
```html
<a href="http://enose.airsense.vn" target="_blank">E-Nose</a>
```

## 📊 QUẢN LÝ VÀ GIÁM SÁT

```bash
# Xem logs
pm2 logs electric-nose

# Xem status
pm2 status

# Restart
pm2 restart electric-nose

# Stop
pm2 stop electric-nose

# Xem thông tin chi tiết
pm2 describe electric-nose
```

## 🔄 UPDATE CODE

```bash
cd /var/www/Electric-Nose
git pull  # hoặc upload code mới
npm install  # nếu có package mới
pm2 restart electric-nose
```

## ✅ KIỂM TRA

1. **Kiểm tra service đang chạy:**
   ```bash
   pm2 status
   curl http://localhost:3001
   ```

2. **Kiểm tra database:**
   ```bash
   mysql -u root -p -e "USE electric_nose; SHOW TABLES;"
   ```

3. **Kiểm tra MQTT connection:**
   - Xem logs: `pm2 logs electric-nose`
   - Kiểm tra kết nối MQTT trong code

## 🎯 KẾT LUẬN

Electric-Nose hoàn toàn có thể chạy độc lập trên server riêng với:
- ✅ Cấu trúc giống AirSENSE
- ✅ Database riêng
- ✅ Port riêng
- ✅ Có thể giao tiếp với AirSENSE qua MQTT
- ✅ Có thể link từ website AirSENSE

