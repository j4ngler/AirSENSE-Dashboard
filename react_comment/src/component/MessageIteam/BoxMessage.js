import { useState } from "react";
import InputComment from "../InputHeader/Input";
import CommentManagement from "../../utils/commentMessage";
const BoxMessage = ({author,content,time}) => {
  const [reply,setReply] = useState(false);
  // console.log(author,content,time);
    return(
        <>
        
        <div className='box-inf-comment'>
        <div className='comment'>
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
        </div>
        {
          reply && (<>
          <InputComment />
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 close">
  <path fill-rule="evenodd" d="M2.515 10.674a1.875 1.875 0 000 2.652L8.89 19.7c.352.351.829.549 1.326.549H19.5a3 3 0 003-3V6.75a3 3 0 00-3-3h-9.284c-.497 0-.974.198-1.326.55l-6.375 6.374zM12.53 9.22a.75.75 0 10-1.06 1.06L13.19 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L15.31 12l1.72-1.72a.75.75 0 10-1.06-1.06l-1.72 1.72-1.72-1.72z" clip-rule="evenodd" />
</svg> */}
</>)
        }
        
        
        </>
    )
}
<style>
  .close{
    
  }
</style>

export default BoxMessage;