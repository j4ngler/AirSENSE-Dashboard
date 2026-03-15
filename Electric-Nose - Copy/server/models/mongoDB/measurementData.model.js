const mongoose = require('mongoose');

const measurementDataSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    index: true
  },
  file_name: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['started', 'in_progress', 'completed', 'failed', 'cancelled'],
    default: 'started'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Dữ liệu đo được (có thể là array hoặc object)
  measurement_data: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  // Số lượng mẫu đã đo
  samples_count: {
    type: Number,
    default: 0
  },
  // Thời gian bắt đầu và kết thúc
  started_at: {
    type: Date,
    default: Date.now,
    index: true
  },
  completed_at: {
    type: Date,
    default: null
  },
  // Thời gian đo (milliseconds)
  duration_ms: {
    type: Number,
    default: null
  },
  // Metadata
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'measurement_data'
});

// Index
measurementDataSchema.index({ device_id: 1, started_at: -1 });
measurementDataSchema.index({ file_name: 1 });
measurementDataSchema.index({ status: 1 });

const MeasurementData = mongoose.model('MeasurementData', measurementDataSchema);

module.exports = MeasurementData;

