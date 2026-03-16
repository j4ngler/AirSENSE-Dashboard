-- ============================================================================
-- Script riêng để tạo BẢNG enose_devices (chạy trước nếu bảng này chưa tồn tại)
-- ============================================================================

USE airsense;

-- Xóa bảng cũ nếu cần (CẨN THẬN: sẽ mất dữ liệu)
-- DROP TABLE IF EXISTS `enose_device_data`;
-- DROP TABLE IF EXISTS `enose_control_history`;
-- DROP TABLE IF EXISTS `enose_devices`;

-- Tạo bảng enose_devices (thiết bị E-Nose)
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

-- Kiểm tra kết quả
SELECT 'Bảng enose_devices đã được tạo thành công!' AS Status;
SHOW TABLES LIKE 'enose_%';
