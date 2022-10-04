const express = require('express');
const router = express.Router();
const Chat = require('../app/models/Chat.model');


router.route('/login').get((req, res) => {
    res.send(JSON.stringify({sample:false}));
});

router.route('/content').post((req, res) => {
  console.log(req.body)
    Chat.find({topic:req.body.chatRoom })
      .then((chatRoom) => {
        res.send(JSON.stringify({chatRoom:chatRoom}));
      })
      .catch((error) => {
        res.status(500).send({
          success: error,
          message: 'Server Error!'
        });
      });
});

router.route('/load_all').post((req, res) => {
  var typeChat= req.body.type+"/"+req.body.chatRoom;
  Chat.find({topic:typeChat}).limit(1000) //.skip(20)
    .then((chatRoom) => {
      res.send(JSON.stringify({chatRoom:chatRoom}));
    })
    .catch((error) => {
      res.status(500).send({
        success: error,
        message: 'Server Error!'
      });
    });
});



module.exports = router;