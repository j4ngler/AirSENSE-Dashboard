import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';


class MqttMicroservice  {
    getColumeShow=(callback)=>{
      //"content","mqtt_pub","mqtt_sub","mqtt_user","mqtt_pass","mqtt_id"
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
              field: 'mqtt_pub',
              headerName: 'mqtt_pub',
              width: 200,
            },
            {
              field: 'mqtt_sub',
              headerName: 'mqtt_sub',
              width: 240,
            },
            {
              field: 'mqtt_user',
              headerName: 'mqtt_user',
              width: 240,
            },
            {
              field: 'mqtt_pass',
              headerName: 'mqtt_pass',
              width: 240,
            },
            {
              field: 'mqtt_id',
              headerName: 'mqtt_id',
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
        mainInfo:{
          field: 'content',
          headerName: 'content',
          width: 200,
        },
        mainID:'mqtt_microservice_id',
        detailEdit:[
          {
            field: 'content',
            headerName: 'content',
            width: 200,
          },
          {
            field: 'mqtt_pub',
            headerName: 'mqtt_pub',
            width: 200,
          },
          {
            field: 'mqtt_sub',
            headerName: 'mqtt_sub',
            width: 240,
          },
          {
            field: 'mqtt_user',
            headerName: 'mqtt_user',
            width: 240,
          },
          {
            field: 'mqtt_pass',
            headerName: 'mqtt_pass',
            width: 240,
          },
          {
            field: 'mqtt_id',
            headerName: 'mqtt_id',
            width: 240,
          }
        ]
      }
    }
    getInfoToAdd(){
      return  ["content","mqtt_pub","mqtt_sub","mqtt_user","mqtt_pass","mqtt_id"];
    }
    getTitleToAdd(){
      return  ["content","mqtt_pub","mqtt_sub","mqtt_user","mqtt_pass","mqtt_id"];
    }

    getHtmlAdd(){
      return  [TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
              TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT ];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML
                ,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["","","","","",""];
    }
    getColumeValidate(){
      return ["","leng3","leng3","leng3","leng3","leng3"];
    }
} 

export default  MqttMicroservice;
