import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Select, TextField, Label } from '@material-ui/core';
import classNames from 'classnames';
import SelectPermision from '../form/SelectPermision.js';
import CustomerPermision from '../form/CustomerPermision.js';
import SelectGroupContentSub from '../form/SelectGroupContentSub.js';
import UploadImage from './UploadImage.js';
import SelectInTable from '../form/SelectInTable.js';

import {
  ActionControl,
  TypeDialgueShow,
  SelectHTml,
} from '../../utils/commonUtil';

const DynamicForm = ({ value, valueDetail, selectTabble, onChange }) => {
  // const [ handleClose] = useState()
  //   console.log('value', value);
  //   console.log('valueDetail', valueDetail);
  //   console.log('selectTable', selectTabble);

  if (value.html == TypeDialgueShow.NO_CHECK) {
    return <></>;
  } else if (value.html == TypeDialgueShow.EDIT_TEXT) {
    return (
      <TextField
        variant="outlined"
        label={value.title}
        className="enterprise-form1 text-box1"
        value={valueDetail}
        onChange={(event) => {
          onChange(event);
        }}
      />
    );
  } else if (value.html == TypeDialgueShow.EDIT_CUSTOM) {
    if (value.typeSelect == SelectHTml.SelectPermision) {
      return (
        <SelectPermision
          typePermision={valueDetail}
          onChange={(event) => {
            onChange(event);
          }}
        />
      );
    } else if (value.typeSelect == SelectHTml.CUSTOMER_PERMISION) {
      return (
        <CustomerPermision
          typePermision={valueDetail}
          onChange={(event) => {
            onChange(event);
          }}
        />
      );
    }
  } else if (value.html == TypeDialgueShow.SELECT_TABLE) {
    console.log('First ', JSON.stringify(valueDetail));
    return (
      <SelectInTable
        table={selectTabble}
        value={valueDetail}
        onChange={(event) => {
          onChange(event);
        }}
      />
    );
  } else if (value.html == TypeDialgueShow.SELECT_CUSTOM) {
    if (value.typeSelect == SelectHTml.SelectGroupContentSub) {
      return (
        <SelectGroupContentSub
          detailValue={valueDetail}
          onChange={(event) => {
            onChange(event);
          }}
        />
      );
    } else if (value.typeSelect == SelectHTml.SELECT_IMAGE_UP_LOAD) {
      return (
        <UploadImage
          urlImage={valueDetail}
          uploadfileDataLink={(event) => {
            onChange(event);
          }}
        />
      );
    }
    return <></>;
  }
  return <></>;
};

export default DynamicForm;
