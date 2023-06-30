const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let attendance = new Schema({
    user_number: {
        type: String,
        required: true,
        maxlength: 50
    },
    arrival_time: {
      type: Date,
      default: null
    },
    leave_time: {
      type: Date,
      default: null
    },
    created_at: {
      type: Date,
      required: true,
    },
    updated_at: {
      type: Date,
      required: true,
      default: Date.now
    },
    ip: {
      type: String,
    },
    mac:{
      type: String
    }
});

// Export the model

module.exports = mongoose.model('attendances', attendance);