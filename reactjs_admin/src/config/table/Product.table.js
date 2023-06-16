import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js';
import {
  ActionControl,
  TypeDialgueShow,
  SelectHTml,
} from '../../utils/commonUtil';

export default class Product {
  getColumeShow = (callback) => {
    //"user_id","name","contactPhoneNumber","province","city","streetaddr","postCode"
    const columns = [
      {
        field: 'id',
        headerName: 'stt',
        flex: 1,
      },
      {
        field: 'title',
        headerName: 'title',
        flex: 1,
      },
      {
        field: 'sub_title',
        headerName: 'sub_title',
        flex: 1,
      },
      {
        field: 'description',
        headerName: 'description',
        flex: 1,
      },
      {
        field: 'thumbnail',
        headerName: 'thumbnail',
        flex: 1,
      },
      {
        field: 'origin_country',
        headerName: 'origin_country',
        flex: 1,
      },
      {
        field: 'store_name',
        headerName: 'store_name',
        flex: 1,
      },
      {
        field: 'group_name',
        headerName: 'group_name',
        flex: 1,
      },
      {
        field: 'action',
        headerName: 'Thao tác',
        flex: 1,
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
      mainID: 'product_id',
      mainInfo: {
        field: 'title',
        headerName: 'Sản phẩm',
        flex: 1,
      },
    };
  }

  getInfoToAdd() {
    return [
      'store_id',
      'group_sub_id',
      'title',
      'sub_title',
      'description',
      'thumbnail',
    ];
  }
  getTitleToAdd() {
    return [
      'store_id',
      'group_sub_id',
      'title',
      'sub_title',
      'description',
      'thumbnail',
    ];
  }
  getJsonTofind() {
    return ['title', 'subtitle', 'description', 'thumnail'];
  }
  getHtmlAdd() {
    return [
      TypeDialgueShow.SELECT_TABLE,
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
    ];
  }
  getTypeSelectTabbleToAdd() {
    return ['store', '', '', '', ''];
  }
  getColumeValidate() {
    return ['', '', '', '', ''];
  }
}
