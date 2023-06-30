

const test =[
    {
        "content": {
            "comment_atack": "",
            "comment_parent_id": "",
            "comment_reply_id": "6458acc715f60536905f0f50",
            "author_id": 3,
            "type_user": 1,
            "author_IP": "::ffff:127.0.0.1",
            "content": "hello 1"
        },
        "_id": "6458bd3fd879a1718c044397",
        "topic": "product/car",
        "__v": 0,
        "time": "2023-05-08T09:13:35.000Z"
    },
    {
        "content": {
            "comment_atack": "",
            "comment_parent_id": "",
            "comment_reply_id": "6458acc715f60536905f0f50",
            "author_id": 3,
            "type_user": 1,
            "author_IP": "::ffff:127.0.0.1",
            "content": "hello 2"
        },
        "_id": "6458bd91e23c1507bc6194b5",
        "topic": "product/car",
        "__v": 0,
        "time": "2023-05-08T09:14:57.000Z"
    },
    {
        "content": {
            "comment_atack": "",
            "comment_parent_id": "",
            "comment_reply_id": "",
            "author_id": 3,
            "type_user": 1,
            "author_IP": "::ffff:127.0.0.1",
            "content": "hello 4"
        },
        "_id": "6458c709be4e5d66b09e7b6b",
        "topic": "product/car",
        "__v": 0,
        "time": "2023-05-08T09:55:21.000Z"
    },
    {
        "content": {
            "comment_atack": "",
            "comment_parent_id": "",
            "comment_reply_id": "",
            "author_id": 3,
            "type_user": 1,
            "author_IP": "::ffff:127.0.0.1",
            "content": "xin chao "
        },
        "_id": "6458cce744f9d17094a1a434",
        "topic": "product/car",
        "__v": 0,
        "time": "2023-05-08T10:20:23.000Z"
    },
    {
        "content": {
            "comment_atack": "",
            "comment_parent_id": "6458cce744f9d17094a1a434/",
            "comment_reply_id": "6458cce744f9d17094a1a434",
            "author_id": 3,
            "type_user": 1,
            "author_IP": "::ffff:127.0.0.1",
            "content": "cho xin tien di"
        },
        "_id": "6458ce3f4ce4a973dc754a75",
        "topic": "product/car",
        "__v": 0,
        "time": "2023-05-08T10:26:07.000Z"
    },
    {
        "content": {
            "comment_atack": "",
            "comment_parent_id": "6458cce744f9d17094a1a434/6458ce3f4ce4a973dc754a75/",
            "comment_reply_id": "6458ce3f4ce4a973dc754a75",
            "author_id": 3,
            "type_user": 1,
            "author_IP": "::ffff:127.0.0.1",
            "content": "khong cho"
        },
        "_id": "6458ce534ce4a973dc754a78",
        "topic": "product/car",
        "__v": 0,
        "time": "2023-05-08T10:26:27.000Z"
    }
]
class CommentManagement {
    constructor(){
       
    }
    
   findUser(listUser,author_id){
    return listUser.length  > 0 ? listUser.filter(item => item.content.author_id = author_id) : "Anynomous";
   }
    modifyData(data,listUser) {
        let result=[];
            data.forEach(element => {
                let dataInsert= JSON.parse(JSON.stringify(element));
                // dataInsert['timeSend']= '20:32 10/2/2022';
                // dataInsert['author']=this.findUser(listUser,dataInsert.content.author_id);
                // dataInsert['replyId'] = dataInsert.content.comment_reply_id;
                // dataInsert['timeConvert'] = dataInsert.time;
                // dataInsert['content'] = dataInsert.content.content;
                result.push(dataInsert);
            });
           console.log("Comment modified: ",data);
           console.log("list Users: ", listUser);
        return result;
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





export default CommentManagement = new CommentManagement;