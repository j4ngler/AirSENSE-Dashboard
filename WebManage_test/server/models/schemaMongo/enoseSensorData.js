const mongoose = require('mongoose');

const EnoseSensorDataSchema = new mongoose.Schema({
  device_id: { type: String, required: true, index: true },
  temperature: { type: Number, default: null },
  humidity: { type: Number, default: null },
  mems1: { type: Number, default: null },
  mems2: { type: Number, default: null },
  mems3: { type: Number, default: null },
  mems4: { type: Number, default: null },
  mems5: { type: Number, default: null },
  mems6: { type: Number, default: null },
  mems7: { type: Number, default: null },
  mems8: { type: Number, default: null },
  timestamp: { type: Date, default: Date.now, index: true },
}, { timestamps: true, collection: 'sensor_data' });

EnoseSensorDataSchema.index({ device_id: 1, timestamp: -1 });

module.exports = mongoose.model('EnoseSensorData', EnoseSensorDataSchema);
