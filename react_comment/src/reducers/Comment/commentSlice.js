import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
      const response = await commentAPI.send({ ...params });
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
        const response = await commentAPI.getBytopic({...params});
        return response.data;
      } 
      catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.response || error);
      }
  })
  export const deleteComment = createAsyncThunk('comment/delete', async (id , {rejectWithValue})=> {
    try {
        const response = await commentAPI.delete({...id});
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
        }
    },
    extraReducers: (buider) => {
        buider
          .addCase(sendComment.pending, (state, action) => {
           state.loadStatus =  loadStatus.Loading
          })
          .addCase(sendComment.fulfilled, (state, action) => {
            state.data = action.payload
            state.loadStatus =  loadStatus.Success
          })
          .addCase(sendComment.rejected, (state, action) => {
            state.loadStatus =  loadStatus.Failed
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
      }
});

export const { initComment, resetComment} = commentSlice.actions;
export default commentSlice.reducer;
