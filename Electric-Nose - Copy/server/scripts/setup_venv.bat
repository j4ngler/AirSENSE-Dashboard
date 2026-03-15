@echo off
REM Script tạo virtual environment và cài đặt thư viện cho Windows

echo ========================================
echo Setting up Python Virtual Environment
echo ========================================

REM Kiểm tra Python có tồn tại không
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python không được tìm thấy trong PATH
    echo Vui lòng cài đặt Python hoặc thêm Python vào PATH
    pause
    exit /b 1
)

echo.
echo [1/3] Tạo virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Không thể tạo virtual environment
    pause
    exit /b 1
)

echo.
echo [2/3] Kích hoạt virtual environment...
call venv\Scripts\activate.bat

echo.
echo [3/3] Cài đặt thư viện từ requirements.txt...
pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Không thể cài đặt thư viện
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Hoàn thành setup!
echo ========================================
echo.
echo Để sử dụng virtual environment:
echo   venv\Scripts\activate.bat
echo.
echo Để tắt virtual environment:
echo   deactivate
echo.
pause

