import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js';
import {
  ActionControl,
  TypeDialgueShow,
  SelectHTml,
} from '../../utils/commonUtil';

class PagesCourse {
  getColumeShow = (callback) => {
    const columns = [
      {
        field: 'id',
        headerName: 'stt',
        width: 140,
      },
      {
        field: 'group_file',
        headerName: 'group_file',
        width: 200,
      },
      {
        field: 'filesave',
        headerName: 'filesave',
        width: 200,
      },
      {
        field: 'title',
        headerName: 'Số title thoại',
        width: 240,
      },
      {
        field: 'content',
        headerName: 'content',
        width: 240,
      },
      {
        field: 'content_img',
        headerName: 'content_img',
        width: 240,
      },
      {
        field: 'is_main_pages_id',
        headerName: 'is_main_pages_id',
        width: 240,
      },
      {
        field: 'set_to_fist',
        headerName: 'set_to_fist',
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
      mainID: 'course_page_id',
      mainInfo: {
        field: 'title',
        headerName: 'Chi tiết bài báo',
        width: 240,
      },
      detailEdit: [
        {
          field: 'group_file',
          headerName: 'group_file',
          width: 200,
        },
        {
          field: 'filesave',
          headerName: 'filesave',
          width: 200,
        },
        {
          field: 'title',
          headerName: 'Số title thoại',
          width: 240,
        },
        {
          field: 'content',
          headerName: 'content',
          width: 240,
        },
        {
          field: 'content_img',
          headerName: 'content_img',
          width: 240,
        },
        {
          field: 'is_main_pages_id',
          headerName: 'is_main_pages_id',
          width: 240,
        },
        {
          field: 'set_to_fist',
          headerName: 'set_to_fist',
          width: 240,
        },
      ],
    };
  }

  getInfoToAdd() {
    return [
      'course_id',
      'group_file',
      'course_group_id',
      'filesave',
      'title',
      'content',
      'content_img',
      'is_main_pages_id',
      'set_to_fist',
    ];
  }
  getTitleToAdd() {
    return [
      'course_id',
      'group_file',
      'course_group_id',
      'filesave',
      'title',
      'content',
      'content_img',
      'is_main_pages_id',
      'set_to_fist',
    ];
  }
  getHtmlAdd() {
    return [
      TypeDialgueShow.SELECT_CUSTOM,
      TypeDialgueShow.EDIT_TEXT,
      TypeDialgueShow.SELECT_TABLE,
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
      SelectHTml.SelectCourse,
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
    return ['', '', 'course', '', '', '', '', '', ''];
  }
  getColumeValidate() {
    return ['', '', '', 'leng6', '', '', '', ''];
  }
}

export default PagesCourse;
