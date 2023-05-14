import React, { useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import '../InputHeader/input.css';
import BoxMessage from "../MessageIteam/BoxMessage";
import { loadStatus } from "../../reducers/Comment/commentSlice";
import { getAllComment, getCommentByTopic } from "../../reducers/Comment/commentSlice";
import { Spin } from 'antd';
const ListMessage = ({topic}) => {
  const dataComment = useSelector(state => state.commentSlice.data);
  const statusLoad = useSelector(state => state.commentSlice.loadStatus);
  const [status, setStatus] = useState(statusLoad)
  const dispatch = useDispatch();
 
  useEffect(()=>{
    console.log(topic);
    console.log(dataComment);
    dispatch(getCommentByTopic(topic))
  },[topic])
  useEffect(()=>{
    setStatus(statusLoad)
  },[statusLoad])

  const [reply,setReply] = useState(false);

  return (
   <div>
      {status === loadStatus.Loading ? 
      <div className="loading-box">
        <Spin />
      </div>
       : 
      <>
        <div className="box-info-container">
          {dataComment && dataComment.map((item,index)=>{
            return (
              <div>
                <BoxMessage author = {item.content.auther_id} content={item.content.content} key={index}/>
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






