const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ShrimpLakeSensor = new Schema({
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
module.exports = mongoose.model('iot_dam_tom', ShrimpLakeSensor);