const knex = require('../../config/knex');
const Comment = require('../models/Comment.model')


class CommentController {
    // GET: get all comment 
    getAll(req, res, next){
        console.log(req);
        Comment.find()
            .then(comments => {
                res.send(JSON.stringify(comments))
            })
            .catch(next)
    }
    // GET: get comment by topic
    getCommentByTopic(req,res,next){
        console.log(req);

        const topic = new RegExp(req.body.topic, "i");
        Comment.find({topic: topic})
            .then(comments => {
                res.send(JSON.stringify(comments))
            })
            .catch(error=>{
                console.log(error);
                res.send(JSON.stringify("Can not find comment"))
            })
    }
    // GET: get person's comment
    getPersonComment(req,res,next){
        const user_id = Number.parseInt(req.body.user_id);
        Comment.find({"content.author_id": user_id})
            .then(comment => res.send(JSON.stringify(comment)))
            .catch(error => {
                console.log(error);
                res.send(JSON.stringify("Can not find comment"))

            })
    }
    // GET: get person's comment relate 
    getRealateComment(req,res,next){
        const user_id = Number.parseInt(req.body.user_id);
        Comment.find({
            $or: [
                { "content.author_id": user_id },
                { "content.comment_parent_id": user_id },
                { "comment_reply_id": user_id }
              ]
        })
        .then(comment => res.send(JSON.stringify(comment)))
            .catch(error => {
                console.log(error);
                res.send(JSON.stringify("Can not find comment"))

            })
    }
    // POST: Send comment
    sendComment(req,res,next){
        console.log(req);
    }
    
}
module.exports = new CommentController;