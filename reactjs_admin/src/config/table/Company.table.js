import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

export default class Customer  {
    getColumeShow=(callback)=>{
        //"user_id","name","contactPhoneNumber","province","city","streetaddr","postCode"
        const columns = [
            {
              field: 'id',
              headerName: 'stt',
              width: 140,
            },
            {
              field: 'companyname',
              headerName: 'companyname',
              width: 200,
            },
            {
              field: 'adresss',
              headerName: 'adresss',
              width: 200,
            },
            {
              field: 'phone',
              headerName: 'phone',
              width: 240,
            },
            {
                field: 'fax',
                headerName: 'fax',
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
        mainID:'company_id',
        mainInfo:{
            field: 'companyname',
            headerName: 'Công ty',
            width: 200,
        },
        detailEdit:[
          {
            field: 'companyname',
            headerName: 'companyname',
            width: 200,
          },
          {
            field: 'adresss',
            headerName: 'adresss',
            width: 200,
          },
          {
            field: 'phone',
            headerName: 'phone',
            width: 240,
          },
          {
              field: 'fax',
              headerName: 'fax',
              width: 240,
          },
          
        ]
      }
    }

    getInfoToAdd(){
      return ["companyname","adresss","phone","fax"];
    }
    getTitleToAdd(){
      return ["companyname","adresss","phone","fax"];
    }

    getHtmlAdd(){
      return  [TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
             ];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML
               ];
    }
    getTypeSelectTabbleToAdd(){
      return  ["","","",""];
    }
    getColumeValidate(){
      return ["","","phone","number"];
    }
} 


