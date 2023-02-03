import React, { useEffect } from "react";
import InputComment from '../component/Input';
import { useDispatch, useSelector } from "react-redux";
import { initComment, commentAction } from "../reducers/Comment/commentSlice";
import { getGeolocation } from "../utils/commonUtils";
const Comment = () => {
    const comment_group_gs = useSelector(state => state.commentSlice.comment_group);
    const comment_sub_gs = useSelector(state => state.commentSlice.comment_sub);
    const comment_page_gs = useSelector(state => state.commentSlice.comment_page);
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
            comment_sub: 'smart_device',
            comment_page: 5,
            userIPs: userIPs
        }
        dispatch(initComment(fakeGroup))


        

    }

    useEffect(() => {
        searchGroup();
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
                comment_reply_id: data.hasOwnProperty("id_reply_comment")?data.id_reply_comment:0,
                comment_parent_id:data.hasOwnProperty("id_reply_comment")?data.id_reply_comment:0,
            };
        console.log(messageComment);
        dispatch(commentAction(messageComment));
    }

}
     

    return (
        <>
        <InputComment handleComment={handleComment} infoReply={'test'}/>
        </>
    )
}


export default Comment;