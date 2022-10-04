import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

export default class Company  {
    getColumeShow=(callback)=>{
        //"user_id","name","contactPhoneNumber","province","city","streetaddr","postCode"
        const columns = [
            {
              field: 'id',
              headerName: 'stt',
              width: 140,
            },
            {
              field: 'email',
              headerName: 'email',
              width: 200,
            },
            {
              field: 'name',
              headerName: 'name',
              width: 200,
            },
            {
              field: 'value',
              headerName: 'value',
              width: 240,
            },
            {
                field: 'bank',
                headerName: 'bank',
                width: 240,
            },
            {
                field: 'detail_bank',
                headerName: 'detail_bank',
                width: 240,
            },
            {
              field: 'content',
              headerName: 'content',
              width: 240,
          },
          {
            field: 'action',
            headerName: 'Thao tác',
            width: 140,
            renderCell: () => (
              <div>
                <span
                  onClick={() => {
                    if(callback!=null) callback(ActionControl.ACTION_UPDATE);
                  }}
                >
                <EditIcon />
                </span>
                <span
                    onClick={() => {
                      if(callback!=null) callback(ActionControl.ACTION_DELETE);
                      }}
                  >
                  <DeleteIcon />
                </span>
              </div>
            ),
          }
            
          ];
        return columns;
    }


    getInfoToEdit(){
      return {
        mainID:'bill_service_id',
        mainInfo:{
            field: 'value',
            headerName: 'value',
            width: 200,
        },
        detailEdit:[
            {
              field: 'customer_id',
              headerName: 'customer_id',
              width: 200,
            },
            {
              field: 'service_id',
              headerName: 'service_id',
              width: 200,
            },
            {
              field: 'value',
              headerName: 'value',
              width: 240,
            },
            {
                field: 'bank',
                headerName: 'bank',
                width: 240,
            },
            {
                field: 'detail_bank',
                headerName: 'detail_bank',
                width: 240,
            },
            {
              field: 'content',
              headerName: 'content',
              width: 240,
          },
          
        ]
      }
    }

    getInfoToAdd(){
      return ["customer_id","service_id","value","bank","detail_bank","content"];
    }
    getTitleToAdd(){
      return ["customer_id","service_id","value","bank","detail_bank","content"];
    }

    getHtmlAdd(){
      return  [TypeDialgueShow.SELECT_TABLE,TypeDialgueShow.SELECT_TABLE,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
              TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML
                ,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["customer","service","","","",""];
    }
    getColumeValidate(){
      return ["","","number","","",""];
    }
} 


