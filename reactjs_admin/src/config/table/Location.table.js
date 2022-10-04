import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

class Location  {
    getColumeShow=(callback)=>{
        const columns = [
            {
              field: 'id',
              headerName: 'stt',
              width: 140,
            },
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
            field: 'Latitude',
            headerName: 'Latitude',
            width: 100,
          },
          {
            field: 'Longtitude',
            headerName: 'Longtitude',
            width: 100,
          },
          {
            field: 'Altitude',
            headerName: 'Altitude',
            width: 100,
          },
          {
            field: 'Type',
            headerName: 'Type',
            width: 100,
          },
          {
            field: 'PictureLinks',
            headerName: 'PictureLinks',
            width: 100,
          },
          {
            field: 'StartTime',
            headerName: 'StartTime',
            width: 100,
          },
          {
            field: 'PictureLinks',
            headerName: 'PictureLinks',
            width: 100,
          },
          {
            field: 'PictureLinks',
            headerName: 'PictureLinks',
            width: 100,
          },
          {
            field: 'PictureLinks',
            headerName: 'PictureLinks',
            width: 100,
          },
        ]
      }
    }

    getInfoToAdd(){
      return  ["Latitude","Longtitude","Altitude","Type","PictureLinks","StartTime","StopTime","Description","ReverseGeocode","NodeId","Name","DateCreated","Status","Note","Contact","NoteStatus","Implement_TestingDate"];
    }
    getTitleToAdd(){
      return  ["Latitude","Longtitude","Altitude","Type","PictureLinks","StartTime","StopTime","Description","ReverseGeocode","NodeId","Name","DateCreated","Status","Note","Contact","NoteStatus","Implement_TestingDate"];
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
      return  ["","","","","","","","","","","","","","","","",""];
    }
    getColumeValidate(){
      return ["","","","","","","","","","","","","","","","",""];
    }
} 

export default  Location;
