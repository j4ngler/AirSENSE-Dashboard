import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AuthApi from './authAPI';

export const login = createAsyncThunk('auth/login', async (params, { rejectWithValue }) => {
  try {
    const response = await AuthApi.getAPILogin({ ...params });
    return response.data;
  } 
  catch (error) {
    return rejectWithValue(error?.response?.data?.message || error?.response || error);
  }
});

export const getPersonalInformation = createAsyncThunk('auth/getInformationCustomer', async (params, { rejectWithValue }) => {
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
  username: 'Truong Giang Phung',
  token: null,
  userInformation: {
    email: 'giangpbt@gmail.com',
    fullname: 'Phung Ba Truong Giang',
    username: 'Truong Giang Phung',
    address: '174, Ngoc Thuy, Long Bien, Ha Noi',
    contact: 'SPARC Laboratory'
  },
  typeUser: 1, // type of user: user or customer
  userId: 2

};

export const authSlice = createSlice({
  name: 'authen',
  initialState,
  reducers: {
    logOutAction: (state) => {
      state.username = null;
      state.token = null;
      localStorage.removeItem('token_AirSENSE');
      localStorage.removeItem('username')
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
      .addCase(getPersonalInformation.fulfilled, (state, action) => {
        state.userInformation = action.payload;
      })

     
  }
});

export const {
  logOutAction,
} = authSlice.actions;

export default authSlice.reducer;
