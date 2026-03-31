# Minh chứng hình ảnh — báo cáo thiết kế giao diện (Electric-Nose)

Thư mục phục vụ **hình minh họa đính kèm** báo cáo (chụp màn hình, scan sketch, export thiết kế). Có thể commit hoặc chỉ đóng gói khi nộp (theo quy định học phần).

**Hình vector kèm báo cáo (đã có sẵn):**

- `hinh-khoi-chuc-nang-dashboard.svg` — khối chức năng chính (tương ứng *Hình 2* trong báo cáo).
- `hinh-luong-phan-hoi-responsive.svg` — nguyên lý responsive theo chiều rộng (*Hình 3*).

## Quy ước đặt tên (gợi ý)

| Tiền tố | Nội dung |
|---------|----------|
| `01-sketch-overview-*` | Sketch giấy — khối tổng quan / điều khiển |
| `02-sketch-mems-*` | Sketch giấy — MEMS / biểu đồ |
| `03-sketch-auth-modal-*` | Sketch giấy — đăng nhập / modal |
| `04-figma-*` | Screenshot hoặc export PDF/PNG từ Figma |
| `05-mockup-*` | Screenshot `docs/ui-mockup-electric-nose/index.html` (PC hoặc mobile) |
| `06-dashboard-*` | Screenshot ứng dụng thật `/enose` (khi server chạy) |
| `10-screen-pc-*` | Ảnh test Chrome — máy tính |
| `11-screen-mobile-portrait-*` | Ảnh test — điện thoại **dọc** |
| `12-screen-mobile-landscape-*` | Ảnh test — điện thoại **ngang** |

Trong báo cáo Word/PDF, chú thích mỗi ảnh: **thiết bị, trình duyệt, độ phân giải, ngày chụp**.

## Checklist trước khi nộp

- [ ] Ít nhất **một** ảnh sketch giấy (hoặc scan).
- [ ] **Figma:** link trong báo cáo hoặc file `04-figma-*` trong thư mục này.
- [ ] **HTML/CSS:** screenshot mockup hoặc dashboard thật.
- [ ] **Test Chrome:** ít nhất 1 ảnh PC + 1 ảnh mobile (dọc hoặc ngang), khớp bảng §6.2a trong báo cáo.

## Định dạng file

Ưu tiên **PNG** hoặc **JPG** (ảnh chụp), **PDF** (export Figma). Giữ dung lượng hợp lý (nén ảnh nếu cần).
