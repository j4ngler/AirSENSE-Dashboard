import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import { ActionControl,TypeDialgueShow,SelectHTml } from '../../utils/commonUtil';

export default class Customer  {
    getColumeShow=(callback) => {
        //"user_id","name","contactPhoneNumber","province","city","streetaddr","postCode"
        const columns = [
            {
              field: 'id',
              headerName: 'STT',
              width: 140,
            },
            {
              field: 'username',
              headerName: 'username',
              width: 200,
            },
            {
              field: 'email',
              headerName: 'email',
              width: 200,
            },
            {
              field: 'phone_number',
              headerName: 'phone',
              width: 240,
            },
            {
                field: 'avatar',
                headerName: 'avatar',
                width: 240,
            },
            {
                field: 'address',
                headerName: 'address',
                width: 240,
            },
            {
              field: 'contact',
              headerName: 'Liên hệ',
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
        mainID:'customer_id',
        mainInfo:{
            field: 'email',
            headerName: 'email',
            width: 200,
        },
        detailEdit:[
          {
            field: 'username',
            headerName: 'username',
            width: 200,
          },
          {
            field: 'email',
            headerName: 'email',
            width: 200,
          },
          {
            field: 'token_reset',
            headerName: 'token_reset',
            width: 240,
          },
          {
            field: 'phone',
            headerName: 'phone',
            width: 240,
          },
          {
              field: 'avatar',
              headerName: 'avatar',
              width: 240,
          },
          {
              field: 'address',
              headerName: 'address',
              width: 240,
          },
          {
              field: 'note',
              headerName: 'note',
              width: 240,
          },
          
        ]
      }
    }

    getInfoToAdd(){
      return ["username","email","password","phone_number","contact","fullname","address"];
    }
    getTitleToAdd(){
      return ["Tên người dùng","email","Mật khẩu","Số điện thoại","Liên hệ","Họ và tên","Địa chỉ"];
    }

    getHtmlAdd(){
      return  [TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
              TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_CUSTOM,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML
                ,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["","","","","","","","","","", ""];
    }
    getColumeValidate(){
      return ["leng6","email","password","phone","","","","",""];
    }
} 


