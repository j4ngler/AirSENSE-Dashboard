import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

class StatusHistoryDevice  {
    getColumeShow=(callback)=>{
        const columns = [
            {
                field: 'id',
                headerName: 'stt',
                width: 140,
            },
            {
                field: 'content',
                headerName:  'nội dung',
                width: 400,
            },
            {
                field: 'note',
                headerName: 'note',
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
            },
          ];
        return columns;
    }
    getInfoToEdit(){
      return {
        mainID:'id',
        mainInfo:{
          field: 'content',
          headerName: 'nội dung',
          width: 240,
        },
        detailEdit:[
          {
            field: 'content',
            headerName:  'nội dung',
            width: 400,
          },
          {
            field: 'note',
            headerName: 'note',
            width: 200,
          }
        ]
      }
    }

    getInfoToAdd(){
      return  ["deviceid","content","note"];
    }
    getTitleToAdd(){
      return  ["deviceid","content","note"];
    }
    getHtmlAdd(){
      return  [TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["","",""];
    }
    getColumeValidate(){
      return ["","",""];
    }
} 

export default  StatusHistoryDevice;
