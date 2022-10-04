import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';


class DecentralizationAccess  {
    //"name","id_admin","id_member","enterprise_id","note"
    getColumeShow=(callback)=>{
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
              field: 'id_admin',
              headerName: 'id_admin',
              width: 200,
            },
            {
              field: 'id_member',
              headerName: 'id_member',
              width: 240,
            },
            {
                field: 'note',
                headerName: 'note',
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
            },
          ];
        return columns;
    }

    getInfoToEdit(){
      return {
        mainID:'decentralization_access_id',
        mainInfo:{
          field: 'name',
            headerName: 'name',
            width: 200,
        },
        detailEdit:[
          {
            field: 'name',
            headerName: 'name',
            width: 200,
          },
          {
            field: 'id_admin',
            headerName: 'id_admin',
            width: 200,
          },
          {
            field: 'id_member',
            headerName: 'id_member',
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
      return ["name","id_admin","id_member","enterprise_id","note"];
    }
    getTitleToAdd(){
      return ["name","id_admin","id_member","enterprise_id","note"];
    }

    getHtmlAdd(){
      return  [TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.SELECT_TYPE,TypeDialgueShow.SELECT_TYPE,TypeDialgueShow.SELECT_TYPE,
              TypeDialgueShow.EDIT_TEXT];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML
                ,SelectHTml.NOT_CHECK_HTML ];
    }
    getTypeSelectTabbleToAdd(){
      return  ["","users","users","enterprise",""];
    }
    getColumeValidate(){
      return ["","","","",""];
    }
} 

export default  DecentralizationAccess;
