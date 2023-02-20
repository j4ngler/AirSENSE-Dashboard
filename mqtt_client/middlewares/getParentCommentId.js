const Chat = require('../app/models/chat.model')

module.exports = (req, res, next) => {
    if(req.body.id_comment_reply==0) {
        req.parentId = 0;
        next();
    }
    else{
    let chatRoom = '/comment/' + req.body.post_id;
    Chat.find({topic:chatRoom, comment_id: req.body.id_comment_reply}, (error, result) => {
        console.log('this is the comment parent', result);
        req.parentId = result[0].content.comment_parent_id;
        next();

    });
}
}