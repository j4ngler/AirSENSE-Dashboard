const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let PowerSensor = new Schema({
    topic: {
        type: String
    },
    time: {
        type: Number
    },
    content: {
        type: Object
    }
});

// Export the model
module.exports = mongoose.model('power_meter', PowerSensor);