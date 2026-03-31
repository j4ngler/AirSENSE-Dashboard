const mongoose = require('mongoose');

const EnoseMeasurementDataSchema = new mongoose.Schema({
  device_id: { type: String, required: true, index: true },
  file_name: { type: String, default: null },
  status: { type: String, default: 'pending' }, // pending, processing, completed, failed
  progress: { type: Number, default: 0 },
  samples_count: { type: Number, default: 0 },
  started_at: { type: Date, default: Date.now },
  completed_at: { type: Date, default: null },
  duration_ms: { type: Number, default: null },
}, { timestamps: true, collection: 'measurement_data' });

EnoseMeasurementDataSchema.index({ device_id: 1, createdAt: -1 });

module.exports = mongoose.model('EnoseMeasurementData', EnoseMeasurementDataSchema);

