import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

class SparcSensorMaxMin  {
    getColumeShow=(callback)=>{
        const columns = [
            {
              field: 'idf',
              headerName: 'stt',
              width: 140,
            },
            {
              field: 'station_id',
              headerName: 'station_id',
              width: 200,
            },
            {
              field: 'pm25_max',
              headerName: 'filesave',
              width: 200,
            },
            {
              field: 'pm25_min',
              headerName: 'Số title thoại',
              width: 240,
            },
            {
              field: 'pm10_max',
              headerName: 'special',
              width: 40,
            },
            {
              field: 'pm10_min',
              headerName: 'flagdelete',
              width: 40,
            },
            {
              field: 'pm1_max',
              headerName: 'flagdelete',
              width: 40,
            },
            {
              field: 'pm1_min',
              headerName: 'flagdelete',
              width: 40,
            },
            {
              field: 'temp_max',
              headerName: 'flagdelete',
              width: 40,
            },
            {
              field: 'temp_min',
              headerName: 'flagdelete',
              width: 40,
            },
            {
              field: 'humid_max',
              headerName: 'flagdelete',
              width: 40,
            },
            {
              field: 'humid_min',
              headerName: 'flagdelete',
              width: 40,
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
            field: 'pm25_max',
            headerName: 'filesave',
            width: 200,
          },
          {
            field: 'pm25_min',
            headerName: 'Số title thoại',
            width: 240,
          },
          {
            field: 'pm10_max',
            headerName: 'special',
            width: 40,
          },
          {
            field: 'pm10_min',
            headerName: 'flagdelete',
            width: 40,
          },
          {
            field: 'pm1_max',
            headerName: 'flagdelete',
            width: 40,
          },
          {
            field: 'pm1_min',
            headerName: 'flagdelete',
            width: 40,
          },
          {
            field: 'temp_max',
            headerName: 'flagdelete',
            width: 40,
          },
          {
            field: 'temp_min',
            headerName: 'flagdelete',
            width: 40,
          },
          {
            field: 'humid_max',
            headerName: 'flagdelete',
            width: 40,
          },
          {
            field: 'humid_min',
            headerName: 'flagdelete',
            width: 40,
          },
        ]
      }
    }

    getInfoToAdd(){
      return  ["station_id","pm25_max","pm25_min","pm25_max_enanble","pm25_min_enanble",
                "pm10_max","pm10_min","pm10_max_enanble","pm10_min_enanble","pm1_max",
                "pm1_min","pm1_max_enanble","pm1_min_enanble","temp_max","temp_min",
                "temp_max_enanble","temp_min_enanble","humid_max","humid_min","humid_max_enanble",
                "humid_min_enanble","special","flagdelete"];
    }
    getTitleToAdd(){
      return  ["station_id","pm25_max","pm25_min","pm25_max_enanble","pm25_min_enanble",
                "pm10_max","pm10_min","pm10_max_enanble","pm10_min_enanble","pm1_max",
                "pm1_min","pm1_max_enanble","pm1_min_enanble","temp_max","temp_min",
                "temp_max_enanble","temp_min_enanble","humid_max","humid_min","humid_max_enanble",
                "humid_min_enanble","special","flagdelete"];
    }
    getHtmlAdd(){
      return  [TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
                TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
                TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
                TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
                TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
                TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,
                SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,
                SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,
                SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,
                SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML
                ,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["","","","","","","","","","","","","","","","","","","","","","",""];
    }
    getColumeValidate(){
      return ["","","","","","","","","","","","","","","","","","","","","","",""];
    }
} 

export default  SparcSensorMaxMin;
