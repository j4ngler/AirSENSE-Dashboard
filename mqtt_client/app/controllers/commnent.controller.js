const knex = require('../../config/knex');
const Comment = require('../models/Comment.model')

const convertArr =(array) => {
    return array.map((item,index)=> {
        return{
            _id:array._id.getTimestamp(),
            ...item
        }
    })
}
class CommentController {
    // GET: get all comment 
    getAll(req, res, next){
        
        Comment.find()
            .then(comments => {
                res.send(JSON.stringify(comments))
            })
            .catch(next)
    }
    
    // GET: get comment by topic
    getCommentByTopic(req,res,next){
        
        const topic = new RegExp(req.body.topic, "i");
        Comment.find({topic: topic})
            .then(comments => {
                var listComments = convertArr(comments)
                
                
                
                res.send(JSON.stringify(listComments))
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
        const comment = new Comment({
            topic: req.body.topic,
            content:{
                author_id: req.currentUser.users_id,
                type_user: req.currentUser.manifestid,
                author_IP: req.ip,
                content: req.body.comment,
                comment_attack: req.body.comment_attack ? req.body.comment_attack: "",
                comment_parent_id: req.body.comment_parent_id ? req.body.comment_parent_id : 0,
                comment_reply_id: req.body.comment_reply_id ? req.body.comment_reply_id : 0
            },
        })
        comment.save()
        .then(comment => {
            console.log(comment);
            
            res.send(JSON.stringify("Save comment"))
        })
        .catch(err => {
            res.send(JSON.stringify("Can not send comment"))
            console.log(err);
        })
    }
    
}
module.exports = new CommentController;