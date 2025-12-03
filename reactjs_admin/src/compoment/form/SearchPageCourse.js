import React, { useState } from 'react';
import {
  FormControl,
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import { uploadfileDataImage } from '../../api/httpBaseUtil.js';
import Swal from 'sweetalert2';
import ManagerData from '../../actions/ManagerData.js';

const SearchPageCourse = ({ id_select, sub_id_select, changeID }) => {
  var pagesCourse = ManagerData.getTable('course_page');
  if (sub_id_select != 0)
    pagesCourse = pagesCourse.filter((o) => o.course_id == sub_id_select);
  const [state, setState] = useState(id_select);
  const uploadMainID = (event) => {
    console.log('Content: ' + event.target.value);
    setState(event.target.value);
    changeID(event.target.value);
  };
  return (
    <FormControl variant="outlined" className={'input-pages-register'}>
      <InputLabel
        className={'register-label'}
        shrink
        id="demo-simple-select-menu-search"
      >
        Chuyên mục
      </InputLabel>
      <Select
        className={'margin-right-register'}
        labelId="demo-simple-select-menu-search"
        id="status"
        value={state}
        onChange={(event) => {
          uploadMainID(event, 'id');
          // setRole(event.target.value);
        }}
      >
        <MenuItem value={0} key={0}>
          Chuyên mục đơn lẻ
        </MenuItem>
        <MenuItem value={-1} key={-1}>
          Chuyên mục chính
        </MenuItem>
        {pagesCourse
          ? pagesCourse.map((vars) => (
              <MenuItem value={vars.course_page_id} key={vars.course_page_id}>
                {vars.title}
              </MenuItem>
            ))
          : ''}
      </Select>
    </FormControl>
  );
};

export default SearchPageCourse;
