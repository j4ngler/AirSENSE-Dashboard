import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js'
import {ActionControl ,TypeDialgueShow,SelectHTml} from '../../utils/commonUtil';

class SparcAqi  {
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
              field: 'aqi',
              headerName: 'aqi',
              width: 200,
            },
            // {
            //   field: 'action',
            //   headerName: 'Thao tác',
            //   width: 140,
            //   renderCell: () => (
            //     <div>
            //       <span
            //         onClick={() => {
            //           if(callback!=null) callback(ActionControl.ACTION_UPDATE);
            //         }}
            //       >
            //       <EditIcon />
            //       </span>
            //       <span
            //           onClick={() => {
            //             if(callback!=null) callback(ActionControl.ACTION_DELETE);
            //             }}
            //         >
            //         <DeleteIcon />
            //       </span>
            //     </div>
            //   ),
            // },
          ];
        return columns;
    }
    getInfoToEdit(){
      return {
        mainID:'advertisement_id',
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
            field: 'aqi_data',
            headerName: 'aqi_data',
            width: 200,
          },

          
         
        ]
      }
    }

    getInfoToAdd(){
      return  ["aqi","SO2_aqi","PM25_aqi","station_id","PM10_aqi","NO2_aqi","PM1_aqi","CO_aqi","O3_aqi","CO2_aqi"];
    }
    getTitleToAdd(){
      return  ["aqi","SO2_aqi","PM25_aqi","station_id","PM10_aqi","NO2_aqi","PM1_aqi","CO_aqi","O3_aqi","CO2_aqi"];
    }
    getHtmlAdd(){
      return  [TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
                TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,
                TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT,TypeDialgueShow.EDIT_TEXT];
    }
    getTypeSelectToAdd(){
      return  [SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,
                SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML
                ,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML,SelectHTml.NOT_CHECK_HTML];
    }
    getTypeSelectTabbleToAdd(){
      return  ["","","","","","","","","","",""];
    }
    getColumeValidate(){
      return ["","","","","","","","","","",""];
    }
} 

export default  SparcAqi;
