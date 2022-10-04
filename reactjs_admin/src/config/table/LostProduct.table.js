import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

export default class LostProduct  {
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
              field: 'name',
              headerName: 'name',
              width: 200,
            },
            {
              field: 'content',
              headerName: 'content',
              width: 240,
            },
            {
                field: 'number',
                headerName: 'number',
                width: 240,
            },
            {
                field: 'contain',
                headerName: 'contain',
                width: 240,
            },
            {
              field: 'expridate',
              headerName: 'expridate',
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
        mainID:'stord_id',
        mainInfo:{
            field: 'content',
            headerName: 'Sản phẩm',
            width: 200,
        },
        detailEdit:[
          {
            field: 'product_id',
            headerName: 'product_id',
            width: 200,
          },
          {
            field: 'company_id',
            headerName: 'company_id',
            width: 200,
          },
          {
            field: 'content',
            headerName: 'content',
            width: 240,
          },
          {
              field: 'number',
              headerName: 'number',
              width: 240,
          },
          {
              field: 'contain',
              headerName: 'contain',
              width: 240,
          },
          {
            field: 'expridate',
            headerName: 'expridate',
            width: 240,
          },
          
        ]
      }
    }

    getInfoToAdd(){
      return ["product_id","company_id","content","number","contain","expridate"];
    }
    getTitleToAdd(){
      return ["product_id","company_id","content","number","contain","expridate"];
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
      return  ["product","company","","","",""];
    }
    getColumeValidate(){
      return ["","","","number","","date"];
    }
} 


