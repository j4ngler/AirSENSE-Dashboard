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

const SelectExam = ({ detailValue, onChange }) => {
  // const [ handleClose] = useState()
  console.log('Cho nay OK');
  var exam = ManagerData.getTable('exam');
  var exam_group = ManagerData.getTable('exam_group');
  var idSelect = 0;
  var item = exam.filter((o) => o.exam_id == detailValue);
  if (item.length > 0) {
    var itemMainMenu = exam_group.filter(
      (o) => o.exam_group_id == item[0].exam_group_id
    );
    if (itemMainMenu.length > 0) {
      idSelect = itemMainMenu[0].exam_group_id;
    }
  }
  exam = exam.filter((o) => o.exam_group_id == idSelect);

  const [state, setState] = useState({
    exam_group: exam_group,
    exam: exam,
    detailInfo: { sub_id: detailValue, id: idSelect },
  });

  const onChangeSub = (content, detail) => {
    var value = state.detailInfo;
    value[detail] = content.target.value;
    console.log('Content: ' + content);
    if (detail == 'id') {
      value.sub_id = 0;
      var exam = ManagerData.getTable('exam');
      var group_exam_select = exam.filter(
        (o) => o.exam_group_id == content.target.value
      );
      setState((prev) => ({
        ...prev,
        exam: group_exam_select,
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
          {state.exam_group.map((vars) => (
            <MenuItem value={vars.exam_group_id} key={vars.exam_group_id}>
              {vars.exam_group}
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
          {state.exam.map((vars) => (
            <MenuItem value={vars.exam_id} key={vars.exam_id}>
              {vars.exam_group}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectExam;
