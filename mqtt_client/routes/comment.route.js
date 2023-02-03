const express = require('express');
const router = express.Router();
const Chat = require('../app/models/chat.model');
const Comment = require('../app/models/comment.model.js');
const adminAuthenticated = require('../middlewares/authenticate.js');
const customerAuthenticated = require('../middlewares/authenticateCustomer');
const chatCtrl = require('../controllers/chat.controller');
const mqtt = require('mqtt');
const checkParentId = require('../middlewares/getParentCommentId');
const getParentCommentId = require('../middlewares/getParentCommentId');
// var option={
// 	port:3002,
// 	clientId : 'message_' + Math.random().toString(16).substr(2, 8),
// 	username : "test",
// 	useNewUrlParser: true,
// 	password: 'testadmin'
// };

// var client = mqtt.connect('ws://localhost:3002', option);
// client.on('connect', function(){

// });


// router.route('/comment_user').post(adminAuthenticated, checkParentId, (req, res) => {
router.route('/comment_user').post( (req, res) => {

  // console.log("chat",req.body);
  var currentTime = Math.floor((new Date()).getTime()/1000);
  var currentPost = 'usr_' + currentTime + '_2';
  let commentParentId = currentPost;
  // if(req.parentId !==0) commentParentId = req.parentId;
  
  var infoSave ={
    topic:req.body.topic,
    commentId:currentPost,
    content:{
      // author_id:req.currentUser.users_id,
      author_id: 2, //fake ID user
      type_user: 1,
      author_IP:req.body.author_IP,
      content:req.body.content,
      coment_tag:req.body.coment_tag, 
      comment_atack:req.body.comment_atack,
      comment_parent_id: req.body.comment_parent_id,
      comment_reply_id: req.body.comment_reply_id
    },
    time:currentTime

  };

  console.log('comment', infoSave);

  Comment.insertMany(infoSave, function (err, data) {
    if (err) {
    console.log('error', err);
      res.status(500).send({success: err, message: 'Server Error!'});
    }
    else{
      console.log('ok')
      // client.publish(infoSave.topic, JSON.stringify(infoSave));
      res.send(JSON.stringify({content:infoSave.content,time:infoSave.time}));
    }
  });
});


router.route('/info_mqtt').get(adminAuthenticated,(req, res) => {
  res.send(JSON.stringify({host: 'ws://localhost',port:3002,server:"ws://localhost:3002",
                          username:"test",password:"testadmin"}));
});

router.route('/find_chat').post(adminAuthenticated,chatCtrl.getAllTableData);
router.route('/find_comment').post(adminAuthenticated, (req, res) => {
  let name = {
    content_group: 1,
    content_sub: 1,
    content_page: 1
  }
  res.json({
    data: name
  })
})

router.route('/find_parent_comment_id').post(adminAuthenticated, (req, res) => {
  let chatRoom = '/comment/' + req.body.content.post_id;
  console.log(req.body);
    Chat.find({topic:chatRoom, comment_id: req.body.content.comment_reply_id}, (error, result) => {
        console.log('comment parent', result);
        const abc = result[0].content.comment_parent_id;
  res.send(JSON.stringify({comment_parent_id: abc}));

    });
  
})
// router.route('/find_chat').post(adminAuthenticated, (req, res) => {
//   var result = {
//     list_friend_chat: [],
//     persional_chat: [
//         {
//             persional_chat_id: 12,
//             name: "friend",
//             color: "color",
//             icon: "1",
//             user_friend_id1: 1,
//             user_friend_id2: 13,
//             created_at: "2021-12-27T13:55:32.000Z",
//             updated_at: "2021-12-27T13:55:32.000Z",
//             id_created: 1,
//             id_updated: 1,
//             deleteflag: 0,
//             oldid: null
//         },
//         {
//             persional_chat_id: 25,
//             name: "friend",
//             color: "color",
//             icon: "1",
//             user_friend_id1: 13,
//             user_friend_id2: 16,
//             created_at: "2022-01-20T15:20:24.000Z",
//             updated_at: "2022-01-20T15:20:24.000Z",
//             id_created: 13,
//             id_updated: 13,
//             deleteflag: 0,
//             oldid: null
//         }
//     ],
//     group_chat: []
// }
//   // res.json({
//   //   data: result
//   // });
// })
// thêm PHÒNG CHAT với bạn bè 1 NGƯỜI
router.route('/create_friend').post(adminAuthenticated,chatCtrl.getRoomChatFriend);
// tạo nhóm chat với bạn bè
router.route('/create_group').post(adminAuthenticated,chatCtrl.createRoomChatGroupChat);
// thêm 1 người nhóm chat
router.route('/add_person_to_group').post(adminAuthenticated,chatCtrl.addUserToGroupChat);
// thay đổi thông tin phòng chat thông tin 1 người
router.route('/manager_add').post(adminAuthenticated,chatCtrl.addDataToTable);
router.route('/manager_delete').post(adminAuthenticated,chatCtrl.deleteData);  
router.route('/manager_update').post(adminAuthenticated,chatCtrl.updateData);

router.route('/sendMessages').post(adminAuthenticated,(req, res) => {
  Chat.find({topic:req.body.chatRoom,content:{$coment_tag: null} })
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

// thu hồi tin nhắn
router.route('/removeMessages').post(adminAuthenticated,(req, res) => {
  Chat.find({topic:req.body.chatRoom,content:{$coment_tag: null} })
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

router.route('/admin_content').post(adminAuthenticated,(req, res) => {
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

router.route('/tag_content').post(adminAuthenticated,(req, res) => {
    Chat.find({topic:req.body.chatRoom,content:{$coment_tag: null} })
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


router.route('/file_content').post(adminAuthenticated,(req, res) => {
    Chat.find({topic:req.body.chatRoom ,content:{$comment_atack: null}})
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


router.route('/cus_content').post(customerAuthenticated,(req, res) => {
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

router.route('/delete').post(customerAuthenticated,(req, res) => {
    
    Chat.find({content:{chat_id:req.body.chatRoom }})
      .then((chatRoom) => {
        for (let i = 0; i < chatRooms.length; i += 1) {
            const chatRoomID = chatRooms[i]._id;
            ChatRoom.findByIdAndUpdate(
                chatRoomID,
                { $content: {delete: true} },
                { new: true, upsert: true }
              ).exec();
        }
        res.send(JSON.stringify({chatRoom:chatRoom}));
      })
      .catch((error) => {
        res.status(500).send({
          success: error,
          message: 'Server Error!'
        });
      });
});

router.route('/update').post(customerAuthenticated,(req, res) => {
    // check inval
    Chat.find({content:req.body.chatRoom })
      .then((chatRoom) => {
        for (let i = 0; i < chatRooms.length; i += 1) {
            const chatRoomID = chatRooms[i]._id;
            ChatRoom.findByIdAndUpdate(
                chatRoomID,
                { $content: {delete: true} },
                { new: true, upsert: true }
              ).exec();
        }
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