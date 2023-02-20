import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js';
import {
  ActionControl,
  TypeDialgueShow,
  SelectHTml,
} from '../../utils/commonUtil';

export default class Customer {
  getColumeShow = (callback) => {
    //"user_id","name","contactPhoneNumber","province","city","streetaddr","postCode"
    const columns = [
      {
        field: 'id',
        headerName: 'stt',
        width: 140,
      },
      {
        field: 'store_name',
        headerName: 'store_name',
        width: 200,
      },
      {
        field: 'owner',
        headerName: 'owner',
        width: 200,
      },
      {
        field: 'type_owner',
        headerName: 'type_owner',
        width: 200,
      },
      {
        field: 'adresss',
        headerName: 'adresss',
        width: 200,
      },
      {
        field: 'adresss_detail',
        headerName: 'adresss_detail',
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
      mainID: 'store_id',
      mainInfo: {
        field: 'store_name',
        headerName: 'Công ty',
        width: 200,
      },
      detailEdit: [
        {
          field: 'store_name',
          headerName: 'store_name',
          width: 200,
        },
        {
          field: 'adresss',
          headerName: 'adresss',
          width: 200,
        },
        {
          field: 'adresss_detail',
          headerName: 'adresss_detail',
          width: 200,
        },
      ],
    };
  }

  getInfoToAdd() {
    return [
      'store_name',
      'owner_id',
      'type_owner_id',
      'adresss',
      'adresss_detail',
    ];
  }
  getTitleToAdd() {
    return [
      'store_name',
      'owner_id',
      'type_owner_id',
      'adresss',
      'adresss_detail',
    ];
  }

  getHtmlAdd() {
    return [
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
    ];
  }
  getTypeSelectTabbleToAdd() {
    return ['', '', '', '', ''];
  }
  getColumeValidate() {
    return ['', '', '', '', ''];
  }
}
