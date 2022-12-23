import React from "react";
import MessageItem from "./messageItem";
import './listmessage.css';
const ListMessage = ({messages, submitData}) => {
    
  return (
    <div>
          {
            messages.map(item =>{
                const children = item.children;
                return (
                    <div>
                <MessageItem message={item}
                isReply={true}
                submitData = {submitData}
                />
        
                <div className='reply-comment-block'>
                    {children.map(chid => {
                        return (
                          <MessageItem 
                                message={chid} 
                                isReply = {false}
                                submitData={submitData}
                          />
                        );
                      })
                    }
              </div>
              </div>
            );
          }) }
    </div>
  );
  
};

export default ListMessage;