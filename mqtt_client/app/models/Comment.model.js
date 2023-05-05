const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Comment = new Schema({
    topic: {
        type: String
    },
    content:{
        author_id: {
            type: Number,
            required: true
          },
          type_user: {
            type: Number,
            required: true
          },
          author_IP: {
            type: String,
            required: true
          },
          content: {
            type: String,
            required: true
          },
          comment_atack: {
            type: String,
            default: ""
          },
          comment_parent_id: {
            type: Number,
            default: 0
          },
          comment_reply_id: {
            type: Number,
            default: 0
          }
    },
    
});

// Export the model

module.exports = mongoose.model('comments', Comment);