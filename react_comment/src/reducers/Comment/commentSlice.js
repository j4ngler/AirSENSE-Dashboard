import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import commentAPI from "./commentAPI";
import CommentManagement from '../../utils/commentMessage';

export const loadStatus = {
  None: 0,
  Loading: 1,
  Success: 2,
  Failed: 3
}
export const commentModel = {

}


export const sendComment = createAsyncThunk('comment/send', async (params, { rejectWithValue }) => {
    try {
      const response = await commentAPI.send({...params});
      return response.data;
    } 
    catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  });
  export const getAllComment = createAsyncThunk('comment/get-all', async (params , {rejectWithValue})=> {
    try {
        const response = await commentAPI.getAll();
        return response.data;
      } 
      catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response || error);
      }
  })
  export const getCommentByTopic = createAsyncThunk('comment/get-by-topic', async (params , {rejectWithValue})=> {
    try {
        const response = await commentAPI.getBytopic(params);
        return response.data;
      } 
      catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response || error);
      }
  })
  export const deleteComment = createAsyncThunk('comment/delete', async (id , {rejectWithValue})=> {
    try {
        const response = await commentAPI.delete(id);
        return response.data;
      } 
      catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response || error);
      }
  })
  export const getListUsers = createAsyncThunk('comment/list-users', async (params , {rejectWithValue})=> {
    try {
        const response = await commentAPI.getListUsers();
        return response.data;
      } 
      catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response || error);
      }
  })
// export const getComment = createAsyncThunk('')
export const getComment = createAsyncThunk('')

export const commentSlice = createSlice({
    name: 'commentSlice',
    initialState: {
        comment_group: '',
        comment_sub: '',
        comment_page: 0,
        userIPs: '',
        data:  [],
        commentExtra: {},
        selectedConversation: [],
        listUser: [],
        commentQuantity: 0,
        page: 1,    // pagination
        offset: 0,   // pagination
        sendMessageStatus: loadStatus.None,
        loadStatus: loadStatus.None
    },

    reducers: {
        initComment: (state,action) =>{
            state.comment_group = action.payload.comment_group;
            state.comment_sub = action.payload.comment_sub;
            state.comment_page = action.payload.comment_page;
            state.uerIPs = action.payload.uerIPs;
            state.loadStatus = loadStatus.Loading;
        },
        resetComment: (state,action) =>{
          state.data = []
          state.loadStatus = loadStatus.None
        },
        loadComment: (state,action) =>{
          state.data = action.payload;
          state.loadStatus = loadStatus.Success
        }
    },
    extraReducers: (buider) => {
        buider
          .addCase(sendComment.pending, (state, action) => {
            console.log("sending message.....");
            state.sendMessageStatus = loadStatus.Loading
          })
          .addCase(sendComment.fulfilled, (state, action) => {
            console.log("sending message success");
            state.selectedConversation = loadStatus.Success
          })
          .addCase(sendComment.rejected, (state, action) => {
            console.log("sending message failed");         
            state.selectedConversation = loadStatus.Loading
           })
          .addCase(getAllComment.pending, (state, action)=>{
            state.loadStatus = loadStatus.Loading
          })    
          .addCase(getAllComment.fulfilled, (state,action)=>{
            state.loadStatus = loadStatus.Success
            state.data = action.payload
          })
          .addCase(getAllComment.rejected, (state,action)=>{
            state.loadStatus = loadStatus.Failed
          })
          .addCase(getCommentByTopic.pending, (state, action)=>{
            state.loadStatus = loadStatus.Loading
          })    
          .addCase(getCommentByTopic.fulfilled, (state,action)=>{
            state.loadStatus = loadStatus.Success
            state.data = action.payload
          })
          .addCase(getCommentByTopic.rejected, (state,action)=>{
            state.loadStatus = loadStatus.Failed
          })
          .addCase(getListUsers.pending, (state,action)=>{
            state.loadStatus = loadStatus.Loading
          })
          .addCase(getListUsers.fulfilled, (state,action)=>{
            state.loadStatus = loadStatus.Success
            state.listUser = action.payload
          })
          .addCase(getListUsers.rejected, (state,action)=>{
            state.loadStatus = loadStatus.Failed
          })
          .addCase(deleteComment.pending, (state, action) => {
            console.log("delete message.....");
            state.sendMessageStatus = loadStatus.Loading
          })
          .addCase(deleteComment.fulfilled, (state, action) => {
            console.log(action.payload);
            state.sendMessageStatus = loadStatus.Success
          })
          .addCase(deleteComment.rejected, (state, action) => {
            console.log("delete message failed");         
            state.sendMessageStatus = loadStatus.Loading
           })
      }
});
export const dataComment = (state)=> state.commentSlice.data;
export const listUsers = (state)=> state.commentSlice.listUser;

export const CombinedDataComment = createSelector(
  dataComment,
  listUsers,
    (data, listUser) => {
      return data.map((comment)=>{
        const user = listUser.find(user => user.user_id === comment.content?.author_id)
        const username = user ? user.username : 'anynomous'
        return{
          ...comment,
          content: {
            ...comment.content,
            author_id: username
          },
        }
      })
    }
)

export const { initComment, resetComment, loadComment} = commentSlice.actions;
export default commentSlice.reducer;
