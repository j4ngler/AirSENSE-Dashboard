import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import {
  Collapse as MuiCollapse,
  Input,
  Button,
  MenuItem,
  Select,
} from '@material-ui/core';
import AcessButton from '../../../compoment/button/AcessButton.js';
import UploadImage from '../../../compoment/form/UploadImage.js';
import { addOneDataToTable } from '../../../api/httpBaseUtil.js';
import ManagerData from '../../../actions/ManagerData.js';

const AddProductStep1 = ({ sendTemplate }) => {
  const [select, setSelect] = useState([]);
  const [store_id, set_store_id] = useState(0);
  const [product_group_id, set_product_group_id] = useState(0);
  const [name, set_name] = useState('');
  const [detail, set_detail] = useState('');
  const [image, set_image] = useState('');
  const [product_group, set_product_group] = useState([]);
  const [subtitle, setSubtitle] = useState('');
  useEffect(() => {
    ManagerData.getLstDataPromise('store').then((result) => {
      setSelect(ManagerData.getTable('store'));
    });
    ManagerData.getLstDataPromise('product_group')
      .then(() => {
        set_product_group(ManagerData.getTable('product_group'));
      })
      .catch((err) => {
        console.log('loiiii:', err);
      });
  }, []);
  const ApplyDataChange = () => {
    var data = {
      product_id: 0,
      group_sub_id: product_group_id,
      store_id: store_id,
      title: name,
      description: detail,
      thumbnail: image,
      sub_title: subtitle,
      origin_country: 'China',
      meta_data: 'abc',
      old_id: 1,
    };
    addOneDataToTable('product', data)
      .then((response) => {
        data['product_id'] = response.data.result.insertId;
        sendTemplate(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      Tạo sản phẩm
      <div className={'title-dm-message'}>
        <UploadImage
          urlImage={image}
          uploadfileDataLink={(url) => {
            set_image(url);
          }}
        />
        <div style={{ marginLeft: 40 }}>
          <label className="margin-label-right">Nhóm sản phẩm </label>
          <Select
            labelId="role"
            id="role"
            className="enterprise-form1 permison-box"
            label={'Nhóm sản phẩm'}
            value={product_group_id}
            onChange={(event) => {
              set_product_group_id(event.target.value);
            }}
          >
            {product_group.map((vars) => (
              <MenuItem value={vars.product_group_id}>{vars.title}</MenuItem>
            ))}
          </Select>
          <br />
          <label className="margin-label-right">Công ty </label>
          <Select
            labelId="role"
            id="role"
            className="enterprise-form1 permison-box"
            label={'Công ty'}
            value={store_id}
            onChange={(event) => {
              set_store_id(event.target.value);
            }}
          >
            {select.map((vars) => (
              <MenuItem value={vars.store_id}>{vars.store_name}</MenuItem>
            ))}
          </Select>
          <br />
          <label className="margin-label-right">Tên Sản phẩm </label>
          <Input
            name="name"
            value={name}
            onChange={(e) => set_name(e.target.value)}
          />
          <br />
          <label className="margin-label-right">Tên phụ </label>
          <Input
            name="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
          <br />
          <label className="margin-label-right"> Chi tiết</label>
          <Input
            name="detail"
            value={detail}
            onChange={(e) => set_detail(e.target.value)}
          />
        </div>
        <div className={'group-button-dm-message'}>
          <AcessButton
            name={' sản phẩm'}
            id={0}
            onClick={() => ApplyDataChange()}
          />
        </div>
      </div>
    </div>
  );
};

export default AddProductStep1;
