import { useEffect, useState } from "react";
import InputComment from "../InputHeader/Input";
import { deleteComment } from "../../reducers/Comment/commentSlice";
import { useDispatch } from "react-redux";
const BoxMessage = ({handleComment, id,author,content,time, replies, replyLevel = 1}) => {
  const dispatch = useDispatch();
  const spaceReply = 30
  const replySpace = replyLevel * spaceReply
  const [reply,setReply] = useState(false);
 const handleDelete = (id) =>{
    if(id){
      dispatch(deleteComment(id))
    }
 }
    return(
        <>
        <div className='box-inf-comment' style={{marginLeft: replySpace }} key={id}>
        <div className='comment'>
          <div className="comment-option" onClick={()=>{handleDelete(id)}}>del</div>
          <div className=''>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 img-user-comment">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div className='inf-comment'>
            <h4 className='username'>{author}</h4>
            <div className='describe-comment'>
              <p>{content}</p>
            </div>
          </div>
        </div>
        <div className='emotion-comment'>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 heart">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </span>
              <span>5</span>
              <span className='dots'>.</span>
              <button onClick={()=>setReply(!reply)}><a className='reply'>Reply</a></button>
              <span className='dots'>.</span>
              <span className=''>{time}</span>
        </div>
        <div>
          {
            replies && replies.map((item,index) => {
              return(
              <BoxMessage handleComment={handleComment} reply_id={item._id} replies={item.replies} author = {item.content.author_id} content={item.content.content} time={item.time} id={item._id} key={index} replyLevel={replyLevel+1}/>
            )})
          }
        </div>
        {
          reply && (<>
          <InputComment handleComment={handleComment} reply_id={id}/>
         
</>)
        }
        </div>
       
        
        </>
    )
}

export default BoxMessage;