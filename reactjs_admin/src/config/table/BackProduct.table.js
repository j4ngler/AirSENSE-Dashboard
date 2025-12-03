import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

class BackProduct  {
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
              headerName: 'name',
              width: 200,
            },
            {
              field: 'quantity',
              headerName: 'số lượng',
              width: 200,
            },
            {
              field: 'KM',
              headerName: 'khuyến mại',
              width: 200,
            }
            ,
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
            field: 'quantity',
            headerName: 'quantity',
            width: 200,
        },
        detailEdit:[
          {
            field: 'product_id',
            headerName: 'product_id',
            width: 200,
          },
          {
            field: 'quantity',
            headerName: 'Số lượng',
            width: 200,
          },
          {
            field: 'KM',
            headerName: 'khuyến mại',
            width: 200,
          }
        ]
      }
    }

    getInfoToAdd(){
      return ["product_id","quantity","KM"];
    }
    getTitleToAdd(){
      return ["product_id","quantity","KM"];
    }

    getHtmlAdd(){
      return  [TypeDialgueShow.SELECT_TABLE,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["product","",""];
    }
    getColumeValidate(){
      return ["","number",""];
    }
} 

export default  BackProduct;
