import { configureStore } from '@reduxjs/toolkit';
import commentSlice from '../reducers/Comment/commentSlice';
import authSlice from '../reducers/Auth/authSlice';

export const store = configureStore({
    reducer: {
        commentSlice,
        authSlice
    }
})
