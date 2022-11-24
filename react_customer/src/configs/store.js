import { configureStore } from '@reduxjs/toolkit';
import authSlice  from '../features/Authen/AuthSlice';

export const store = configureStore({
    reducer: {
        authSlice
    }
})
