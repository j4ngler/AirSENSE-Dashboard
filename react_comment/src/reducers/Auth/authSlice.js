import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AuthApi from './authAPI';
import {loadStatus} from '../Comment/commentSlice'

export const login = createAsyncThunk('auth/login', async (params, { rejectWithValue }) => {
  try {
    const response = await AuthApi.getAPILogin({ ...params });
    return response.data;
  } 
  catch (error) {
    return rejectWithValue(error?.response?.data?.message || error?.response || error);
  }
});

export const getPersonalInformation = createAsyncThunk('auth/getInformation', async (params, { rejectWithValue }) => {
  try {
    const response = await AuthApi.getAPIInformationCustomer({ ...params });
    return response.data;
  } 
  catch (error) {
    return rejectWithValue(error?.response?.data?.message || error?.response || error);
  }
})

export const register = createAsyncThunk('auth/register', async (params, { rejectWithValue }) => {
  try {
    const response = await AuthApi.register({ ...params });
    return response.data;
  } 
  catch (error) {
    return rejectWithValue(error?.response?.data?.message || error?.response || error);
  }
})


const initialState = {
  token: null,
  username: '',
  userInformation: {
  },
  loadStatus: loadStatus.None
};

export const authSlice = createSlice({
  name: 'authen',
  initialState,
  reducers: {
    logOutAction: (state) => {
      state.token = '';
      state.loadStatus = loadStatus.None;
      state.userInformation = {};
      localStorage.removeItem('token_AirSENSE');
      localStorage.removeItem('username');
    },
    checkPermission: (state, action) => {
      console.log(action.payload)
    }
  },
  extraReducers: (buider) => {
    buider
      .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem('token_AirSENSE', action.payload.token);
        localStorage.setItem('username', action.payload.email);
        state.username = action.payload.email;
        state.token = action.payload.token;
      })
      .addCase(login.pending, (state, action) => {
        state.loadStatus  = loadStatus.Loading;
        console.log("login loading...");
      })
      .addCase(login.rejected, (state, action) => {
        state.loadStatus = loadStatus.Failed;
        console.log("login failed");

      })
      .addCase(getPersonalInformation.fulfilled, (state, action) => {
        state.userInformation = action.payload;
      })
      .addCase(getPersonalInformation.pending, (state, action) => {
        state.loadStatus = loadStatus.Loading;
      })
      .addCase(getPersonalInformation.rejected, (state, action) => {
        state.loadStatus = loadStatus.Failed;
      })

     
  }
});

export const {
  logOutAction,
} = authSlice.actions;

export default authSlice.reducer;
