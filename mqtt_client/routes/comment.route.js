const CommentController = require('../app/controllers/commnent.controller')
const express = require('express');

const router = express.Router();
const validate = require("../config/joi.validate.js")
const schema = require("../utils/validator.js");
const isAuthenticated = require('../middlewares/authenticate');
const isAuthenticatedCustomer = require('../middlewares/authenticateCustomer')


router.get('/', isAuthenticated, CommentController.getAll)
router.get('/get-by-topic', isAuthenticated, validate(schema.commentTopic), CommentController.getCommentByTopic)
router.get('/get-by-person', isAuthenticated, CommentController.getPersonComment)
router.get('/get-relate-person', isAuthenticated, CommentController.getRealateComment)
router.post('/send', isAuthenticated, validate(schema.comment),CommentController.sendComment)
router.delete('/delete',isAuthenticated,validate(schema.commentId),CommentController.deleteComment)
module.exports = router;
