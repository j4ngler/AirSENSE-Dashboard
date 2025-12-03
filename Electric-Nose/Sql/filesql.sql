-- Electric-Nose Database Schema
-- Tạo database
CREATE DATABASE IF NOT EXISTS electric_nose CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE electric_nose;

-- Bảng users (người dùng)
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `fullname` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `permission_id` INT(11) DEFAULT 11 COMMENT '1=MASTER, 2=MANAGER, 3=SUPPORT, 4=ACCOUNT, 10=ADMIN, 11=NEW_REGISTER',
  `enterprise_id` INT(11) DEFAULT NULL,
  `delete_flag` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  KEY `idx_email` (`email`),
  KEY `idx_permission` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng oauthen2 (xác thực token)
CREATE TABLE IF NOT EXISTS `oauthen2` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `permission_id` INT(11) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `time_release` DATETIME NOT NULL,
  `delete_flag` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_token` (`token`),
  KEY `idx_user` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng devices (thiết bị)
CREATE TABLE IF NOT EXISTS `devices` (
  `device_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) DEFAULT NULL COMMENT 'Loại thiết bị: sensor, actuator, controller, etc.',
  `location` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'offline' COMMENT 'online, offline, error',
  `mqtt_topic` VARCHAR(255) DEFAULT NULL,
  `ip_address` VARCHAR(50) DEFAULT NULL,
  `mac_address` VARCHAR(50) DEFAULT NULL,
  `firmware_version` VARCHAR(50) DEFAULT NULL,
  `last_seen` DATETIME DEFAULT NULL,
  `delete_flag` TINYINT(1) DEFAULT 0,
  `id_created` INT(11) DEFAULT NULL,
  `id_updated` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`device_id`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`type`),
  FOREIGN KEY (`id_created`) REFERENCES `users`(`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng control_history (lịch sử điều khiển)
CREATE TABLE IF NOT EXISTS `control_history` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `device_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `command` VARCHAR(100) NOT NULL COMMENT 'Lệnh điều khiển: on, off, set_value, etc.',
  `value` TEXT DEFAULT NULL COMMENT 'Giá trị điều khiển (JSON)',
  `status` VARCHAR(50) DEFAULT 'sent' COMMENT 'sent, success, failed',
  `response` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_device` (`device_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_created` (`created_at`),
  FOREIGN KEY (`device_id`) REFERENCES `devices`(`device_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng device_data (dữ liệu từ thiết bị)
CREATE TABLE IF NOT EXISTS `device_data` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `device_id` INT(11) NOT NULL,
  `data_type` VARCHAR(100) DEFAULT NULL COMMENT 'temperature, humidity, pressure, etc.',
  `value` DECIMAL(10,2) DEFAULT NULL,
  `unit` VARCHAR(20) DEFAULT NULL,
  `raw_data` TEXT DEFAULT NULL COMMENT 'JSON raw data',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_device` (`device_id`),
  KEY `idx_type` (`data_type`),
  KEY `idx_created` (`created_at`),
  FOREIGN KEY (`device_id`) REFERENCES `devices`(`device_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng permissions (quyền)
CREATE TABLE IF NOT EXISTS `permissions` (
  `permission_id` INT(11) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `value_manifest` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default permissions (sử dụng INSERT IGNORE để tránh lỗi duplicate)
INSERT IGNORE INTO `permissions` (`permission_id`, `name`, `description`) VALUES
(1, 'MASTER', 'Quản trị cấp cao toàn quyền'),
(2, 'MANAGER', 'Quản trị hệ thống'),
(3, 'SUPPORT', 'Hỗ trợ'),
(4, 'ACCOUNT', 'Tài khoản'),
(10, 'ADMIN', 'Quản trị'),
(11, 'NEW_REGISTER', 'Ghi danh mới');

-- Tạo user admin mặc định (password: admin123)
-- Password hash cho 'admin123' với bcrypt
-- Lưu ý: Password hash này chỉ là mẫu, bạn nên đổi password sau khi đăng nhập
INSERT IGNORE INTO `users` (`username`, `password`, `fullname`, `email`, `phone_number`, `permission_id`) VALUES
('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 'Administrator', 'admin@electric-nose.com', '0123456789', 1);

