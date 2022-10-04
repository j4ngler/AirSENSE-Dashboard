import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

class ExtendedData  {
    getColumeShow=(callback)=>{
        const columns = [
            {
              field: 'NodeId',
              headerName: 'stt',
              width: 140,
            },
            {
              field: 'Time',
              headerName: 'Thời gian',
              width: 200,
            },
            {
              field: 'CO',
              headerName: 'CO',
              width: 200,
            },
            {
              field: 'CO2',
              headerName: 'CO2',
              width: 240,
            },
            {
              field: 'SO2',
              headerName: 'SO2',
              width: 240,
            },
            {
              field: 'NO2',
              headerName: 'NO2',
              width: 240,
            },
            {
              field: 'O3',
              headerName: 'O3',
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
        mainID:'advertisement_id',
        mainInfo:{
          field: 'title',
          headerName: 'Chi tiết bài báo',
          width: 240,
        },
        detailEdit:[
          {
            field: 'group_file',
            headerName: 'group_file',
            width: 200,
          },
          {
            field: 'filesave',
            headerName: 'filesave',
            width: 200,
          },
          {
            field: 'title',
            headerName: 'Số title thoại',
            width: 240,
          },
          {
            field: 'content',
            headerName: 'content',
            width: 240,
          },
          {
            field: 'content_img',
            headerName: 'content_img',
            width: 240,
          },
        ]
      }
    }

    getInfoToAdd(){
      return  ["NodeId","CO","CO2","SO2","NO2","O3"];
    }
    getTitleToAdd(){
      return  ["NodeId","CO","CO2","SO2","NO2","O3"];
    }
    getHtmlAdd(){
      return  [TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
              TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML
                ,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["","","","","","" ];
    }
    getColumeValidate(){
      return ["","","","","",""];
    }
} 

export default  ExtendedData;
