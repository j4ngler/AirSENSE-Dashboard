import { createSlice } from "@reduxjs/toolkit";
import ChatMessage from '../utils/ChatMessage';

var newInfo = new ChatMessage();


export const commentReducer = createSlice({
    name: 'comment_reducer',
    initialState: {
        content_group: null,
        content_page: null,
        content_sub: null,
        data: [],
        infoArticle: '',
        selectedConversation: [],
        list_user: [],
        sub_data_comment: {},
        all_comment_count: 0,
        page_select: 0,
        displayData: []
    },
    reducers: {
        initComment: (state, action) => {
            // console.log('init comment', state, action);
            // console.log(state.list_user)
            state.content_group = action.payload.data.content_group;
            state.content_sub = action.payload.data.content_sub;
            state.content_page = action.payload.data.content_page;
            state.infoArticle = action.payload.data.content_group+'/'+action.payload.data.content_sub+'/'+action.payload.data.content_page
        },
        loadConversation: (state, action) => {
            // console.log('list user .......', state.list_user)
            state.selectedConversation = newInfo.informChatboxDataChat(action.payload,state.list_user);// action.payload;
        //   console.log('abc',state.selectedConversation);
        state.all_comment_count = action.payload.length;



        },
        initUserList: (state,action) => {
            // console.log('state.list_user', action.payload);
            state.list_user =action.payload ;   

        },
        addMessageToConverSation: (state, action) => {
            // console.log('action.payload', action.payload);
            var infoData= newInfo.insertChatboxDataChat(state.selectedConversation,action.payload,state.list_user, state.all_comment);
            // console.log('addCommentToList........', infoData)
            state.selectedConversation =infoData;
            state.sub_data_comment = {};
            // state.all_comment_count +=1;
        },
        commentTagUser: (state, action) => {
            // console.log(action.payload.userid)
            state.sub_data_comment.comment_tag = action.payload.userid;

        },
        uploadImgComment: (state, action) => {
            // console.log(action.payload)
            state.sub_data_comment.link_img = action.payload;
        },
        replyComment: (state, action) => {
            // console.log(action.payload)
            state.sub_data_comment.reply_id = action.payload.content.comment_id;
        },
        selectedPage: (state, action) => {
            console.log(action.payload)
            state.displayData = [];
            let page = action.payload.page;
            let pageSize = action.payload.pageSize;
            let begin = page*pageSize ;
            let end = page*pageSize + 5;
            for (let i = begin; i<=end; ++i) {
                state.displayData.push(state.selectedConversation[i]);
            }
            console.log(state.displayData);
        }
    }
});

export const {initComment, loadConversation, initUserList, addMessageToConverSation, commentTagUser, uploadImgComment, replyComment, selectedPage} = commentReducer.actions;
export default commentReducer.reducer;
