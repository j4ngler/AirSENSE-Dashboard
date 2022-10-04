
const {mangerModel} = require('../models/database/managerAll');

var chatCtrl={};
 

chatCtrl.getTableData =function (req, res) {

/*
  ChatRoom.findById(chatRoomID)
  .exec()
  .then((chatRoom) => {
    if (chatRoom.chatType === 'group') {
      res.render('admin', { title: 'Chat App | Edit Chat Room' });
    } else {
      res.redirect('/admin');
    }
  })
  .catch((error) => {
    res.status(500).send({
      success: false,
      message: 'Server Error!'
    });
  });*/

}

chatCtrl.getAllTableData = async function  (req, res) {
  try
  {
      console.log("listUser",req.currentUser);
      var data={list_friend_chat:[],persional_chat:[],group_chat:[]};
      var tableCurrent = mangerModel('list_friend_chat');
      data.list_friend_chat= await tableCurrent.getAllInfoUser(req.currentUser.users_id);
      tableCurrent = mangerModel('persional_chat');
      data.persional_chat= await tableCurrent.getAllInfoUser(req.currentUser.users_id);
      tableCurrent = mangerModel('group_chat');
      console.log("listUser  group_chat",data);
      data.group_chat= await tableCurrent.getAllInfoUser(req.currentUser.users_id);
      res.send(JSON.stringify(data))

  }
  catch(ie)
  {
    res.status(500).send({success: ie, message: 'Server Error!'});
  }
  
}

chatCtrl.getRoomChatFriend = async function  (req, res) {
  try
  {
    console.log("getRoomChatFriend.......1");
    req.body["user_friend_id1"]=req.currentUser.users_id;
    var tableCurrent = mangerModel('persional_chat');
    var data= await tableCurrent.getAllInfoUserChatFriend(req.body.user_friend_id1,req.body.user_friend_id2);
    console.log("getRoomChatFriend.......1",data);
    if(data.length==0){
      req.body["name"]="friend";
      req.body["user_friend_id1"]=req.currentUser.users_id;
      req.body["color"]="color";
      req.body["icon"]="1";
      var dataID= await tableCurrent.createDataToSql(req);
      console.log("getRoomChatFriend.......dataID",dataID);
      if(dataID==0) res.status(500).send({success: dataID, message: 'Server Error!'});
      else {  
        req.body["persional_chat_id"]=dataID;
        res.send(JSON.stringify(req.body));
      }
    } 
    else
      res.send(JSON.stringify(data[0]));

  }
  catch(ie)
  {
    res.status(500).send({success: ie, message: 'Server Error!'});
  }  
}

chatCtrl.createRoomChatGroupChat = async function  (req, res) {
  try
  {
      var tableCurrent = mangerModel('group_chat');
      var dataID= await tableCurrent.createDataToSql(req);
        if(dataID==0) res.status(500).send({success: err, message: 'Server Error!'});
        else {  
          req.body["persional_chat_id"]=dataID;
          req.body["userid"]=req.currentUser.users_id;
          tableCurrent = mangerModel('group_chat_detail');
          dataID= await tableCurrent.createDataToSql(req);
          res.send(JSON.stringify(req.body));
        }
  }
  catch(ie)
  {
    res.status(500).send({success: ie, message: 'Server Error!'});
  }  
}

chatCtrl.addUserToGroupChat = async function  (req, res) {
  try
  {
        var   tableCurrent = mangerModel('group_chat_detail');
        var  dataID= await tableCurrent.createDataToSql(req);
        res.send(dataID);
  }
  catch(ie)
  {
    res.status(500).send({success: ie, message: 'Server Error!'});
  }  
}


chatCtrl.addDataToTable= async  function (req, res) {
  var table =req.body.table;
  var tableSelect=mangerModelAdmin(table);
  if(!!tableSelect){
    let data=req.body;
    var  dataID= await tableCurrent.createDataToSql(req);
    if(dataID>0 )  return returnOK(res,result[0]);  
    else  return returnFalse(res,error);
  }
  else
  {
    return returnNotFound(res,{ message: "Database inval" });
  }
}



chatCtrl.deleteData= async function (req, res) {
  var tableSelect=mangerModelAdmin(req.body.table);
  if(!!!tableSelect){
    return returnNotFound(res,{ message: "Database inval" });
  }
  if(!await tableSelect.checkDataToEdit(req)){
    return returnFalse(res,{ message: "Database not access lv2" });
  }
  let data=req.body;
  let dataUser= tableSelect.getFieldToDelete();
  var deleteSQL = squel.update().table(tableSelect.getNameTable())
    .set("id_updated",req.currentUser.users_id)
    .set("updated_at","NOW()",{dontQuote: true})
    .set("deleteflag",1)
    .where(dataUser.locationSelect+'='+data[dataUser.locationSelect]);
  knex.raw(deleteSQL.toString())
      .then(function(x) {
          return returnOK(res,x);   
      }).catch(function(err){
        return returnNotFound(res,{ message: "Database inval" });   
      });
}



chatCtrl.updateData= async  function (req, res) {

  var tableSelect=mangerModelAdmin(req.body.table);  
  if(!!!tableSelect){
    return returnNotFound(res,{ message: "Database inval" });
  }
  if(!tableSelect.checkDataEditDatabase(req.currentUser.permission_id,tableSelect.getTypeTable())){
    return returnNotFound(res,{ message: "Database not Acess 1" });
  }
  if(!await tableSelect.checkDataToEdit(req)){
    return returnNotFound(res,{ message: "Database not Acess 2" });
  }

  let data=req.body;
  var userid=req.currentUser.users_id;
  let dataUser=tableSelect.getFieldToDelete();
  var squelGet=squel.select().from(tableSelect.getNameTable());
  for(var i=0;i<dataUser.arrayCoppy.length;i++){
        let item=dataUser.arrayCoppy[i];
    /*    if(!!!data[item]) squelGet.set(item,null);
       else
        authen.set(item,data[item]);
     */
      squelGet.field(item);
  }
  squelGet.where(dataUser.locationSelect+'='+data[dataUser.locationSelect]);
  var authen = squel.insert().into(tableSelect.getNameTable())
                      .fromQuery( dataUser.arrayCoppy, squelGet);
                      console.log("updateDataauthen.toString() ",authen.toString());
  var dataAdd= await knex.raw(authen.toString());
  if((dataAdd==null)||(dataAdd.length<1)) return returnNotFound(res,"Không tồn tại bản ghi dữ liệu này");     
  var authen2 = squel.update().table(tableSelect.getNameTable());
                        authen2.where(dataUser.locationSelect+'='+dataAdd[0].insertId)
                        .set(dataUser.valueSelect,1) 
                        .set("id_updated",userid)
                        .set("oldid",data[dataUser.locationSelect])
                        .set("deleteflag",1)
                        .set("updated_at","NOW()",{dontQuote: true});
  var deleteAdd= await knex.raw(authen2.toString());
  if((deleteAdd==null)||(deleteAdd.length<1)) return returnFalse(res,"Lỗi cập nhật dữ liệu"); 
  var sqlData = await tableSelect.checkSqlUpdateAdmin(req,data);   
  knex.raw(sqlData).then(function(x) {
      return returnOK(res,x);
  }).catch(function(err){
      return returnFalse(res,err);
  });
}

module.exports = chatCtrl;
