import React, { useCallback, useEffect, useMemo } from "react";
import InputComment from '../../component/InputHeader';
import { useDispatch, useSelector } from "react-redux";
import { initComment, sendComment } from "../../reducers/Comment/commentSlice";
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

    const dispatch = useDispatch();

    
    const searchGroup = async () => {
        let params = (new URL(document.location)).searchParams; // get group, sub, id later
        //get IP user
        let userIPs = await getGeolocation();
        // fake group comment
        let fakeGroup = {
            comment_group: 'product',
            comment_sub: 'car',
            comment_page: 0,
            userIPs: userIPs
        }
        dispatch(initComment(fakeGroup))
    }


    useEffect(() => {
        searchGroup()
    }, [])

    const handleComment = (data) => {
        const message = data.stringValue;
        console.log('result onMessageWasSent ', data); // comment_reply_id
        if(!!data) {
            let messageComment = {
                topic: comment_group_gs + '/' + comment_sub_gs + '/' + comment_page_gs,
                author_IP: userIPs_gs,
                content: message,
                comment_tag: "",     //no tags function
                comment_atack: "", // no upload function
                comment_reply_id: data.hasOwnProperty("id_reply_comment")? data.id_reply_comment:0,
            };
        
        dispatch(sendComment(messageComment));
    }


}
    const topic = useMemo(()=> {
        return `${comment_group_gs}/${comment_sub_gs}/${comment_page_gs}`
    }, [comment_group_gs,comment_page_gs,comment_sub_gs,loadCommentStatus])
     

    return (
        <>
        <InputComment handleComment={handleComment} infoReply={'test'}/>
        <ListMessage topic = {topic} />
        
        </>
    )
}


export default Comment;