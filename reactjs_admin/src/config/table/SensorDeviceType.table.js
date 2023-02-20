import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

class SensorDeivceType  {
    getColumeShow=(callback)=>{
        const columns = [
            {
              field: 'id',
              headerName: 'stt',
              width: 140,
            },
            {
              field: 'content',
              headerName: 'content',
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
        mainID:'id_group',
        mainInfo:{
          field: 'content',
          headerName: 'content',
          width: 240,
        },
        detailEdit:[
          {
            field: 'content',
            headerName: 'content',
            width: 200,
          },
        ]
      }
    }

    getInfoToAdd(){
      return  ["content"];
    }
    getTitleToAdd(){
      return  ["content"];
    }
    getHtmlAdd(){
      return  [TypeDialgueShow.EDIT_TEXT];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  [""];
    }
    getColumeValidate(){
      return [""];
    }
} 

export default  SensorDeivceType;
