import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

class SparcPosts  {
    getColumeShow=(callback)=>{
        const columns = [
            {
              field: 'id',
              headerName: 'stt',
              width: 140,
            },
            {
              field: 'post_title',
              headerName: 'post_title',
              width: 200,
            },
            {
              field: 'post_author',
              headerName: 'post_author',
              width: 200,
            },
            {
              field: 'post_status',
              headerName: 'post_status',
              width: 240,
            },
            {
              field: 'post_date',
              headerName: 'post_date',
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
        mainID:'ID',
        mainInfo:{
          field: 'post_title',
          headerName: 'post_title',
          width: 240,
        },
        detailEdit:[
          {
            field: 'post_title',
            headerName: 'post_title',
            width: 200,
          },
          {
            field: 'post_author',
            headerName: 'post_author',
            width: 200,
          },
          {
            field: 'post_status',
            headerName: 'post_status',
            width: 240,
          },
          {
            field: 'post_date',
            headerName: 'post_date',
            width: 240,
          },
        ]
      }
    }

    getInfoToAdd(){
      return  ["post_title","post_author","post_status","post_date"];
    }
    getTitleToAdd(){
      return  ["post_title","post_author","post_status","post_date"];
    }
    getHtmlAdd(){
      return  [TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["","","",""];
    }
    getColumeValidate(){
      return ["","","",""];
    }
} 

export default  SparcPosts;
