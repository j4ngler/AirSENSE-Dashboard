import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import ManagerData from '../../actions/ManagerData.js';

const SelectCourse = ({ detailValue, onChange }) => {
  // const [ handleClose] = useState()
  console.log('Cho nay OK');
  var course = ManagerData.getTable('course');
  var course_group = ManagerData.getTable('course_group');
  var idSelect = 0;
  var item = course.filter((o) => o.course_id == detailValue);
  if (item.length > 0) {
    var itemMainMenu = course_group.filter(
      (o) => o.course_group_id == item[0].course_group_id
    );
    if (itemMainMenu.length > 0) {
      idSelect = itemMainMenu[0].course_group_id;
    }
  }
  course = course.filter((o) => o.course_group_id == idSelect);

  const [state, setState] = useState({
    course_group: course_group,
    course: course,
    detailInfo: { sub_id: detailValue, id: idSelect },
  });

  const onChangeSub = (content, detail) => {
    var value = state.detailInfo;
    value[detail] = content.target.value;
    console.log('Content: ' + content);
    if (detail == 'id') {
      value.sub_id = 0;
      var course = ManagerData.getTable('course');
      var group_course_select = course.filter(
        (o) => o.course_group_id == content.target.value
      );
      setState((prev) => ({
        ...prev,
        course: group_course_select,
        detailInfo: value,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        detailInfo: value,
      }));
      onChange(content);
    }
  };

  return (
    <div className={'dp-i'}>
      <FormControl variant="outlined" className={'input-pages-register'}>
        <InputLabel
          className={'register-label'}
          shrink
          id="demo-simple-select-menu"
        >
          Chuyên mục (menu)
        </InputLabel>
        <Select
          className={'margin-right-register'}
          labelId="demo-simple-select-menu"
          id="status"
          value={state.detailInfo.id}
          onChange={(event) => {
            onChangeSub(event, 'id');
            // setRole(event.target.value);
          }}
        >
          {state.course_group.map((vars) => (
            <MenuItem value={vars.course_group_id} key={vars.course_group_id}>
              {vars.course_group}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" className={'input-pages-register'}>
        <InputLabel
          className={'register-label'}
          shrink
          id="demo-simple-select-menu1"
        >
          Chuyên mục chi tiết
        </InputLabel>
        <Select
          className={'margin-right-register'}
          labelId="demo-simple-select-menu1"
          id="status"
          value={state.detailInfo.sub_id}
          onChange={(event) => {
            onChangeSub(event, 'sub_id');
            // setRole(event.target.value);
          }}
        >
          {state.course.map((vars) => (
            <MenuItem value={vars.course_id} key={vars.course_id}>
              {vars.course_group}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectCourse;
