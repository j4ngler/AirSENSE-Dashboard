import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

export default class BuyProductDetail  {
    getColumeShow=(callback)=>{
        //"user_id","name","contactPhoneNumber","province","city","streetaddr","postCode"
        const columns = [
            {
              field: 'id',
              headerName: 'stt',
              width: 140,
            },
            {
              field: 'user_id',
              headerName: 'người bán',
              width: 200,
            },
            {
              field: 'selled_id',
              headerName: 'địa chỉ',
              width: 200,
            },
            {
              field: 'KM',
              headerName: 'KM',
              width: 200,
            },
            {
              field: 'Total',
              headerName: 'Total',
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
        mainID:'buyproduct_id',
        mainInfo:{
            field: 'Total',
            headerName: 'Total',
            width: 200,
        },
        detailEdit:[
          {
            field: 'user_id',
            headerName: 'người bán',
            width: 200,
          },
          {
            field: 'selled_id',
            headerName: 'selled_id',
            width: 200,
          },
          {
            field: 'KM',
            headerName: 'province',
            width: 240,
          },
          {
              field: 'Total',
              headerName: 'Total',
              width: 240,
          },
          
        ]
      }
    }

    getInfoToAdd(){
      return ["user_id","selled_id","KM","Total"];
    }
    getTitleToAdd(){
      return ["user_id","selled_id","KM","Total"];
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
      return ["","","",""];
    }
} 


