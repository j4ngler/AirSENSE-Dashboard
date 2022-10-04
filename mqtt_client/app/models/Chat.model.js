const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Chat = new Schema({
    comment_id: {
        type: Number
    },
    topic: {
        type: String
    },
    content:{
        type: Object
    },
    time: {
        type: Number,
        default: Date.now()
    }
});

// Export the model
module.exports = mongoose.model('comment', Chat);