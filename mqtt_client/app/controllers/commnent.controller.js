const knex = require('../../config/knex');
const Comment = require('../models/Comment.model')


class CommentController {
    // GET: get all comment 
    getAll(req, res, next){
        Comment.find()
            .then(comments => {
                res.send(JSON.stringify(comments))
            })
            .catch(next)
    }
    // POST: get comment by topic
    getCommentByTopic(req,res,next){
        const topic = new RegExp(req.body.topic, "i");
        Comment.find({topic: topic})
            .then(comments => {
                res.send(JSON.stringify(comments))
            })
            .catch(errr=>{
                console.log(errr);
            })
    }
    // GET: get all user in table list_user_id
    getAllUser = async function(req,res,next){
        const sqlQuerry = "SELECT user_id AS userId, username FROM list_user_id"
        await knex.raw(sqlQuerry)
            .then(data => {
                res.send(JSON.stringify(data))
            })
            .catch(next)
       
    }

    // POST: send comment 
    sendComment = (req,res,next) => {
        const comment = new Comment(req.body);
        Comment.save(comment)
    }

}
module.exports = new CommentController;