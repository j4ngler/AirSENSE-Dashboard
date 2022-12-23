import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InputUser from "../Input/InputUser";
import { replyComment } from "../../reducers/commentReducer";
const MessageItem = ({message, isReply, submitData}) => {  
    let d = new Date(message.time * 1000);
    var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();
    const [showReplyBox, setShowReplyBox] = useState(false)
    const dispatch = useDispatch();
    const _openImageInCommentItem = (url) => {
        let w = window.open('about:blank');
        let image = new Image();
        image.src = url;
        w.document.write(image.outerHTML);
      }

      const _replyMessage = (item) => {
        console.log('reply message', item);
        setShowReplyBox(true);
        dispatch(replyComment(item));
      }
    return (
         <div className='comment-item'>
            <div className="mt-2">
                <div className="d-flex flex-row p-3">    
                    {!!message.author.avatar?
                          <img src={message.author.avatar} className='rounded-circle mr-3' width={'40px'} height={'40px'} />
                          :<img src="https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien.jpg" 
                              width={40} height={40} className="rounded-circle mr-3" />
                    }
                  <div className="w-100">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex flex-row align-items-center"> <span className="mr-2">{message.author.username}</span>
                      </div> <small>{date}</small>
                    </div>
                    <p className="text-justify comment-text mb-0">{message.content.content}</p>
                    <div className="d-flex flex-row user-feed"> 
                        <span className="wish"><i className="fa fa-heartbeat mr-2" />24</span> 
                        <span className="ml-3" onClick={() => _replyMessage(message)}><i className="fa fa-comments-o mr-2" />Reply</span> 
                    </div>
                  </div>
                </div>
            </div>      
          {!!message.content.comment_atack?<img src={message.content.comment_atack} className='img-comment-item'
                         onClick={()=>_openImageInCommentItem(message.content.comment_atack)} />:''}
          {showReplyBox?
          <div>
            <div className="close-show-reply">
              <i class="fa fa-times-circle icon-close" aria-hidden="true" onClick={() => setShowReplyBox(!showReplyBox)}></i>
            </div>
            <InputUser  submitData={submitData} infoReply={message}/>
          </div>:''}
      </div>);
};

export default MessageItem;