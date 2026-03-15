# Hướng dẫn Setup Python Environment cho Data Processing

## ⚠️ Quan trọng

**Backend sẽ TỰ ĐỘNG sử dụng Python từ virtual environment khi chạy script, KHÔNG cần activate venv trước khi `npm start`.**

Khi backend chạy Python script, nó sẽ:
1. Tự động tìm virtual environment trong `server/scripts/venv/`
2. Sử dụng Python từ venv (ví dụ: `venv/Scripts/python.exe` trên Windows)
3. Chạy script với đường dẫn đầy đủ → không cần activate venv

**Bạn chỉ cần setup venv một lần bằng `setup_venv.bat` hoặc `setup_venv.sh`, sau đó backend sẽ tự động dùng nó.**

## Yêu cầu

- Python 3.8 trở lên
- pip (thường đi kèm với Python)

## Cách 1: Sử dụng Virtual Environment (Khuyến nghị)

### Windows:
```bash
cd server/scripts
setup_venv.bat
```

### Linux/Mac:
```bash
cd server/scripts
chmod +x setup_venv.sh
./setup_venv.sh
```

### Thủ công:
```bash
# Tạo virtual environment
python -m venv venv

# Kích hoạt (Windows)
venv\Scripts\activate

# Kích hoạt (Linux/Mac)
source venv/bin/activate

# Cài đặt thư viện
pip install -r requirements.txt
```

## Cách 2: Cài đặt trực tiếp vào Python system

```bash
pip install -r requirements.txt
```

**Lưu ý:** Cách này sẽ cài đặt thư viện vào Python system, có thể gây conflict với các project khác.

## Các thư viện cần thiết

- `pandas` - Xử lý dữ liệu CSV/Excel
- `numpy` - Tính toán số học
- `scipy` - Signal processing (low-pass filter)
- `matplotlib` - Vẽ biểu đồ
- `scikit-learn` - Machine learning utilities

## Cấu hình trong .env (Tùy chọn)

Nếu không dùng virtual environment, có thể set đường dẫn Python trong `.env`:

```env
PYTHON_PATH=C:/Python312/python.exe
```

## Kiểm tra cài đặt

```bash
# Kích hoạt virtual environment (nếu dùng)
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Test script
python process_measurement.py test_input.csv test_output
```

## Troubleshooting

### Lỗi: "Python không được tìm thấy"
- Đảm bảo Python đã được cài đặt và có trong PATH
- Hoặc set `PYTHON_PATH` trong `.env`

### Lỗi: "No module named 'pandas'"
- Chạy lại `pip install -r requirements.txt`
- Đảm bảo đang dùng đúng Python environment

### Lỗi: "Permission denied" (Linux/Mac)
- Chạy với quyền sudo hoặc dùng virtual environment

