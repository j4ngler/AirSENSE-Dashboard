HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY ELECTRIC-NOSE WEBMANAGE

B1: npm install

B2: Thiết lập database MySQL trong thư mục "Sql"
- Bật XAMPP (Apache và MySQL)
- Tạo database tên: electric_nose
- Import file SQL từ thư mục Sql/filesql.sql

B3: Tạo file .env với cấu hình:
- DB_CLIENT=mysql
- DB_HOST=127.0.0.1
- DB_USER=root
- DB_PASSWORD=
- DB_NAME=electric_nose
- APP_PORT=3001
- APP_HOST=localhost

B4: Chạy lệnh: npm start hoặc node server/server.js

Server sẽ chạy tại: http://localhost:3001

