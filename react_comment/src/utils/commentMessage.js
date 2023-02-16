
// const moment = require('moment');

const data = [
    {
    _id: 'ObjectId(63d14a91ef12ca38ec6c01af)',
    topic: "product/smart_device/5",
    commentId: "usr_1674660497_2",
    content: {
    author_id: 2,
    type_user: 1,
    author_IP: "171.236.58.19",
    content: "Hi Giang",
    comment_atack: "",
    comment_parent_id: 0,
    comment_reply_id: 0
    },
    time: "1674660497",
    __v: 0            
    },
    {
    _id: 'ObjectId(63d14af2ef12ca38ec6c01b3)',
    topic: "product/smart_device/5",
    commentId: "cus_1674660609_4",
    content: {
    author_id: 4,
    type_user: 2,
    author_IP: "171.236.58.19",
    content: "Hi Giang handsome",
    comment_atack: "",
    comment_parent_id: 0,
    comment_reply_id: 0
    },
    time: "1674660609",
    __v: 0
    },
    {
        _id: 'ObjectId(63d14b18ef12ca38ec6c01b7)',
        topic: "product/smart_device/5",
        commentId: "cus_1674660668_4",
        content: {
        author_id: 4,
        type_user: 2,
        author_IP: "171.236.58.19",
        content: "acknowledgement",
        comment_atack: "",
        comment_parent_id: 0,
        comment_reply_id: 0,
        },
        time: "1674660668",
        __v: 0
    },
    {
        _id: 'ObjectId(63d14b18ef662138ec6c01b7)',
        topic: "product/smart_device/5",
        commentId: "usr_1675611574_2",
        content: {
        author_id: 2,
        type_user: 1,
        author_IP: "171.236.58.19",
        content: "reply 1",
        comment_atack: "",
        comment_parent_id: 'usr_1674660497_2',
        comment_reply_id: 'usr_1674660497_2'
        },
        time: "1675611574",
        __v: 0
    },
    {
        _id: 'ObjectId(63d17235ef12ca38ec6c01b7)',
        topic: "product/smart_device/5",
        commentId: "cus_1675611697_4",
        content: {
        author_id: 4,
        type_user: 2,
        author_IP: "171.236.58.19",
        content: "reply 2",
        comment_atack: "",
        comment_parent_id: 'usr_1674660497_2',
        comment_reply_id: 'usr_1674660497_2'
        },
        time: "1675611697",
        __v: 0
    },
    {
        _id: 'ObjectId(63d121a5ef12ca38ec6c01b7)',
        topic: "product/smart_device/5",
        commentId: "cus_1675611774_5",
        content: {
        author_id: 5,
        type_user: 2,
        author_IP: "171.236.58.19",
        content: "food and drink🤣 😂 😂",
        comment_atack: "",
        comment_parent_id: 'usr_1674660497_2',
        comment_reply_id: 'cus_1675611697_4'
        },
        time: "1675611774",
        __v: 0
    },
    {
        _id: 'ObjectId(63d121a5ef12ca38ec6c01b7)',
        topic: "product/smart_device/5",
        commentId: "cus_1675611942_5",
        content: {
        author_id: 5,
        type_user: 2,
        author_IP: "171.236.58.19",
        content: "sea food",
        comment_atack: "",
        comment_parent_id: 'usr_1674660497_2',
        comment_reply_id: 'cus_1675611697_4'
        },
        time: "1675611942",
        __v: 0
    },

]


class CommentManagement {
    constructor(commentData){
        // this.commentId = commentData.commentId;
        // this.content = commentData.content;
        // this.time = commentData.time;
        // this.__v = commentData.__v;
    }
    
    findParentComment(data, id) {
        console.log(data)
        console.log(id)
        let found = data.findIndex(o => o.commentId ==id);
                if(found > -1) { 
                    return found;
                }
                return  null;
    }

    findUser(id) {
        return 'Long Nguyen Hoang';
    }

    modifyData() {
        let result=[];
            data.forEach(element => {
                let dataInsert= JSON.parse(JSON.stringify(element));
                // var day = moment(dataInsert.time);
                dataInsert['timeSend']= '20:32 10/2/2022';
                dataInsert['author']=this.findUser(dataInsert.content.author_id);
                dataInsert['children'] = [];
                dataInsert['timeConvert'] = this.timeConverter(dataInsert.time);
                if(dataInsert.content.comment_reply_id !== 0){  // id_comment_reply
                    let idPrent = this.findParentComment(result, dataInsert.content.comment_parent_id);
                    // console.log(idPrent)
                    result[idPrent].children.push(dataInsert);
                    return result;
                }
                result.push(dataInsert);
            });
//             console.log("informChatboxDataChat ",messageInfo);
            let newDataSort=[];
            for(let i=(result.length-1); i>-1; i--){
                newDataSort.push(result[i]);
            }
        return newDataSort;

    }


