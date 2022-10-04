import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

class SparcSensorWarning  {
    getColumeShow=(callback)=>{
        const columns = [
            {
              field: 'id',
              headerName: 'stt',
              width: 140,
            },
            {
              field: 'station_id',
              headerName: 'station_id',
              width: 200,
            },
            {
              field: 'content',
              headerName: 'content',
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
        mainID:'id',
        mainInfo:{
          field: 'station_id',
          headerName: 'station_id',
          width: 240,
        },
        detailEdit:[
          {
            field: 'station_id',
            headerName: 'station_id',
            width: 200,
          },
          {
            field: 'content',
            headerName: 'content',
            width: 240,
          },
        ]
      }
    }

    getInfoToAdd(){
      return  ["station_id","content"];
    }
    getTitleToAdd(){
      return  ["station_id","content"];
    }
    getHtmlAdd(){
      return  [TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["",""];
    }
    getColumeValidate(){
      return ["",""];
    }
} 

export default  SparcSensorWarning;
