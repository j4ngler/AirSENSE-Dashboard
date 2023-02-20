import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js';
import {
  ActionControl,
  TypeDialgueShow,
  SelectHTml,
} from '../../utils/commonUtil';

class SparcSensorData {
  getColumeShow = (callback) => {
    const columns = [
      {
        field: 'id',
        headerName: 'stt',
        width: 40,
      },
      {
        field: 'station_id',
        headerName: 'Mã trạm',
        width: 180,
      },
      {
        field: 'PM2p5',
        headerName: 'PM2p5',
        width: 150,
      },
      {
        field: 'PM10',
        headerName: 'PM10',
        width: 150,
      },
      {
        field: 'PM1',
        headerName: 'PM1',
        width: 150,
      },
      {
        field: 'Temperature',
        headerName: 'Nhiệt độ',
        width: 200,
      },
      {
        field: 'Humidity',
        headerName: 'Độ ẩm',
        width: 180,
      },
      {
        field: 'Pressure',
        headerName: 'Áp xuất',
        width: 180,
      },
      {
        field: 'SO2',
        headerName: 'SO2',
        width: 150,
      },
      {
        field: 'NO2',
        headerName: 'NO2',
        width: 150,
      },
      {
        field: 'action',
        headerName: 'Thao tác',
        width: 140,
        renderCell: () => (
          <div>
            <span
              onClick={() => {
                if (callback != null) callback(ActionControl.ACTION_UPDATE);
              }}
            >
              <EditIcon />
            </span>
            <span
              onClick={() => {
                if (callback != null) callback(ActionControl.ACTION_DELETE);
              }}
            >
              <DeleteIcon />
            </span>
          </div>
        ),
      },
    ];
    return columns;
  };
  getInfoToEdit() {
    return {
      mainID: 'Time',
      mainInfo: {
        field: 'station_id',
        headerName: 'station_id',
        width: 240,
      },
      detailEdit: [
        {
          field: 'station_id',
          headerName: 'station_id',
          width: 100,
        },
        {
          field: 'PM2p5',
          headerName: 'PM2p5',
          width: 100,
        },
        {
          field: 'PM10',
          headerName: 'PM10',
          width: 100,
        },
        {
          field: 'PM1',
          headerName: 'PM1',
          width: 100,
        },
        {
          field: 'Temperature',
          headerName: 'Temperature',
          width: 100,
        },
        {
          field: 'Humidity',
          headerName: 'Humidity',
          width: 100,
        },
        {
          field: 'Pressure',
          headerName: 'Pressure',
          width: 100,
        },
        {
          field: 'SO2',
          headerName: 'SO2',
          width: 100,
        },
        {
          field: 'NO2',
          headerName: 'NO2',
          width: 100,
        },
      ],
    };
  }

  getInfoToAdd() {
    return [
      'aqi',
      'SO2',
      'PM2p5',
      'station',
      'PM10',
      'NO2',
      'PM1',
      'CO',
      'O3',
      'CO2',
    ];
  }
  getTitleToAdd() {
    return [
      'aqi',
      'SO2',
      'PM2p5',
      'station',
      'PM10',
      'NO2',
      'PM1',
      'CO',
      'O3',
      'CO2',
    ];
  }
  getHtmlAdd() {
    return [
      TypeDialgueShow.EDIT_TEXT,
      TypeDialgueShow.EDIT_TEXT,
      TypeDialgueShow.EDIT_TEXT,
      TypeDialgueShow.EDIT_TEXT,
      TypeDialgueShow.EDIT_TEXT,
      TypeDialgueShow.EDIT_TEXT,
      TypeDialgueShow.EDIT_TEXT,
      TypeDialgueShow.EDIT_TEXT,
      TypeDialgueShow.EDIT_TEXT,
      TypeDialgueShow.EDIT_TEXT,
    ];
  }
  getTypeSelectToAdd() {
    return [
      SelectHTml.NOT_CHECK_HTML,
      SelectHTml.NOT_CHECK_HTML,
      SelectHTml.NOT_CHECK_HTML,
      SelectHTml.NOT_CHECK_HTML,
      SelectHTml.NOT_CHECK_HTML,
      SelectHTml.NOT_CHECK_HTML,
      SelectHTml.NOT_CHECK_HTML,
      SelectHTml.NOT_CHECK_HTML,
      SelectHTml.NOT_CHECK_HTML,
      SelectHTml.NOT_CHECK_HTML,
    ];
  }
  getTypeSelectTabbleToAdd() {
    return ['', '', '', '', '', '', '', '', '', ''];
  }
  getColumeValidate() {
    return ['', '', '', '', '', '', '', '', '', ''];
  }
}

export default SparcSensorData;
