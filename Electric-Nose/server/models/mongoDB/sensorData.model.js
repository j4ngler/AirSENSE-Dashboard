const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    index: true
  },
  // SHT85 Sensor (Temperature & Humidity)
  temperature: {
    type: Number,
    default: null,
    comment: 'Temperature from SHT85 sensor (°C)'
  },
  humidity: {
    type: Number,
    default: null,
    comment: 'Humidity from SHT85 sensor (%)'
  },
  // 8 MEMS Sensors
  mems1: {
    type: Number,
    default: null,
    comment: 'MEMS Sensor 1 value'
  },
  mems2: {
    type: Number,
    default: null,
    comment: 'MEMS Sensor 2 value'
  },
  mems3: {
    type: Number,
    default: null,
    comment: 'MEMS Sensor 3 value'
  },
  mems4: {
    type: Number,
    default: null,
    comment: 'MEMS Sensor 4 value'
  },
  mems5: {
    type: Number,
    default: null,
    comment: 'MEMS Sensor 5 value'
  },
  mems6: {
    type: Number,
    default: null,
    comment: 'MEMS Sensor 6 value'
  },
  mems7: {
    type: Number,
    default: null,
    comment: 'MEMS Sensor 7 value'
  },
  mems8: {
    type: Number,
    default: null,
    comment: 'MEMS Sensor 8 value'
  },
  // Metadata
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'sensor_data'
});

// Index để query nhanh hơn
sensorDataSchema.index({ device_id: 1, timestamp: -1 });
sensorDataSchema.index({ timestamp: -1 });

const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;

