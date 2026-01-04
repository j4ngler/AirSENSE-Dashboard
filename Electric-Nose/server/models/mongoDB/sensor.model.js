const mongoose = require('mongoose');

/**
 * Model để đọc từ collection 'sensor' chung của AirSENSE
 * Schema: { topic, time, content }
 * Topic format: electric-nose/<device_id>/sensor-data
 */
const sensorSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    index: true
  },
  time: {
    type: Number,
    required: true,
    index: true
  },
  content: {
    type: Object,
    default: {}
  }
}, {
  collection: 'sensor', // Collection chung của AirSENSE
  strict: false // Cho phép lưu thêm fields không định nghĩa
});

// Index để query nhanh hơn
sensorSchema.index({ topic: 1, time: -1 });
sensorSchema.index({ time: -1 });

// Virtual để extract device_id từ topic
// Topic format: electric-nose/device/{device_id}/sensor
sensorSchema.virtual('device_id').get(function() {
  if (!this.topic) return null;
  const parts = this.topic.split('/');
  // parts[0] = "electric-nose", parts[1] = "device", parts[2] = device_id, parts[3] = "sensor"
  return parts.length >= 3 ? parts[2] : null;
});

// Method để format dữ liệu cho frontend
sensorSchema.methods.toSensorData = function() {
  const content = this.content || {};
  return {
    device_id: this.device_id,
    timestamp: this.time,
    timestamp_iso: new Date(this.time * 1000).toISOString(),
    temperature: content.Temperature || null,
    humidity: content.Humidity || null,
    adc: [
      content.ADC0 || 0,
      content.ADC1 || 0,
      content.ADC2 || 0,
      content.ADC3 || 0,
      content.ADC4 || 0,
      content.ADC5 || 0,
      content.ADC6 || 0,
      content.ADC7 || 0,
    ]
  };
};

const Sensor = mongoose.models.sensor || mongoose.model('sensor', sensorSchema);

module.exports = Sensor;

