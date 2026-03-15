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
    }
});

// Export the model
module.exports = mongoose.model('sensor', DataSensor);