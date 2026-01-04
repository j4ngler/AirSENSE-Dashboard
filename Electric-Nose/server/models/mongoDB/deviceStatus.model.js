const mongoose = require('mongoose');

const deviceStatusSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'error'],
    default: 'offline'
  },
  wifi_ssid: {
    type: String,
    default: null
  },
  wifi_signal: {
    type: Number,
    default: null // dBm
  },
  wifi_status: {
    type: String,
    enum: ['connected', 'disconnected'],
    default: 'disconnected'
  },
  wifi_ip: {
    type: String,
    default: null
  },
  storage: {
    total: {
      type: Number,
      default: 0 // bytes
    },
    used: {
      type: Number,
      default: 0 // bytes
    },
    free: {
      type: Number,
      default: 0 // bytes
    }
  },
  // Trạng thái các thiết bị
  heating_enabled: {
    type: Boolean,
    default: false
  },
  air_pump_enabled: {
    type: Boolean,
    default: false
  },
  wifi_enabled: {
    type: Boolean,
    default: false
  },
  // Metadata
  last_seen: {
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
  collection: 'device_status'
});

// Index
deviceStatusSchema.index({ device_id: 1, last_seen: -1 });
deviceStatusSchema.index({ status: 1 });

const DeviceStatus = mongoose.model('DeviceStatus', deviceStatusSchema);

module.exports = DeviceStatus;

