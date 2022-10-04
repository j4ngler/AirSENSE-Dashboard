import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ManagerData from '../../actions/ManagerData.js';
import {
  ActionControl,
  TypeDialgueShow,
  SelectHTml,
} from '../../utils/commonUtil';

class GroupCourse {
  getColumeShow = (callback) => {
    const columns = [
      {
        field: 'id',
        headerName: 'stt',
        width: 100,
      },
      {
        field: 'course_group',
        headerName: 'course_group',
        width: 200,
      },
      {
        field: 'title',
        headerName: 'title',
        width: 400,
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
      mainID: 'course_group_id',
      mainInfo: {
        field: 'course_group',
        headerName: 'course_group',
        width: 400,
      },
      detailEdit: [
        {
          field: 'course_group',
          headerName: 'course_group',
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
    return ['course_group', 'title'];
  }
  getTitleToAdd() {
    return ['course_group', 'title'];
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

export default GroupCourse;
