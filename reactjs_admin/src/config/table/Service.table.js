import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js';
import {
  ActionControl,
  TypeDialgueShow,
  SelectHTml,
} from '../../utils/commonUtil';

export default class Service {
  getColumeShow = (callback) => {
    //"user_id","name","contactPhoneNumber","province","city","streetaddr","postCode"
    const columns = [
      {
        field: 'id',
        headerName: 'stt',
        width: 140,
      },
      {
        field: 'name',
        headerName: 'name',
        width: 200,
      },
      {
        field: 'content',
        headerName: 'content',
        width: 200,
      },
      {
        field: 'title',
        headerName: 'title',
        width: 240,
      },
      {
        field: 'cost',
        headerName: 'cost',
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
      mainID: 'service_id',
      mainInfo: {
        field: 'name',
        headerName: 'Sản phẩm',
        width: 200,
      },
      detailEdit: [
        {
          field: 'name',
          headerName: 'name',
          width: 200,
        },
        {
          field: 'content',
          headerName: 'content',
          width: 200,
        },
        {
          field: 'page_service_id',
          headerName: 'page_service_id',
          width: 240,
        },
        {
          field: 'cost',
          headerName: 'cost',
          width: 240,
        },
      ],
    };
  }

  getInfoToAdd() {
    return ['name', 'content', 'page_service_id', 'cost', 'downloads'];
  }
  getTitleToAdd() {
    return ['name', 'content', 'page_service_id', 'cost', 'downloads'];
  }

  getHtmlAdd() {
    return [
      TypeDialgueShow.EDIT_TEXT,
      TypeDialgueShow.EDIT_TEXT,
      TypeDialgueShow.SELECT_TABLE,
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
    ];
  }
  getTypeSelectTabbleToAdd() {
    return ['', '', 'content_page', '', ''];
  }
  getColumeValidate() {
    return ['', '', '', 'number', ''];
  }
}
