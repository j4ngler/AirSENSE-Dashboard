import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

class BillService  {
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
            field: 'content',
            headerName: 'nội dung ',
            width: 200,
        },
        detailEdit:[
          {
            field: 'service_id',
            headerName: 'dịch vụ',
            width: 200,
          },
          {
            field: 'value',
            headerName: 'giá trị',
            width: 200,
          },
          {
            field: 'content',
            headerName: 'nội dung',
            width: 200,
          },

        ]
      }
    }

    getInfoToAdd(){
      return ["customer_id","service_id","value","content"];
    }
    getTitleToAdd(){
      return ["customer_id","service_id","value","content"];
    }

    getHtmlAdd(){
      return  [TypeDialgueShow.SELECT_TABLE,TypeDialgueShow.SELECT_TABLE,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
              TypeDialgueShow.EDIT_TEXT];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML
                ,SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["customer","service","",""];
    }
    getColumeValidate(){
      return ["","","",""];
    }
} 

export default  BillService;
