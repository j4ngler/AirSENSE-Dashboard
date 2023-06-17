import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js';
import {
  ActionControl,
  TypeDialgueShow,
  SelectHTml,
} from '../../utils/commonUtil';

export default class OrderStatus {
  getColumeShow = (callback) => {
    const columns = [
      {
        field: 'order_status_id',
        headerName: 'STT',
        width: 140,
      },
      {
        field: 'title',
        headerName: 'title',
        width: 200,
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
      mainID: 'order_status_id',
      mainInfo: {
        field: 'title',
        headerName: 'Tình trạng',
        width: 200,
      },
      detailEdit: [],
    };
  }

  getInfoToAdd() {
    return ['title'];
  }
  getTitleToAdd() {
    return ['title'];
  }

  getHtmlAdd() {
    return [TypeDialgueShow.EDIT_TEXT];
  }
  getTypeSelectToAdd() {
    return [SelectHTml.NOT_CHECK_HTML];
  }
  getTypeSelectTabbleToAdd() {
    return [''];
  }
  getColumeValidate() {
    return ['', '', '', '', ''];
  }
}
