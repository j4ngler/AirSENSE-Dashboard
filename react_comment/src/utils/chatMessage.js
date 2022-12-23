
import { getParentCommentId } from '../api/httpBaseUtil';
var moment = require('moment');

class ChatMessage{
    timeConverter=(UNIX_timestamp)=>{
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                            'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
      }

    compareChatbox=( a, b )=> {
        if ( a.time < b.time ){
            return -1;
        }
        else
        if ( a.time > b.time ){
            return 1;
        }
        return 0;
    }
    
    shortDataChatbox(data){
        data= data.sort(this.compareChatbox);
        var newData=[];
        var acessData =[];
        data.forEach(element => {
            if(element.content.comment_parent_id==0){
                element.content.otherContent =[];
                newData.push(element);
            }
            else
            {
                acessData.push(element);
            }
        });
    
        acessData.forEach(element => {
            var found = newData.find(o => o.comment_id ==element.comment_parent_id);
            newData[found].content.otherContent.push(element);   
        });
    
        return newData;
    }




    findDataComnet=(data,id)=>{
        var found = data.findIndex(o => o.comment_id ==id);
        if(found>-1) { 
            return found;
        }
        return  null;
    }

    findNameUserDetail=(data,id)=>{
        var found = data.findIndex(o => o.users_id ==id);
        if(found>-1)  return data[found];
        return null;
    }
    findNameCustomerDetail=(data,id)=>{
        var found = data.findIndex(o => o.customer_id ==id);
        if(found>-1)  return data[found];
        return null;
    }
   

    informChatboxDataChat(data,lisUser){
            var messageInfo=[];
            console.log("informChatboxDataChat  data ",data);
            data.forEach(element => {
                var dataInsert= JSON.parse(JSON.stringify(element));
                var day = moment(dataInsert.time);
                dataInsert['timeSend']=day.utc().format();
                dataInsert['author']=this.findNameCustomerDetail(lisUser,dataInsert.content.author_id);
                dataInsert['children'] = [];
                if(dataInsert.content.id_comment_reply>0){  // id_comment_reply
                    let idPrent = this.findDataComnet(messageInfo,dataInsert.content.id_comment_reply);
                    messageInfo[idPrent].children.push(dataInsert);
                    return messageInfo;
                }
                messageInfo.push(dataInsert);
            });
            console.log("informChatboxDataChat ",messageInfo);
            var newDataSort=[];
            for(var i=(messageInfo.length-1);i>-1;i--){
                newDataSort.push(messageInfo[i]);
            }
        return newDataSort;
    }

    
    

    insertChatboxDataChat(messageInfo,element,lisUser, all_comment){
        var infoExisting = messageInfo.findIndex(o=>(o.comment_id==element.comment_id));
        var messageInfoData= JSON.parse(JSON.stringify(messageInfo));
        if(infoExisting>-1) return messageInfoData;
        if(!!!element.timeSend)
        {
            var day = moment(element.time);
            element.timeSend=day.utc().format();
        }
        element['author']=this.findNameUserDetail(lisUser,element.content.author_id);
        element['children'] = [];
        if(element.content.comment_reply_id>0 && element.content.comment_parent_id >0){
            let idPrent = this.findDataComnet(messageInfo,element.content.comment_parent_id);
            messageInfoData[idPrent].children.push(element);
            return messageInfoData;
        }
        messageInfoData.push(element);
        return messageInfoData;
    }

    

}




export default ChatMessage;