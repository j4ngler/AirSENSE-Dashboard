import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';
class User_Admin  {
    getColumeShow=(callback)=>{
        const columns = [
            {
              field: 'id',
              headerName: 'stt',
              width: 40,
            },
            {
              field: 'fullname',
              headerName: 'Thông tin khách hàng',
              width: 200,
            },
            {
              field: 'email',
              headerName: 'email',
              width: 200,
            },
            {
              field: 'phoneNumber',
              headerName: 'Số điện thoại',
              width: 200,
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
                     // ManagerData.selectActionManager(ActionControl.ACTION_UPDATE);
                    }}
                  >
                  <EditIcon />
                  </span>
                  <span
                      onClick={() => {
                        if(callback!=null) callback(ActionControl.ACTION_DELETE);
                        //ManagerData.selectActionManager(ActionControl.ACTION_DELETE);
                        }}
                    >
                    <DeleteIcon />
                  </span>
                </div>
              ),
            },
          ];
        return columns;
    }

    getInfoToEdit(){
      return {
        mainID:'userid',
        mainInfo:{
            field: 'fullname',
            headerName: 'Thông tin khách hàng',
            width: 200,
        },
        detailEdit:[
          {
            field: 'id',
            headerName: 'stt',
            width: 140,
          },
          {
            field: 'fullname',
            headerName: 'Thông tin khách hàng',
            width: 200,
          },
          {
            field: 'email',
            headerName: 'email',
            width: 200,
          },
          {
            field: 'phoneNumber',
            headerName: 'Số điện thoại',
            width: 240,
          }
        ]
      }
    }
    
    getInfoToAdd(){
      return  ["name","email","password","phoneNumber","avatar","fullname","contact","note" ];
    }
    getTitleToAdd(){
      return  ["name","email","password","phoneNumber",
                "avatar","fullname","contact",
                "note"];
    }
    getHtmlAdd(){
      return  [TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
              TypeDialgueShow.SELECT_CUSTOM,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_CUSTOM,TypeDialgueShow.EDIT_TEXT,
              TypeDialgueShow.EDIT_TEXT];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML
                ,SelectHTml.SELECT_IMAGE_UP_LOAD,SelectHTml.NOT_CHECK_HTML,SelectHTml.SelectPermision,SelectHTml.NOT_CHECK_HTML,
                SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["","","","","","","","",""]; 
    }

    getColumeValidate(){
      return  ["leng3","email","password","phone","","leng3","","","" ];
    }


} 

export default  User_Admin;
