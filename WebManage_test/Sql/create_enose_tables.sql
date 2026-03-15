-- ============================================================================
-- SQL Script để tạo các bảng E-Nose trong database airsense
-- Chạy script này trong MySQL để tạo các bảng cần thiết cho E-Nose
-- ============================================================================

USE airsense;

-- Bảng enose_devices (thiết bị E-Nose)
CREATE TABLE IF NOT EXISTS `enose_devices` (
  `device_id` INT(11) NOT NULL AUTO_INCREMENT,
  `device_code` VARCHAR(255) NOT NULL COMMENT 'Mã thiết bị (string)',
  `name` VARCHAR(255) DEFAULT NULL COMMENT 'Tên thiết bị',
  `location` VARCHAR(255) DEFAULT NULL COMMENT 'Vị trí',
  `description` TEXT DEFAULT NULL COMMENT 'Mô tả',
  `status` VARCHAR(50) DEFAULT 'offline' COMMENT 'online, offline, error',
  `mqtt_topic` VARCHAR(255) DEFAULT NULL COMMENT 'MQTT topic',
  `last_seen` DATETIME DEFAULT NULL COMMENT 'Lần cuối thấy thiết bị',
  `delete_flag` TINYINT(1) DEFAULT 0 COMMENT 'Cờ xóa (0=active, 1=deleted)',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`device_id`),
  UNIQUE KEY `uniq_enose_code` (`device_code`),
  KEY `idx_status` (`status`),
  KEY `idx_delete_flag` (`delete_flag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng enose_device_data (dữ liệu từ thiết bị E-Nose)
CREATE TABLE IF NOT EXISTS `enose_device_data` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `device_id` INT(11) NOT NULL COMMENT 'Foreign key đến enose_devices',
  `data_type` VARCHAR(100) DEFAULT NULL COMMENT 'Loại dữ liệu: temperature, humidity, mems1-8, etc.',
  `value` DECIMAL(10,2) DEFAULT NULL COMMENT 'Giá trị',
  `unit` VARCHAR(20) DEFAULT NULL COMMENT 'Đơn vị',
  `raw_data` TEXT DEFAULT NULL COMMENT 'Dữ liệu thô (JSON)',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_device` (`device_id`),
  KEY `idx_type` (`data_type`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `fk_enose_data_device`
    FOREIGN KEY (`device_id`) REFERENCES `enose_devices`(`device_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng enose_control_history (lịch sử điều khiển E-Nose)
-- LƯU Ý: Bảng này phải được tạo SAU khi bảng enose_devices đã tồn tại
CREATE TABLE IF NOT EXISTS `enose_control_history` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `device_id` INT(11) NOT NULL COMMENT 'Foreign key đến enose_devices',
  `user_id` INT(11) DEFAULT NULL COMMENT 'Foreign key đến user (có thể NULL)',
  `command` VARCHAR(100) NOT NULL COMMENT 'Lệnh: start_measurement, heating, air_pump, etc.',
  `value` TEXT DEFAULT NULL COMMENT 'Giá trị điều khiển (JSON)',
  `status` VARCHAR(50) DEFAULT 'sent' COMMENT 'sent, success, failed',
  `response` TEXT DEFAULT NULL COMMENT 'Phản hồi từ thiết bị',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_device` (`device_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_created` (`created_at`),
  KEY `idx_command` (`command`),
  CONSTRAINT `fk_enose_history_device`
    FOREIGN KEY (`device_id`) REFERENCES `enose_devices`(`device_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm foreign key đến bảng user (nếu bảng user tồn tại và có PRIMARY KEY)
-- Nếu bảng user chưa có PRIMARY KEY, bỏ comment phần này và chạy sau:
-- ALTER TABLE `user` ADD PRIMARY KEY (`user_id`);
-- Sau đó mới thêm foreign key:
-- ALTER TABLE `enose_control_history`
--   ADD CONSTRAINT `fk_enose_history_user`
--   FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`)
--   ON DELETE SET NULL;

-- ============================================================================
-- Kiểm tra kết quả
-- ============================================================================
-- Sau khi chạy script, kiểm tra bằng các lệnh sau:
-- SHOW TABLES LIKE 'enose_%';
-- DESCRIBE enose_devices;
-- DESCRIBE enose_device_data;
-- DESCRIBE enose_control_history;
