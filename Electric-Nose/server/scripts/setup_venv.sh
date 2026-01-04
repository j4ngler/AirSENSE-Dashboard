#!/bin/bash
# Script tạo virtual environment và cài đặt thư viện cho Linux/Mac

echo "========================================"
echo "Setting up Python Virtual Environment"
echo "========================================"

# Kiểm tra Python có tồn tại không
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 không được tìm thấy trong PATH"
    echo "Vui lòng cài đặt Python3"
    exit 1
fi

echo ""
echo "[1/3] Tạo virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "ERROR: Không thể tạo virtual environment"
    exit 1
fi

echo ""
echo "[2/3] Kích hoạt virtual environment..."
source venv/bin/activate

echo ""
echo "[3/3] Cài đặt thư viện từ requirements.txt..."
pip install --upgrade pip
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Không thể cài đặt thư viện"
    exit 1
fi

echo ""
echo "========================================"
echo "✅ Hoàn thành setup!"
echo "========================================"
echo ""
echo "Để sử dụng virtual environment:"
echo "  source venv/bin/activate"
echo ""
echo "Để tắt virtual environment:"
echo "  deactivate"
echo ""

