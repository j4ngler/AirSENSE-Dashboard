# AirSENSE-Vietnam

## Lưu trữ dữ liệu E-Nose

Khi `WebManage_test` kết nối MongoDB, bộ tổng hợp lưu min, max, trung bình và số
mẫu hợp lệ theo thiết bị và phút trong `enose_sensor_minutes`. Biểu đồ **Xem
biểu đồ** đọc collection này. Mỗi bản tổng hợp được giữ 365 ngày.

Mẫu mới trên topic `electric-nose/device/<device_code>/sensor` chỉ được lên lịch
hết hạn sau khi đã tổng hợp thành công và payload có
`"retention_class": "monitoring"`, không có `session_id` hay `file_name`. Mốc
hết hạn là 30 ngày kể từ lúc server nhận mẫu. Chỉ gắn nhãn `monitoring` cho
luồng giám sát đã xác định nằm ngoài phiên đo. Mẫu thiếu nhãn, mẫu phiên đo và
bản ghi cũ được giữ lại. Gửi `sht35_heater_enabled` cùng mẫu nếu cần loại RH
trong lúc bộ sấy hoạt động khỏi bản tổng hợp.

Với phiên thí nghiệm, tải CSV qua giao diện, lưu vào thư mục lưu trữ theo mã
thiết bị và mã phiên rồi mở lại để kiểm tra. Bộ dọn giữ các mẫu MongoDB của
phiên và không tác động tới tệp CSV.

Để kiểm kê bản ghi E-Nose cũ hơn 30 ngày mà không sửa database, chạy từ
`WebManage_test` sau khi đã cấu hình kết nối MongoDB:

```powershell
node .\server\enose-retention-inventory.js
```
