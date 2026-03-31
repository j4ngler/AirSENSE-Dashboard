# Báo cáo phần thiết kế giao diện — Thành viên 1  
**Vai trò:** Lead UI / Design system & Figma  
**Dự án:** Electric-Nose — Dashboard giám sát & điều khiển thiết bị E‑Nose (ESP32, MQTT)  
**Người thực hiện:** _______________________  
**Ngày:** _______________________

---

## 1. Xác định thiết bị mục tiêu: máy tính hay điện thoại?

**Lựa chọn của nhóm:** Ưu tiên **máy tính (desktop)** làm môi trường chính để vận hành dashboard (theo dõi trạng thái thiết bị, đọc nhiều kênh cảm biến, bấm điều khiển đo). Đồng thời **hỗ trợ điện thoại** ở mức “xem và thao tác cơ bản được”, nhờ layout responsive (Bootstrap) và meta viewport.

**Lý do:** Bối cảnh lab/giám sát thường dùng màn hình lớn; tuy nhiên người dùng có thể kiểm tra nhanh trên mobile, nên không được bỏ qua khả năng hiển thị trên màn hình nhỏ.

---

## 2. Thích nghi xoay ngang / dọc

**Cách tiếp cận:** Không dùng riêng media query `orientation` trong bản thiết kế Figma; thiết kế theo **độ rộng breakpoint** (tương thích Bootstrap: sm / md / lg).

- **Dọc (portrait):** Ưu tiên **một cột**, thứ tự nội dung: trạng thái hệ thống → điều khiển quan trọng → chi tiết/biểu đồ.  
- **Ngang (landscape):** Tận dụng chiều ngang cho **hai cột** (ví dụ: tóm tắt trạng thái bên trái, vùng đồ thị bên phải) khi đủ rộng.

**Ghi chú kiểm thử:** Sau khi dev dựng màn hình, cần **test thực tế** khi xoay máy vì biểu đồ và bảng dễ bị chật hoặc tràn.

---

## 3. Framework và công nghệ giao diện

| Thành phần | Công nghệ |
|------------|-----------|
| Backend | Node.js, Express |
| Template trang | **EJS** (render phía server) |
| CSS/UI | **Bootstrap 5**, **Bootstrap Icons** |
| Biểu đồ / popup / bản đồ (theo trang) | Chart.js, SweetAlert2, Leaflet (khi có) |

**Kết luận:** Có sử dụng **framework CSS/UI là Bootstrap 5**; không dùng SPA React/Vue trong phạm vi dashboard hiện tại.

---

## 4. Phác họa giao diện và nội dung chính (phần do tôi phụ trách)

**Giao diện được giao:** **Màn tổng quan / điều khiển chính** (header, chip trạng thái hệ thống, khu vực cảnh báo Wi‑Fi nếu có, nút start measurement / trạng thái phiên đo, bố cục card tổng quan).

**Hình thức phác họa:**

1. **Bằng tay trên giấy** (sketch nhanh): luồng nhìn từ trên xuống, vị trí logo, thanh trạng thái, vùng CTA (nút đo).  
2. **Figma:** Khung wireframe + **component** (Button primary/secondary, Card, Status chip, Alert) + bảng màu và typography.  
3. **HTML + CSS:** Do thành viên 2/3 dựng theo Figma; tôi cung cấp **file Figma + spec** (màu hex, padding, border-radius).

*(Đính kèm báo cáo: ảnh chụp sketch, link/export Figma, ảnh màn hình sau khi code.)*

---

## 5. Thống nhất bố cục, định dạng, tái sử dụng code — trách nhiệm Lead UI

**Quy chuẩn đã đặt ra cho nhóm:**

- **Bố cục chung:** Cùng header/topbar (`Layout`), cùng hệ nền và card bo góc thống nhất.  
- **Màu:** Định nghĩa trong Figma và khuyến nghị map sang **CSS variables** (`:root { --primary; --danger; … }`) để tránh hard-code lệch màu.  
- **Typography:** Một font chính cho dashboard (ví dụ Segoe UI / hoặc font nhóm chọn), cấp độ: tiêu đề trang, tiêu đề card, body, chú thích.  
- **Nút:** Một kiểu primary (gradient hoặc màu flat thống nhất), một kiểu secondary/outline; **chiều cao tối thiểu trên mobile ≥ 44px** (vùng chạm).  
- **Spacing:** Bội số 8px (8, 16, 24, 32) cho margin/padding giữa các khối.

**Hạn chế duplicate:** Không mỗi người tự đặt một bộ màu riêng; mọi màn mới phải **reuse component** đã định nghĩa trong Figma và class Bootstrap + class tùy chỉnh có tiền tố thống nhất (ví dụ `enose-`).

---

## 6. Kiểm thử giao diện trên Chrome (máy tính và điện thoại)

**Phạm vi tôi tự test:** Màn **tổng quan** do tôi thiết kế (sau khi có bản build).

| Thiết bị / ngữ cảnh | Trình duyệt | Kết quả (Pass / Cần sửa) | Ghi chú |
|---------------------|-------------|---------------------------|---------|
| PC, độ phân giải tiêu biểu (vd. 1920×1080) | Chrome | | |
| Điện thoại, dọc | Chrome | | |
| Điện thoại, ngang | Chrome | | |

**Chú ý nút và chữ:** Kiểm tra nhãn không nhỏ hơn ~14–16px cho nội dung chính; nút không quá sát nhau để tránh bấm nhầm.

---

## 7. Khó khăn — Lựa chọn — Lý do (phần cá nhân)

| Khó khăn | Đã lựa chọn | Lý do |
|----------|-------------|--------|
| Nhiều thông tin (online/offline, Wi‑Fi, đo, ADC) trên một màn | Ưu tiên thứ tự thông tin: trạng thái an toàn vận hành trước, chi tiết kỹ thuật sau | Giảm sai lầm thao tác, đúng ngữ cảnh lab |
| Đồng bộ giữa 3 người khi không quen Figma | Một file Figma master + naming component rõ ràng | Giảm lệch bố cục và màu |
| Mobile hẹp, khó vừa biểu đồ vừa điều khiển | Breakpoint: trên mobile ưu tiên điều khiển + tóm tắt; biểu đồ cuộn xuống hoặc full width | Đảm bảo thao tác được trước, đọc số liệu sau |

---

## 8. Kết luận

Tôi chịu trách nhiệm **định hướng thiết bị**, **hướng dẫn xoay màn hình qua breakpoint**, **khẳng định stack Bootstrap 5 + EJS**, **phác Figma + sketch** cho màn tổng quan, và **quy chuẩn hóa** để nhóm giảm code/CSS trùng lặp. Các thành viên còn lại triển khai chi tiết và kiểm thử tổng hợp theo bảng chung.

**Chữ ký / xác nhận:** _______________________
