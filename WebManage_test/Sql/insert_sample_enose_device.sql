-- ============================================================================
-- Tạo bản ghi mẫu cho bảng enose_devices
-- Sử dụng khi bảng enose_devices trống nhưng ESP32 đã gửi dữ liệu MQTT
-- Lưu ý: sửa device_code cho đúng với {device_id} trong topic:
--        electric-nose/device/{device_id}/sensor
-- ============================================================================

USE airsense;

INSERT INTO enose_devices (
  device_code,
  name,
  location,
  description,
  status,
  mqtt_topic,
  delete_flag
) VALUES (
  'AirSENSE',                              -- device_id trong topic MQTT
  'Electric-Nose #1',                      -- tên hiển thị
  'Lab',                                   -- vị trí (tùy chọn)
  'ESP32 Electric Nose tích hợp AirSENSE', -- mô tả (tùy chọn)
  'online',                                -- trạng thái ban đầu
  'electric-nose/device/AirSENSE/#',       -- topic MQTT tương ứng
  0                                        -- 0 = active
);

