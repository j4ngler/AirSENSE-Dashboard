
import { createSlice } from '@reduxjs/toolkit'
import {exportColumeData } from '../config/table/ManagerToView.js'


export  const  configureStoreTableData = createSlice({
    name: 'tableData',
    initialState: {
        table_view:"" ,
        columns: [],
        data:[],
        refesh:false,
    },
    reducers: {
        initTable: (state,action) => {
         console.log("action   ...........   ",action);
          state.table_view = action.payload;
          state.columns = exportColumeData(action.payload);
        },
        initViewTable: (state) => {
          //state.value -= 1
        },
        incrementByAmount: (state, action) => {
          //state.value += action.payload
        },
    },
})

export const { initTable, initViewTable, incrementByAmount } = configureStoreTableData.actions;

export default configureStoreTableData.reducer;
