import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js';
import {
  ActionControl,
  TypeDialgueShow,
  SelectHTml,
} from '../../utils/commonUtil';

export default class ServiceCollection {
  getColumeShow = (callback) => {
    const columns = [
      {
        field: 'service_collection_id',
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
      mainID: 'service_collection_id',
      mainInfo: {
        field: 'title',
        headerName: 'Loại dịch vụ',
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
