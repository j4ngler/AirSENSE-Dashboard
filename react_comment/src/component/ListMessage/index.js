import React, { useEffect, useState } from "react";
// import MessageItem from "./messageItem";
import { useDispatch, useSelector} from "react-redux";
import '../InputHeader/input.css';
import BoxMessage from "../MessageIteam/BoxMessage";
import { getAllComment, getCommentByTopic } from "../../reducers/Comment/commentSlice";
// import ReplyComment from "../MessageIteam/replyComment";
const ListMessage = ({topic}) => {
  const dataComment = useSelector(state => state.commentSlice.data);
  const statusLoad = useSelector(state=> state.commentSlice.loadStatus);
  const dispatch = useDispatch();
 const value = {
  topic: "dfkjhf"
 }
  useEffect(()=>{
    dispatch(getCommentByTopic(value))
    // console.log(topic);
  },[topic])
  const [reply,setReply] = useState(false);
  return (
  
    <div className="box-info-container">
    {
      dataComment && dataComment.map((item,index) =>{
        // let children = item.children;
        return (
          <>
          <BoxMessage author ={item.author_id} content ={item.content.content} key={index}/>
                  <div className="box-info-container" style={{marginLeft: 130}}>
                  {
                    // children.map((e,index) =>(
                    //   <BoxMessage author ={e.author} content ={e.content.content} time = {e.time} key={index}/>
                    // ))
                    
                  }
                  </div>
          </>
        )
      })
    }
    </div>
  );
  
};

export default ListMessage;