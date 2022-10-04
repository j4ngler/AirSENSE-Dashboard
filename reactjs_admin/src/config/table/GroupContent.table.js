import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js';
import {
  ActionControl,
  TypeDialgueShow,
  SelectHTml,
} from '../../utils/commonUtil';

class GroupContent {
  getColumeShow = (callback) => {
    const columns = [
      {
        field: 'id',
        headerName: 'stt',
        width: 100,
      },
      {
        field: 'mac',
        headerName: 'Mac',
        width: 200,
      },
      {
        field: 'station_id',
        headerName: 'ID trạm',
        width: 400,
      },
      {
        field: 'location_lat',
        headerName: 'Vĩ độ',
        width: 400,
      },
      {
        field: 'location_long',
        headerName: 'kinh độ',
        width: 400,
      },
      {
        field: 'adress',
        headerName: 'Địa chỉ',
        width: 600,
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
      mainID: 'content_group_id',
      mainInfo: {
        field: 'content_group',
        headerName: 'content_group',
        width: 400,
      },
      detailEdit: [
        {
          field: 'content_group',
          headerName: 'content_group',
          width: 200,
        },
        {
          field: 'title',
          headerName: 'title',
          width: 400,
        },
      ],
    };
  }

  getInfoToAdd() {
    return ['content_group', 'title'];
  }
  getTitleToAdd() {
    return ['content_group', 'title'];
  }

  getHtmlAdd() {
    return [TypeDialgueShow.EDIT_TEXT, TypeDialgueShow.EDIT_TEXT];
  }
  getTypeSelectToAdd() {
    return [SelectHTml.NOT_CHECK_HTML, SelectHTml.NOT_CHECK_HTML];
  }
  getTypeSelectTabbleToAdd() {
    return ['', ''];
  }
  getColumeValidate() {
    return ['', ''];
  }
}

export default GroupContent;
