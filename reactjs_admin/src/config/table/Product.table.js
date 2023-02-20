import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

export default class Product  {
    getColumeShow=(callback)=>{
        //"user_id","name","contactPhoneNumber","province","city","streetaddr","postCode"
        const columns = [
            {
              field: 'id',
              headerName: 'stt',
              width: 140,
            },
            {
              field: 'productGroup',
              headerName: 'productGroup',
              width: 200,
            },
            {
              field: 'title',
              headerName: 'title',
              width: 200,
            },
            {
              field: 'description',
              headerName: 'description',
              width: 240,
            },
            {
                field: 'thumbnail',
                headerName: 'thumbnail',
                width: 240,
            },
            {
                field: 'originCountry',
                headerName: 'originCountry',
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
        mainID:'product_id',
        mainInfo:{
            field: 'name',
            headerName: 'Sản phẩm',
            width: 200,
        },
        detailEdit:[
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
            field: 'detail',
            headerName: 'detail',
            width: 240,
          },
          {
              field: 'image',
              headerName: 'image',
              width: 240,
          },
          {
              field: 'store',
              headerName: 'store',
              width: 240,
          },
          
        ]
      }
    }

    getInfoToAdd(){
      return ["company_id","name","detail","image","store",];
    }
    getTitleToAdd(){
      return ["company_id","name","detail","image","store"];
    }

    getHtmlAdd(){
      return  [TypeDialgueShow.SELECT_TABLE,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
              TypeDialgueShow.EDIT_TEXT ];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML
                ,SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["company","","","",""];
    }
    getColumeValidate(){
      return ["","","","",""];
    }
} 


