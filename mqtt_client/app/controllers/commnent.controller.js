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
                var listComment = [];
// TODO: code thêm trường time để trả về cho FE
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
        const user_id = Number.parseInt(req.currentUser.users_id);
        Comment.find({"content.author_id": user_id})
            .then(comment => res.send(JSON.stringify(comment)))
            .catch(error => {
                console.log(error);
                res.send(JSON.stringify("Can not find comment"))

            })
    }
    // GET: get person's comment relate 
    getRealateComment(req,res,next){
        const user_id = Number.parseInt(req.currentUser.users_id);
        Comment.find({
            $or: [
                { "content.author_id": user_id },
                { "content.comment_parent_id": user_id },
                { "content.comment_reply_id": user_id }
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
        
       
        if(req.body.comment_reply_id){
            
        Comment.findOne({_id: req.body.comment_reply_id})
            .then(comment =>{
                const commentSave = new Comment({
                    topic: req.body.topic,
                    content:{
                        author_id: req.currentUser.users_id,
                        type_user: req.currentUser.manifestid,
                        author_IP: req.ip,
                        content: req.body.comment,
                        comment_attack: req.body.comment_attack ? req.body.comment_attack: "",
                        comment_parent_id: comment.content.comment_parent_id == ""?`${comment._id}/`:`${comment.content.comment_parent_id}${comment._id}/`,
                        comment_reply_id: req.body.comment_reply_id
                    },
                })
                commentSave.save()
                .then(comment => {
                    console.log("comment save",comment);
                    
                    res.send(JSON.stringify("Saved comment"))
                })
                .catch(err => {
                    res.send(JSON.stringify("Can not save comment"))
                    console.log(err);
                })
            })
            .catch(err => {
                res.send(JSON.stringify("Can not save comment"))
                console.log(err);
            })
        }
        else{
            const comment = new Comment({
                topic: req.body.topic,
                content:{
                    author_id: req.currentUser.users_id,
                    type_user: req.currentUser.manifestid,
                    author_IP: req.ip,
                    content: req.body.comment,
                    comment_attack: req.body.comment_attack ? req.body.comment_attack: "",
                    comment_parent_id: "",
                    comment_reply_id: ""
                },
            })
            comment.save()
            .then(comment => {
                console.log("comment save",comment);
                
                res.send(JSON.stringify("Saved comment"))
            })
            .catch(err => {
                res.send(JSON.stringify("Can not save comment"))
                console.log(err);
            })
        }
       
    }
    deleteComment(req,res,next){
        const user_id = req.currentUser.users_id;
        const _id = req.body._id;
        const comment_parent_id = new RegExp(_id, "i");

        Comment.deleteMany({$or:[{"_id": _id},{"content.comment_parent_id":comment_parent_id}]})
            .then((item)=> res.send(JSON.stringify(item)))
            .catch((error)=> res.send(JSON.stringify("Can not delete")))
    }
    
}
module.exports = new CommentController;