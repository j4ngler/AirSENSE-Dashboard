# Báo cáo phần thiết kế giao diện — Thành viên 2  
**Vai trò:** Triển khai frontend EJS / HTML / CSS (prototype & tái sử dụng)  
**Dự án:** Electric-Nose — Dashboard giám sát & điều khiển thiết bị E‑Nose  
**Người thực hiện:** _______________________  
**Ngày:** _______________________

---

## 1. Xác định thiết bị mục tiêu: máy tính hay điện thoại?

**Áp dụng cho phần tôi code:** Màn hình **chi tiết dữ liệu / cảm biến / biểu đồ** (ví dụ các kênh MEMS/ADC, bảng hoặc card theo từng kênh) được tối ưu **trước hết cho desktop** để đọc nhiều kênh song song. Trên **điện thoại**, dùng lưới Bootstrap (`col-sm-6`, `col-md-3`, …) để **card xếp 2 cột hoặc 1 cột**, tránh tràn ngang.

**Lý do:** Đọc 8 kênh ADC trên màn hình nhỏ cần xếp chồng hợp lý; desktop vẫn là nơi phân tích nhanh nhất.

---

## 2. Thích nghi xoay ngang / dọc

**Thực hiện kỹ thuật:** Dùng **Bootstrap grid** và `flex-wrap` cho cụm nút; không hard-code chiều rộng cố định cho toàn khối biểu đồ nếu gây vỡ layout trên mobile.

- **Dọc:** Các cột `col-md-3` thu về full width hoặc `col-sm-6` tùy breakpoint.  
- **Ngang:** Khi chiều rộng đủ, hiển thị lại nhiều cột để so sánh kênh.

**Kiểm tra:** Sau deploy, xoay điện thoại và xác nhận không có thanh cuộn ngang không cần thiết, canvas biểu đồ (nếu có) không che nút điều khiển.

---

## 3. Framework và công nghệ giao diện

- **Express + EJS:** Server render, partial layout (`header`, `topbar`, `footer`).  
- **Bootstrap 5:** Grid, card, button, spacing utilities.  
- **Bootstrap Icons:** Icon trạng thái / điều hướng.  
- **JavaScript:** Gọi API định kỳ, cập nhật DOM/biểu đồ — ưu tiên **gom hàm dùng chung** (format số, render card) vào một file hoặc một khối script rõ ràng, tránh copy-paste logic giữa các section.

**Kết luận:** Có dùng **framework UI Bootstrap 5**; template là **EJS**, không phải React/Vue.

---

## 4. Phác họa giao diện và nội dung chính (phần do tôi phụ trách)

**Giao diện được giao:** **Khu vực hiển thị dữ liệu cảm biến / biểu đồ / lưới kênh ADC** trên dashboard (hoặc một section tương đương được tách rõ trong báo cáo nhóm).

**Hình thức phác họa:**

1. **Giấy:** Sơ đồ lưới 2×4 hoặc 4×2 cho 8 kênh, ghi chú chỗ legend và trục thời gian.  
2. **HTML + CSS (prototype):** Trang tĩnh hoặc nhánh EJS với dữ liệu giả để kiểm tra độ dài text và overflow.  
3. **Figma:** Bám layout và spacing do **Thành viên 1** cung cấp; chỉ thêm chi tiết riêng (legend chart, màu đường) nếu đã thống nhất palette.

*(Đính kèm: ảnh sketch, screenshot prototype, ảnh màn hình thật sau tích hợp API.)*

---

## 5. Thống nhất bố cục, tái sử dụng code, hạn chế duplicate

**Việc đã làm / cam kết:**

- Dùng **cùng class card / header** với màn tổng quan (theo spec Figma).  
- Trích **màu và biến** từ `:root` chung; không tự thêm bảng màu mới.  
- CSS riêng cho section: đặt trong **một khối có comment rõ** hoặc file `.css` include chung để sau này gộp dễ (tránh nhân đôi cùng một rule ở nhiều file).  
- JS: nếu hai chỗ cùng “tạo card kênh”, gom thành **một hàm** `renderChannelCard(data)` thay vì hai đoạn HTML string giống nhau.

**Vấn đề cần lưu ý trong báo cáo nhóm:** Trùng phiên bản Bootstrap nếu vừa load từ `header` vừa load CDN khác trong cùng trang — **nên thống nhất một nguồn** (đây là điểm có thể nhờ Thành viên 3 rà soát).

---

## 6. Kích thước nút bấm và chữ

- **Nút** gắn với thao tác trên mobile: class `btn` đủ cao; tránh chỉ dùng `btn-sm` cho hành động chính trên màn hình cảm ứng.  
- **Chữ:** Số đo và nhãn kênh đủ lớn (tối thiểu khoảng **14px** trở lên cho body); chú thích trục có thể nhỏ hơn một chút nhưng vẫn đọc được trên điện thoại.

---

## 7. Kiểm thử Chrome (máy tính và điện thoại)

**Phạm vi:** Màn / section **dữ liệu & biểu đồ** do tôi triển khai.

| Thiết bị | Chrome | Pass / Cần sửa | Ghi chú (overflow, legend, scroll) |
|-----------|--------|----------------|-------------------------------------|
| PC | | | |
| Phone dọc | | | |
| Phone ngang | | | |

---

## 8. Khó khăn — Lựa chọn — Lý do (phần cá nhân)

| Khó khăn | Đã lựa chọn | Lý do |
|----------|-------------|--------|
| Dữ liệu realtime làm DOM thay đổi liên tục | Cập nhật có throttle hoặc chỉ refresh phần cần thiết | Tránh giật lag trên mobile |
| 8 kênh trên một màn hẹp | Grid responsive + có thể cuộn dọc | Giữ đủ thông tin mà không ép font quá nhỏ |
| Trùng code HTML cho từng card | Một template/hàm JS sinh card | Dễ sửa một lần, áp dụng cả nhóm kênh |

---

## 9. Kết luận

Tôi triển khai **giao diện phần dữ liệu/biểu đồ** bằng **EJS + Bootstrap 5**, bám **Figma/style chung**, chú trọng **responsive** và **giảm duplicate** ở CSS/JS. Đồng thời thực hiện **kiểm thử Chrome** cho phần việc của mình và cung cấp ảnh minh chứng cho báo cáo nhóm.

**Chữ ký / xác nhận:** _______________________
