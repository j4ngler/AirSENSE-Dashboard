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

const SelectGroupContentSub = ({ detailValue, onChange }) => {
  // const [ handleClose] = useState()
  console.log('Cho nay OK');
  var content_sub = ManagerData.getTable('content_sub');
  var content_group = ManagerData.getTable('content_group');
  var idSelect = 0;
  var item = content_sub.filter((o) => o.content_sub_id == detailValue);
  if (item.length > 0) {
    var itemMainMenu = content_group.filter(
      (o) => o.content_group_id == item[0].content_group_id
    );
    if (itemMainMenu.length > 0) {
      idSelect = itemMainMenu[0].content_group_id;
    }
  }
  content_sub = content_sub.filter((o) => o.content_group_id == idSelect);

  const [state, setState] = useState({
    content_group: content_group,
    content_sub: content_sub,
    detailInfo: { sub_id: detailValue, id: idSelect },
  });

  const onChangeSub = (content, detail) => {
    var value = state.detailInfo;
    value[detail] = content.target.value;
    console.log('Content: ' + content);
    if (detail == 'id') {
      value.sub_id = 0;
      var content_sub = ManagerData.getTable('content_sub');
      var group_content_select = content_sub.filter(
        (o) => o.content_group_id == content.target.value
      );
      setState((prev) => ({
        ...prev,
        content_sub: group_content_select,
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
          {state.content_group.map((vars) => (
            <MenuItem value={vars.content_group_id} key={vars.content_group_id}>
              {vars.content_group}
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
          {state.content_sub.map((vars) => (
            <MenuItem value={vars.content_sub_id} key={vars.content_sub_id}>
              {vars.content_group}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectGroupContentSub;
