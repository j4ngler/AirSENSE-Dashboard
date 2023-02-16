const mongoose = require('mongoose');
const { MongoToRead } = require('../config/mongoConfig');
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
module.exports = MongoToRead.model('sensor', DataSensor);