const mongoose = require('mongoose');
const { MongoToWrite } = require('../config/mongoConfig');
const Schema = mongoose.Schema;

const PM2P5Schema = new Schema({
    time: Date,
    value: Number,
    sensor: String
  },
  {
    timeseries: {
      timeField: 'time',
      metaField: 'sensor',
    },
});

// Export the model
module.exports = MongoToWrite.model('PM2P5_data', PM2P5Schema);