const CommentController = require('../app/controllers/commnent.controller')
const express = require('express');
const authenticated = require('../middlewares/authenticate');
const router = express.Router();


/**  quy ước: 
 * 
 * các router dùng để quy định các hành động khi comment như send comment, delete comment thì sẽ thêm router /action
VD: 
*/
router.get('/action/send', CommentController.sendComment)
router.get('/comment', CommentController.getAll)
router.post('/comment-by-topic', CommentController.getCommentByTopic)
router.get('/get-user-id',CommentController.getAllUser)




module.exports = router;
