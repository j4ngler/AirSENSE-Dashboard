#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script xử lý dữ liệu đo từ file CSV sau mỗi lần đo 40 phút
Chạy tự động sau khi measurement completed
"""

import sys
import os
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
from scipy.signal import butter, filtfilt
import json
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

# === Cấu hình ===
# Nhận tham số từ command line: file_path, output_folder
if len(sys.argv) < 3:
    print("Usage: python process_measurement.py <input_csv_file> <output_folder>")
    sys.exit(1)

input_csv_file = sys.argv[1]
output_folder = sys.argv[2]

# Tạo thư mục output nếu chưa có
os.makedirs(output_folder, exist_ok=True)

# === Đọc file CSV ===
try:
    df = pd.read_csv(input_csv_file)
    print(f"✅ Đã đọc file CSV: {input_csv_file}")
    print(f"   Số dòng dữ liệu: {len(df)}")
    print(f"   Các cột: {list(df.columns)}")
except Exception as e:
    print(f"❌ Lỗi khi đọc file CSV: {e}")
    sys.exit(1)

# === Bộ lọc thông thấp ===
def lowpass_filter(data, cutoff=0.005, fs=2.0, order=4):
    """Áp dụng bộ lọc thông thấp Butterworth"""
    if len(data) < order * 3:
        print(f"⚠️ Dữ liệu quá ngắn ({len(data)} samples), bỏ qua filter")
        return data
    
    nyq = 0.5 * fs
    normal_cutoff = cutoff / nyq
    try:
        b, a = butter(order, normal_cutoff, btype='low', analog=False)
        filtered = filtfilt(b, a, data)
        return filtered
    except Exception as e:
        print(f"⚠️ Lỗi khi áp dụng filter: {e}")
        return data

# === Xử lý các cảm biến MEMS ===
sensor_labels = ['EtOH3', 'EtOH4', 'EtOH5', 'EtOH6', 'EtOH1', 'EtOH2', 'VOC1', 'VOC2']
fs = 2.0  # Sampling frequency: 2 Hz (mỗi 0.5 giây một sample)

# Tạo time axis (phút)
if 'TimeStamp' in df.columns:
    # Convert timestamp to minutes from start
    try:
        df['TimeStamp'] = pd.to_datetime(df['TimeStamp'])
        time_minutes = (df['TimeStamp'] - df['TimeStamp'].iloc[0]).dt.total_seconds() / 60.0
    except:
        time_minutes = np.arange(len(df)) / (fs * 60)
else:
    time_minutes = np.arange(len(df)) / (fs * 60)

# === Xử lý và vẽ biểu đồ cho từng sensor ===
results = {}

for sensor in sensor_labels:
    if sensor not in df.columns:
        print(f"⚠️ Không tìm thấy cột {sensor} trong file CSV")
        continue
    
    # Lấy dữ liệu raw
    raw_data = pd.to_numeric(df[sensor], errors='coerce').values
    
    # Loại bỏ NaN
    valid_mask = ~np.isnan(raw_data)
    if not np.any(valid_mask):
        print(f"⚠️ Không có dữ liệu hợp lệ cho {sensor}")
        continue
    
    # Áp dụng low-pass filter
    filtered_data = lowpass_filter(raw_data[valid_mask], cutoff=0.005, fs=fs, order=4)
    
    # Tính toán thống kê
    mean_raw = np.nanmean(raw_data[valid_mask])
    mean_filtered = np.nanmean(filtered_data)
    std_raw = np.nanstd(raw_data[valid_mask])
    std_filtered = np.nanstd(filtered_data)
    
    results[sensor] = {
        'mean_raw': float(mean_raw),
        'mean_filtered': float(mean_filtered),
        'std_raw': float(std_raw),
        'std_filtered': float(std_filtered),
        'samples': int(np.sum(valid_mask))
    }
    
    # Vẽ biểu đồ
    plt.figure(figsize=(12, 6))
    time_valid = time_minutes[valid_mask]
    
    plt.plot(time_valid, raw_data[valid_mask], 'b-', alpha=0.5, label='Raw Data', linewidth=1)
    plt.plot(time_valid, filtered_data, 'r-', label='Filtered Data', linewidth=2)
    plt.xlabel('Time (minutes)')
    plt.ylabel(f'{sensor} ADC Value')
    plt.title(f'{sensor} - Raw vs Filtered Data')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Lưu biểu đồ
    plot_file = os.path.join(output_folder, f'{sensor}_filtered.png')
    plt.savefig(plot_file, dpi=150, bbox_inches='tight')
    plt.close()
    print(f"✅ Đã lưu biểu đồ {sensor}: {plot_file}")

# === Lưu kết quả thống kê vào file JSON ===
results_file = os.path.join(output_folder, 'processing_results.json')
with open(results_file, 'w', encoding='utf-8') as f:
    json.dump({
        'input_file': input_csv_file,
        'processed_at': datetime.now().isoformat(),
        'total_samples': len(df),
        'sensors': results
    }, f, indent=2, ensure_ascii=False)

print(f"✅ Đã lưu kết quả thống kê: {results_file}")

# === Lưu dữ liệu đã filter vào file CSV mới ===
output_csv = os.path.join(output_folder, os.path.basename(input_csv_file).replace('.csv', '_filtered.csv'))
df_filtered = df.copy()

for sensor in sensor_labels:
    if sensor in df.columns:
        raw_data = pd.to_numeric(df[sensor], errors='coerce').values
        valid_mask = ~np.isnan(raw_data)
        if np.any(valid_mask):
            filtered_data = lowpass_filter(raw_data[valid_mask], cutoff=0.005, fs=fs, order=4)
            # Tạo array đầy đủ với NaN cho các giá trị không hợp lệ
            full_filtered = np.full(len(df), np.nan)
            full_filtered[valid_mask] = filtered_data
            df_filtered[f'{sensor}_filtered'] = full_filtered

df_filtered.to_csv(output_csv, index=False)
print(f"✅ Đã lưu dữ liệu đã filter: {output_csv}")

print("✅ Hoàn thành xử lý dữ liệu đo!")

