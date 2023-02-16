import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commentAPI from "./commentAPI";
import CommentManagement from '../../utils/commentMessage';


let commentManagement = new CommentManagement();

export const commentAction = createAsyncThunk('comment/comment_user', async (params, { rejectWithValue }) => {
    try {
      const response = await commentAPI.postComment({ ...params });
      return response.data;
    } 
    catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  });

// export const getComment = createAsyncThunk('')


export const commentSlice = createSlice({
    name: 'commentSlice',
    initialState: {
        // new version
        comment_group: null, // it's a string, for exmaple: 'product/5'
        comment_sub: null,
        comment_page: null,
        userIPs: '',
        data: [
            {
            _id: 'ObjectId(63d14a91ef12ca38ec6c01af)',
            topic: "product/smart_device/5",
            commentId: "usr_1674660497_2",
            content: {
            author_id: 2,
            type_user: 1,
            author_IP: "171.236.58.19",
            content: "Hi Giang",
            comment_atack: "",
            comment_parent_id: 0,
            comment_reply_id: 0
            },
            time: "1674660497",
            __v: 0            
            },
            {
            _id: 'ObjectId(63d14af2ef12ca38ec6c01b3)',
            topic: "product/smart_device/5",
            commentId: "cus_1674660609_4",
            content: {
            author_id: 4,
            type_user: 2,
            author_IP: "171.236.58.19",
            content: "Hi Giang handsome",
            comment_atack: "",
            comment_parent_id: 0,
            comment_reply_id: 0
            },
            time: "1674660609",
            __v: 0
            },
            {
                _id: 'ObjectId(63d14b18ef12ca38ec6c01b7)',
                topic: "product/smart_device/5",
                commentId: "cus_1674660668_4",
                content: {
                author_id: 4,
                type_user: 2,
                author_IP: "171.236.58.19",
                content: "acknowledgement",
                comment_atack: "",
                comment_parent_id: 0,
                comment_reply_id: 0
                },
                time: "1674660668",
                __v: 0
            },
            {
                _id: 'ObjectId(63d14b18ef662138ec6c01b7)',
                topic: "product/smart_device/5",
                commentId: "usr_1675611574_2",
                content: {
                author_id: 2,
                type_user: 1,
                author_IP: "171.236.58.19",
                content: "reply 1",
                comment_atack: "",
                comment_parent_id: 'usr_1674660497_2',
                comment_reply_id: 'usr_1674660497_2'
                },
                time: "1675611574",
                __v: 0
            },
            {
                _id: 'ObjectId(63d17235ef12ca38ec6c01b7)',
                topic: "product/smart_device/5",
                commentId: "cus_1675611697_4",
                content: {
                author_id: 4,
                type_user: 2,
                author_IP: "171.236.58.19",
                content: "reply 2",
                comment_atack: "",
                comment_parent_id: 'usr_1674660497_2',
                comment_reply_id: 'usr_1674660497_2'
                },
                time: "1675611697",
                __v: 0
            },
            {
                _id: 'ObjectId(63d121a5ef12ca38ec6c01b7)',
                topic: "product/smart_device/5",
                commentId: "cus_1675611774_5",
                content: {
                author_id: 5,
                type_user: 2,
                author_IP: "171.236.58.19",
                content: "food and drink🤣 😂 😂",
                comment_atack: "",
                comment_parent_id: 'usr_1674660497_2',
                comment_reply_id: 'cus_1675611697_4'
                },
                time: "1675611774",
                __v: 0
            },
            {
                _id: 'ObjectId(63d121a5ef12ca38ec6c01b7)',
                topic: "product/smart_device/5",
                commentId: "cus_1675611942_5",
                content: {
                author_id: 5,
                type_user: 2,
                author_IP: "171.236.58.19",
                content: "sea food",
                comment_atack: "",
                comment_parent_id: 'usr_1674660497_2',
                comment_reply_id: 'cus_1675611697_4'
                },
                time: "1675611942",
                __v: 0
            },

        ],
        commentExtra: {},
        selectedConversation: [],
        listUser: [],
        commentQuantity: 0,
        page: 1,    // pagination
        offset: 0   // pagination



        // old code
        // content_group: null,
        // content_page: null,
        // content_sub: null,
        // data: [],
        // infoArticle: '',
        // selectedConversation: [],
        // list_user: [],
        // sub_data_comment: {},
        // all_comment_count: 0,
        // page_select: 0,
        // displayData: []
    },
    reducers: {

        initComment: (state, action) => {
            state.comment_group = action.payload.comment_group;
            state.comment_sub = action.payload.comment_sub;
            state.comment_page = action.payload.comment_page;
            state.userIPs = action.payload.userIPs;
        },

        initUserInComment: (state, action) => {
            state.listUser = action.payload;
        },

        commentAction: (state, action) => {

        },

        uploadImage: (state, action) => {
            state.commentExtra.image = action.payload
        },

        tagUsers: (state, action) => {
            state.commentExtra.tagUsers = action.payload;
        },

        loadConversation: (state,action) =>{
            // getComment();
            // state.selectedConversation = commentManagement.modifyData(state.data);
            state.selectedConversation = commentManagement.modifyData();
            console.log(state.selectedConversation);

            
        }


        // initComment: (state, action) => {
        //     // console.log('init comment', state, action);
        //     // console.log(state.list_user)
        //     state.content_group = action.payload.data.content_group;
        //     state.content_sub = action.payload.data.content_sub;
        //     state.content_page = action.payload.data.content_page;
        //     state.infoArticle = action.payload.data.content_group+'/'+action.payload.data.content_sub+'/'+action.payload.data.content_page
        // },
        // loadConversation: (state, action) => {
        //     // console.log('list user .......', state.list_user)
        //     state.selectedConversation = newInfo.informChatboxDataChat(action.payload,state.list_user);// action.payload;
        // //   console.log('abc',state.selectedConversation);
        // state.all_comment_count = action.payload.length;



        // },
        // initUserList: (state,action) => {
        //     // console.log('state.list_user', action.payload);
        //     state.list_user =action.payload ;   

        // },
        // addMessageToConverSation: (state, action) => {
        //     // console.log('action.payload', action.payload);
        //     var infoData= newInfo.insertChatboxDataChat(state.selectedConversation,action.payload,state.list_user, state.all_comment);
        //     // console.log('addCommentToList........', infoData)
        //     state.selectedConversation =infoData;
        //     state.sub_data_comment = {};
        //     // state.all_comment_count +=1;
        // },
        // commentTagUser: (state, action) => {
        //     // console.log(action.payload.userid)
        //     state.sub_data_comment.comment_tag = action.payload.userid;

        // },
        // uploadImgComment: (state, action) => {
        //     // console.log(action.payload)
        //     state.sub_data_comment.link_img = action.payload;
        // },
        // replyComment: (state, action) => {
        //     // console.log(action.payload)
        //     state.sub_data_comment.reply_id = action.payload.content.comment_id;
        // },
        // selectedPage: (state, action) => {
        //     console.log(action.payload)
        //     state.displayData = [];
        //     let page = action.payload.page;
        //     let pageSize = action.payload.pageSize;
        //     let begin = page*pageSize ;
        //     let end = page*pageSize + 5;
        //     for (let i = begin; i<=end; ++i) {
        //         state.displayData.push(state.selectedConversation[i]);
        //     }
        //     console.log(state.displayData);
        // }
    },
    extraReducers: (buider) => {
        buider
          .addCase(commentAction.pending, (state, action) => {
           state.data = [];
          })
          .addCase(commentAction.fulfilled, (state, action) => {
           
          })
          .addCase(commentAction.rejected, (state, action) => {

          })    
      }
});

export const { initComment, uploadImage, tagUsers, loadConversation } = commentSlice.actions;
export default commentSlice.reducer;
