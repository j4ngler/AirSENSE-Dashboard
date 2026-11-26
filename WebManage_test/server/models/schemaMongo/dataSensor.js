const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let DataSensor = new Schema({
    topic: {
        type: String
    },
    time: {
        type: Number
    },
    content: {
        type: Object
    },
    enose_rollup_pending: Boolean,
    enose_retention: String,
    enose_heater_active: Boolean,
    enose_expires_at: Date
});

// Export the model
module.exports = mongoose.model('sensor', DataSensor);
