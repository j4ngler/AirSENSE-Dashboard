import React, { useEffect } from "react";
// import MessageItem from "./messageItem";
import { loadConversation } from "../../reducers/Comment/commentSlice";
import { useDispatch, useSelector} from "react-redux";
const ListMessage = () => {
  const dataComment = useSelector(state => state.commentSlice.selectedConversation);
  const dispatch = useDispatch();
  const loadComment = async () =>{
    await dispatch(loadConversation());
  }
  useEffect(()=>{
    loadComment();
  },[])
  
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
    <>
    <p>fjhawek</p>
    {
      dataComment.map((item) =>{
        let children = item.children;
        return (
          <>
        <p>{item.content.content}     /      {item.time}</p>
        {children.map(e =>(
          <p>Childern: {e.content.content}    /   </p>
        ))}
          </>
        )
      })
    }
    </>
  );
  
};

export default ListMessage;