import React, { useCallback, useEffect, useMemo } from "react";
import InputComment from '../../component/InputHeader';
import { useDispatch, useSelector } from "react-redux";
import { getListUsers, initComment, sendComment } from "../../reducers/Comment/commentSlice";
import { getGeolocation } from "../../utils/commonUtils";
import ListMessage from "../../component/ListMessage";
const Comment = () => {
    const comment_group_gs = useSelector(state => state.commentSlice.comment_group);
    const comment_sub_gs = useSelector(state => state.commentSlice.comment_sub);
    const comment_page_gs = useSelector(state => state.commentSlice.comment_page);
    const loadCommentStatus  = useSelector(state => state.commentSlice.loadStatus);

    const userIPs_gs = useSelector(state => state.commentSlice.userIPs);
    const username_gs = useSelector(state => state.authSlice.username);
    const userId_gs = useSelector(state => state.authSlice.userId);
    const typeUser_gs = useSelector(state => state.authSlice.typeUser);
    const list = useSelector(state => state.commentSlice.listUser)
    const dispatch = useDispatch();

    
    const searchGroup = async () => {
        //get IP user
        let userIPs = await getGeolocation();
        // fake group comment
        let fakeGroup = {
            comment_group: 'product',
            comment_sub: 'car',
            comment_page: '',
            userIPs: userIPs
        }
        dispatch(initComment(fakeGroup))
    }


    useEffect(() => {
        searchGroup();
        
    }, [])

    const handleComment = (data) => {
        if(!!data.content) {
            if(!!data.reply_id) {
            let messageComment = {
                topic: topic,
                comment: data.content,
                comment_reply_id: data.reply_id
            };
        
            dispatch(sendComment(messageComment));
        }
        else{
            let messageComment = {
                topic: topic,
                comment: data.content,
            };
            dispatch(sendComment(messageComment));
        }
    }


}
    const topic = useMemo(()=> {
        return `${comment_group_gs}/${comment_sub_gs}`
    }, [comment_group_gs,comment_page_gs,comment_sub_gs,loadCommentStatus])
     

    return (
        <>
        <InputComment handleComment={handleComment} />
        <ListMessage topic = {topic} />
        
        </>
    )
}


export default Comment;