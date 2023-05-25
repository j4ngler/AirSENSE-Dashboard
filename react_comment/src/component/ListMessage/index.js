import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import '../InputHeader/input.css';
import BoxMessage from "../MessageIteam/BoxMessage";
import { loadStatus, resetComment, loadComment, CombinedDataComment, getListUsers, sendComment } from "../../reducers/Comment/commentSlice";
import { getAllComment, getCommentByTopic } from "../../reducers/Comment/commentSlice";
import { Spin } from 'antd';
import CommentManagement from '../../utils/commentMessage'

const ListMessage = ({topic}) => {
  const statusLoad = useSelector(state => state.commentSlice.loadStatus);
  const sendCommentStatus = useSelector(state => state.commentSlice.sendMessageStatus);
  const comments = useSelector(CombinedDataComment)
  const [status, setStatus] = useState(statusLoad)
  const [commentTree, setCommentTree] = useState(comments);
  const dispatch = useDispatch();
 
  useEffect(()=>{
    dispatch(getCommentByTopic(topic))
    dispatch(getListUsers())
    
  },[topic,sendCommentStatus])
  
  
  const buildCommentTress = (comments, parentId = "") => {
    const commentTree = [];
    comments.forEach((comment) => {
      
      if(comment.content.comment_reply_id === parentId) {
        const childReplies = buildCommentTress(comments,comment._id)
        comment.replies = childReplies;
        commentTree.push(comment)
      }
    })
    return commentTree;
  }
useEffect(()=>{
  var CommentArray = buildCommentTress(comments)
  
  setCommentTree(CommentArray)
},[comments])


const handleComment = (data) => {
  if(!!data.content) {
      console.log("data comment:",data);
      let messageComment = {
          topic: topic,
          comment: data.content,
          comment_reply_id: data.reply_id
      };
  
      dispatch(sendComment(messageComment));
  
}}
  return (
   <div>
      {status === loadStatus.Loading ? 
      <div className="loading-box">
        <Spin />
      </div>
       : 
      <>
        <div className="box-info-container">
          {commentTree && commentTree.map((item,index)=>{
            return (
              <div>
                <BoxMessage handleComment={handleComment} replies={item.replies} author = {item.content.author_id} content={item.content.content} time={item.time} id={item._id} key={index}/>
              </div>
            )
          })}
        </div>
      </>
      }
   </div>
  )

}
  


export default ListMessage;




