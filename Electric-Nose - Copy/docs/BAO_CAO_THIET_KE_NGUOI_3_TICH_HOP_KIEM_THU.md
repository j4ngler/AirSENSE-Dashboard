# Báo cáo phần thiết kế giao diện — Thành viên 3  
**Vai trò:** Tích hợp layout, kiểm thử tổng hợp & hoàn thiện phần báo cáo chung  
**Dự án:** Electric-Nose — Dashboard giám sát & điều khiển thiết bị E‑Nose  
**Người thực hiện:** _______________________  
**Ngày:** _______________________

---

## 1. Xác định thiết bị mục tiêu: máy tính hay điện thoại?

**Tổng hợp cho báo cáo nhóm:** Hệ thống dashboard web Electric-Nose nhắm tới **máy tính** làm thiết bị chính (giám sát, điều khiển phiên đo). **Điện thoại** được hỗ trợ thông qua thiết kế responsive và viewport chuẩn (`width=device-width, initial-scale=1`) trong layout chung.

**Phần tôi phụ trách:** Đảm bảo **màn phụ / đăng nhập / menu tài khoản** (hoặc module tương đương nhóm phân công) hiển thị nhất quán trên cả hai loại thiết bị, không lệch so với màn chính.

---

## 2. Thích nghi xoay ngang / dọc

**Vai trò của tôi:** Kiểm tra **toàn bộ các màn** do nhóm làm khi **xoay dọc / ngang** trên điện thoại; ghi lại lỗi (tràn layout, header che nội dung, modal vượt màn hình).

**Kết luận ghi vào báo cáo chung:** Ứng dụng **thích nghi theo chiều rộng** (Bootstrap breakpoints); xoay ngang thường tăng chiều ngang — cần xác nhận **không xuất hiện khoảng trắng lạ** hoặc **chữ quá nhỏ** sau khi scale.

---

## 3. Framework và công nghệ giao diện (tóm tắt chính thức cho báo cáo)

| Thành phần | Công nghệ |
|------------|-----------|
| Server | Node.js, Express |
| View | **EJS** |
| UI | **Bootstrap 5**, Bootstrap Icons |
| Khác (theo trang) | Chart.js, SweetAlert2, Leaflet, v.v. |

**Trả lời câu hỏi “có framework không?”:** **Có** — chủ yếu **Bootstrap 5** cho layout và component; backend không dùng framework frontend SPA.

---

## 4. Phác họa giao diện và nội dung chính (phần do tôi phụ trách)

**Giao diện được giao (ví dụ):** **Đăng nhập / tài khoản / modal xác nhận / liên kết cài đặt** — một khối UI có thể nhận diện riêng trong báo cáo (“ít nhất một giao diện / người”).

**Hình thức phác họa:**

1. **Giấy:** Luồng từ trang chủ → đăng nhập → vào `/enose`; vị trí nút trên header.  
2. **Figma:** Dùng lại **Button, Input, Typography** từ file master của Thành viên 1.  
3. **HTML + CSS:** Ghép vào cùng `Layout` với dashboard để màu và font khớp.

*(Đính kèm: ảnh wireframe, screenshot màn hoàn chỉnh.)*

---

## 5. Thống nhất bố cục, tái sử dụng code, hạn chế duplicate — rà soát tích hợp

**Công việc tôi đã làm / cần làm:**

- **Ghép** màn của mình vào `header.ejs` / `topbar.ejs` / `footer.ejs` giống các phần khác.  
- **Rà soát trùng lặp:**  
  - Bootstrap load **hai lần** hoặc **hai phiên bản** khác nhau trên một trang.  
  - Cùng một đoạn CSS định nghĩa `.card` hoặc màu nền ở nhiều nơi.  
  - Script Chart.js / jQuery / plugin load trùng.  
- **Đề xuất hành động:** Gộp link CDN vào một layout; tách CSS chung E‑Nose ra một file; ghi vào báo cáo nhóm như **cải tiến sau demo**.

**Mục tiêu:** Các giao diện trong nhóm **cùng bố cục header**, **cùng quy tắc nút/chữ**, **cùng hệ màu** — tăng khả năng **dùng lại CSS/JS**.

---

## 6. Kích thước nút bấm và chữ (kiểm tra thực tế)

**Checklist khi test trên điện thoại:**

- [ ] Nút hành động chính (Đăng nhập, Xác nhận, Bắt đầu đo nếu có trên màn phụ) có **vùng bấm đủ lớn** (khuyến nghị ≥ 44×44 px).  
- [ ] Không chỉ dựa vào `btn-sm` cho thao tác quan trọng trên mobile.  
- [ ] Chữ form và thông báo lỗi đọc được **không cần zoom**.  
- [ ] Khoảng cách giữa các link/nút đủ để tránh chạm nhầm.

**Ghi chép:** Chụp màn hình các trường hợp **trước và sau** nếu đã chỉnh sửa.

---

## 7. Kiểm thử giao diện bằng Chrome — máy tính và điện thoại (bảng tổng hợp nhóm)

**Trách nhiệm:** Tôi tổng hợp kết quả test của **cả 3 màn / 3 phần giao diện** (tổng quan — dữ liệu/biểu đồ — màn phụ/auth).

| STT | Phần giao diện | Người phụ trách | PC (Chrome) | Mobile dọc | Mobile ngang | Ghi chú lỗi / đã sửa |
|-----|----------------|-----------------|-------------|------------|--------------|----------------------|
| 1 | Tổng quan / điều khiển | TV1 | | | | |
| 2 | Cảm biến / biểu đồ | TV2 | | | | |
| 3 | Auth / phụ / modal | TV3 | | | | |

**Có thể bổ sung:** Chrome DevTools (Device Toolbar) cho kiểm tra nhanh; nhưng báo cáo nên có **ít nhất một lần test trên thiết bị thật**.

---

## 8. Phần báo cáo chung do tôi soạn / ghép

**Nội dung tôi chuẩn bị cho tài liệu nhóm:**

1. **Mở đầu:** Mục tiêu thiết kế UI, thiết bị mục tiêu, framework.  
2. **Quy trình phác họa:** Sketch giấy → Figma → HTML/CSS (ai làm gì).  
3. **Nguyên tắc thống nhất:** Layout, màu, typography, tái sử dụng.  
4. **Kết quả kiểm thử:** Bảng mục 7 + ảnh minh họa.  
5. **Ghép mục “Khó khăn — Lựa chọn — Lý do”** từ 3 thành viên thành một mục xuyên suốt.

---

## 9. Khó khăn — Lựa chọn — Lý do (phần cá nhân)

| Khó khăn | Đã lựa chọn | Lý do |
|----------|-------------|--------|
| Nhiều CSS/JS legacy trong layout chung | Rà soát có ưu tiên: chỉ sửa phần ảnh hưởng E‑Nose trước deadline | Giảm rủi ro phá vỡ trang khác |
| Trùng Bootstrap / thư viện | Báo cáo + đề xuất gộp một nguồn | Giảm duplicate và lỗi style chồng |
| Test trên nhiều máy khác nhau | Phân chia thiết bị trong nhóm, tôi tổng hợp | Đủ minh chứng cho giảng viên |

---

## 10. Kết luận

Tôi hoàn thành **một giao diện phụ** đồng bộ với nhóm, **tích hợp layout chung**, **rà soát duplicate**, **tổ chức kiểm thử Chrome** trên PC và điện thoại cho toàn bộ phần UI nhóm, và **ghép báo cáo thiết kế** thành tài liệu thống nhất.

**Chữ ký / xác nhận:** _______________________
