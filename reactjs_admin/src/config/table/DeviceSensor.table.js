import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

class DeviceSensor  {
    getColumeShow=(callback)=>{
        const columns = [
            {
              field: 'mac',
              headerName: 'Mac',
              width: 250,
            },
            {
              field: 'station_id',
              headerName: 'ID trạm',
              width: 250,
            },
            {
              field: 'latitude',
              headerName: 'Vĩ độ',
              width: 150,
            },
            {
              field: 'longtitude',
              headerName: 'Kinh độ',
              width: 150,
            },
            {
              field: 'title',
              headerName: 'Tên trạm',
              width: 240,
            },
            {
              field: 'address',
              headerName: 'Địa chỉ',
              width: 600,
            },
            {
              field: 'type_sensor',
              headerName: 'Loại trạm',
              width: 140,
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
          field: 'mac',
          headerName: 'mac',
          width: 240,
        },
        detailEdit:[
          {
            field: 'mac',
            headerName: 'mac',
            width: 100,
          },
          {
            field: 'station_id',
            headerName: 'station_id',
            width: 100,
          },
          {
            field: 'location_lat',
            headerName: 'Vĩ độ',
            width: 100,
          },
          {
            field: 'location_long',
            headerName: 'Kinh độ',
            width: 100,
          },
          {
            field: 'adress',
            headerName: 'Địa chỉ',
            width: 600,
          },
          {
            field: 'content',
            headerName: 'content',
            width: 240,
          },
          {
            field: 'id_group',
            headerName: 'id_group',
            width: 240,
          },
        ]
      }
    }

    getInfoToAdd(){
      return  ["mac","station_id","location_lat","location_long","adress","content","id_group"];
    }
    getTitleToAdd(){
      return  ["mac","station_id","location_lat","location_long","adress","content","id_group"];
    }
    getHtmlAdd(){
      return  [TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
              TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML
                ,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["","","","","","",""];
    }
    getColumeValidate(){
      return ["","","","","","",""];
    }
} 

export default  DeviceSensor;
