import React, { useEffect, useState } from "react";
// import MessageItem from "./messageItem";
import { loadConversation } from "../../reducers/Comment/commentSlice";
import { useDispatch, useSelector} from "react-redux";
import '../Input/input.css';
import BoxMessage from "../MessageIteam/BoxMessage";
// import ReplyComment from "../MessageIteam/replyComment";
const ListMessage = () => {
  const dataComment = useSelector(state => state.commentSlice.selectedConversation);
  const dispatch = useDispatch();
  const loadComment = async () =>{
    await dispatch(loadConversation());
  }
  useEffect(()=>{
    loadComment();
  },[])
  const [reply,setReply] = useState(false);
  return (
    // <div>
    //       {
    //         messages.map(item =>{
    //             const children = item.children;
    //             return (
    //                 <div>
    //             <MessageItem message={item}
    //             isReply={true}
    //             submitData = {submitData}
    //             />
        
    //             <div className='reply-comment-block'>
    //                 {children.map(chid => {
    //                     return (
    //                       <MessageItem 
    //                             message={chid} 
    //                             isReply = {false}
    //                             submitData={submitData}
    //                       />
    //                     );
    //                   })
    //                 }
    //           </div>
    //           </div>
    //         );
    //       }) }
    // </div>
    <div className="box-info-container">
    {
      dataComment.map((item) =>{
        let children = item.children;
        return (
          <>
          <BoxMessage author ={item.author} content ={item.content.content} time = {item.timeConvert} />
                  <div className="box-info-container" style={{marginLeft: 130}}>
                  {
                    children.map(e =>(
                      <BoxMessage author ={e.author} content ={e.content.content} time = {e.time}/>
                    ))
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