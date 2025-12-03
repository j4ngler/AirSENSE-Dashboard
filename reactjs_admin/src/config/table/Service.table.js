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
    const columns = [
      {
        field: 'service_order_id',
        headerName: 'STT',
        width: 140,
      },
      {
        field: 'fullname',
        headerName: 'customer name',
        width: 200,
      },
      {
        field: 'service_name',
        headerName: 'service',
        width: 240,
      },
      {
        field: 'status',
        headerName: 'status',
        width: 240,
      },
      {
        field: 'from_time',
        headerName: 'from',
        width: 240,
      },
      { field: 'to_time', headerName: 'to', width: 240 },
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
      mainID: 'service_order_id',
      mainInfo: {
        field: 'fullname',
        headerName: 'Khách hàng',
        width: 200,
      },
      detailEdit: [
        {
          field: 'status',
          headerName: 'status',
          width: 200,
        },
      ],
    };
  }

  getInfoToAdd() {
    return ['customer_id', 'service_collection_id', 'order_status_id', 'from_time', 'to_time'];
  }
  getTitleToAdd() {
    return ['customer_id', 'service_collection_id', 'order_status_id', 'from_time', 'to_time'];
  }

  getHtmlAdd() {
    return [
      TypeDialgueShow.EDIT_TEXT,
      TypeDialgueShow.SELECT_TABLE,
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
    return ['customer', 'service_collection', 'order_status', 'service_order_detail', 'service_order_detail'];
  }
  getColumeValidate() {
    return ['', '', '', '', ''];
  }
}
