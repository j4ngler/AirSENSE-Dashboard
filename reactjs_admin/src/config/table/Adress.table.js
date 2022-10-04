import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

class Adress  {
    getColumeShow=(callback)=>{
        //"user_id","name","contactPhoneNumber","province","city","streetaddr","postCode"
        const columns = [
            {
              field: 'id',
              headerName: 'stt',
              width: 140,
            },
            {
              field: 'name',
              headerName: 'địa chỉ',
              width: 200,
            },
            {
              field: 'contactPhoneNumber',
              headerName: 'contactPhoneNumber',
              width: 200,
            },
            {
              field: 'province',
              headerName: 'province',
              width: 240,
            },
            {
                field: 'streetaddr',
                headerName: 'streetaddr',
                width: 240,
            },
            {
                field: 'postCode',
                headerName: 'postCode',
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
        mainID:'addr_id',
        mainInfo:{
            field: 'name',
            headerName: 'địa chỉ',
            width: 200,
        },
        detailEdit:[
          {
            field: 'name',
            headerName: 'địa chỉ',
            width: 200,
          },
          {
            field: 'contactPhoneNumber',
            headerName: 'contactPhoneNumber',
            width: 200,
          },
          {
            field: 'province',
            headerName: 'province',
            width: 240,
          },
          {
              field: 'streetaddr',
              headerName: 'streetaddr',
              width: 240,
          },
          {
              field: 'postCode',
              headerName: 'postCode',
              width: 240,
          },
        ]
      }
    }

    getInfoToAdd(){
      return ["user_id","name","contactPhoneNumber","province","city","streetaddr","postCode"];
    }
    getTitleToAdd(){
      return ["user_id","name","contactPhoneNumber","province","city","streetaddr","postCode"];
    }

    getHtmlAdd(){
      return  [TypeDialgueShow.NO_CHECK,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
              TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT ];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML
                ,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["","","","","","",""];
    }
    getColumeValidate(){
      return ["","leng6","phone","","","",""];
    }
} 

export default  Adress;