    timeConverter(UNIX_timestamp) {
        let a = new Date(UNIX_timestamp * 1000);
        let months = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                            'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
        let year = a.getFullYear();
        let month = months[a.getMonth()];
        let date = a.getDate();
        let hour = a.getHours();
        let min = a.getMinutes();
        let sec = a.getSeconds();
        let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
    }
    commentSortTime(commentData){
        if(this.time > commentData.time){
            let temp1 = this.commentId;
            this.commentId = commentData.commentId;
            commentData.commentId = temp1;
            
            let temp2 = this.content;
            this.content = commentData.content;
            commentData.content = temp2;

            let temp3 = this.time;
            this.time = commentData.time;
            commentData.time = temp3;

            let temp4 = this.__v;
            this.__v = commentData.__v;
            commentData.__v = temp4;
        }
    }
    deleteCommentData(index){
        this.commentId="";
        this.content={};
        this.time = "";
        this.__v=0;
        

    }
    display(){

    }

    
}
const cmt = [];
for(let i = 0; i<data.length;i++){
     cmt[i] = new CommentManagement(data[i]);
}
for(let i = 0; i<cmt.length;i++){
    for(let j = i+1; j< cmt.length;j++){
        cmt[i].commentSortTime(cmt[j]);
    }
}
for(let i = 0; i< cmt.length; i++){
    if(cmt[i].comment_parent_id == 0){
        cmt[i].display();
        cmt[i].deleteCommentData(i);
    }
}

// class ChatMessage {

//     timeConverter = (UNIX_timestamp)=>{
//         var a = new Date(UNIX_timestamp * 1000);
//         var months = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
//                             'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
//         var year = a.getFullYear();
//         var month = months[a.getMonth()];
//         var date = a.getDate();
//         var hour = a.getHours();
//         var min = a.getMinutes();
//         var sec = a.getSeconds();
//         var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
//         return time;
//       }

//     compareChatbox = (a, b)=> {
//         if ( a.time < b.time ){
//             return -1;
//         }
//         else
//         if ( a.time > b.time ){
//             return 1;
//         }
//         return 0;
//     }
    
//     shortDataChatbox(data){
//         data= data.sort(this.compareChatbox);
//         var newData=[];
//         var acessData =[];
//         data.forEach(element => {
//             if(element.content.comment_parent_id==0){
//                 element.content.otherContent =[];
//                 newData.push(element);
//             }
//             else
//             {
//                 acessData.push(element);
//             }
//         });
    
//         acessData.forEach(element => {
//             var found = newData.find(o => o.comment_id ==element.comment_parent_id);
//             newData[found].content.otherContent.push(element);   
//         });
    
//         return newData;
//     }




//     findDataComnet = (data,id)=>{
//         var found = data.findIndex(o => o.comment_id ==id);
//         if(found>-1) { 
//             return found;
//         }
//         return  null;
//     }

//     findNameUserDetail=(data,id)=>{
//         var found = data.findIndex(o => o.users_id ==id);
//         if(found>-1)  return data[found];
//         return null;
//     }
//     findNameCustomerDetail=(data,id)=>{
//         var found = data.findIndex(o => o.customer_id ==id);
//         if(found>-1)  return data[found];
//         return null;
//     }
   

//     informChatboxDataChat(data,lisUser){
//             var messageInfo=[];
//             console.log("informChatboxDataChat  data ",data);
//             data.forEach(element => {
//                 var dataInsert= JSON.parse(JSON.stringify(element));
//                 var day = moment(dataInsert.time);
//                 dataInsert['timeSend']=day.utc().format();
//                 dataInsert['author']=this.findNameCustomerDetail(lisUser,dataInsert.content.author_id);
//                 dataInsert['children'] = [];
//                 if(dataInsert.content.id_comment_reply>0){  // id_comment_reply
//                     let idPrent = this.findDataComnet(messageInfo,dataInsert.content.id_comment_reply);
//                     messageInfo[idPrent].children.push(dataInsert);
//                     return messageInfo;
//                 }
//                 messageInfo.push(dataInsert);
//             });
//             console.log("informChatboxDataChat ",messageInfo);
//             var newDataSort=[];
//             for(var i=(messageInfo.length-1);i>-1;i--){
//                 newDataSort.push(messageInfo[i]);
//             }
//         return newDataSort;
//     }

    
    

//     insertChatboxDataChat(messageInfo,element,lisUser, all_comment){
//         var infoExisting = messageInfo.findIndex(o=>(o.comment_id==element.comment_id));
//         var messageInfoData= JSON.parse(JSON.stringify(messageInfo));
//         if(infoExisting>-1) return messageInfoData;
//         if(!!!element.timeSend)
//         {
//             var day = moment(element.time);
//             element.timeSend=day.utc().format();
//         }
//         element['author']=this.findNameUserDetail(lisUser,element.content.author_id);
//         element['children'] = [];
//         if(element.content.comment_reply_id>0 && element.content.comment_parent_id >0){
//             let idPrent = this.findDataComnet(messageInfo,element.content.comment_parent_id);
//             messageInfoData[idPrent].children.push(element);
//             return messageInfoData;
//         }
//         messageInfoData.push(element);
//         return messageInfoData;
//     }

    

// }




export default CommentManagement;