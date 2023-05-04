const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Comment = new Schema({
    topic: {
        type: String
    },
    commentId: {
        type: String
    },
    content:{
        type: Object
    },
    time: {
        type: String,
    }
});

// Export the model

module.exports = mongoose.model('comments', Comment);