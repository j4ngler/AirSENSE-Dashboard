import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import {
  Collapse as MuiCollapse,
  Input,
  Button,
  MenuItem,
  Select,
} from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AcessButton from '../../../compoment/button/AcessButton.js';
import UploadImage from '../../../compoment/form/UploadImage.js';
import Collapse from '../../../compoment/modol/Collapse.js';
import {
  addOneDataToTable,
  deleteOneDataToTable,
} from '../../../api/httpBaseUtil.js';
import ManagerData from '../../../actions/ManagerData.js';
import Swal from 'sweetalert2';

const AddProductStep2 = ({ product, sendTemplate }) => {
  const [state, setState] = useState({ content: [] });
  const [collapses, setCollapses] = useState(true);
  const [select, setSelect] = useState([]);

  useEffect(() => {
    ManagerData.getLstDataPromise('store').then(() => {
      setSelect(ManagerData.getTable('store'));
    });
  }, []);

  const editInfoProduct = (index, name, value) => {
    var prevContent = [...state.content];
    prevContent[index][name] = value;
    setState((prev) => ({ ...prev, content: prevContent }));
  };
  const addInfoProduct = () => {
    var maxValue = 0;

    state.content.forEach(function (item) {
      console.log('item=>>', item);
      if (maxValue < item.product_variant_id)
        maxValue = item.product_variant_id;
    });
    maxValue = maxValue + 1;
    setState((prev) => ({
      ...prev,
      content: prev.content.concat({
        product_id: product.product_id,
        link_url: ' ',
        mid_cost: 1000,
        final_cost: 1000,
        promotion: '',
        product_image_id: maxValue,
        meta_data: 'abc',
        id: 0,
        title: '',
        rank: '0',
        old_id: '0',
        product_variant_id: maxValue,
        product_store_id: maxValue,

        store_id: product.store_id,
      }),
    }));
    console.log('add state.content', state.content);
  };

  const removeInfoProduct = (index) => {
    let currenInfo = state;
    let data = currenInfo.content[index];
    deleteOneDataToTable('product_variant', data).then((response) => {
      deleteOneDataToTable('product_store', data).then((response) => {
        deleteOneDataToTable('product_image', data).then((response) => {
          setState((prev) => ({
            ...prev,
            content: prev.content.filter(
              (product) => product.product_image_id !== data.product_image_id
            ),
          }));
        });
      });
    });
  };
  const sendDetailImageProduct = (index) => {
    var currenInfo = state;
    let data = currenInfo.content[index];
    addOneDataToTable('product_variant', data).then((response) => {
      currenInfo.content[index].product_variant_id =
        response.data.result.insertId;
      currenInfo.content[index].id = response.data.result.insertId;
      addOneDataToTable('product_image', data).then((response) => {
        currenInfo.content[index].product_image_id =
          response.data.result.insertId;
        currenInfo.content[index].id = response.data.result.insertId;
        addOneDataToTable('product_store', data).then((response) => {
          currenInfo.content[index].product_store_id =
            response.data.result.insertId;
          currenInfo.content[index].id = response.data.result.insertId;
          setState((prev) => ({ ...prev, content: currenInfo.content }));
          console.log('sendDetailImageProduct', state);
        });
        setState((prev) => ({ ...prev, content: currenInfo.content }));
        console.log('sendDetailImageProduct', state);
      });
      console.log('sendDetailImageProduct', state);
    });
    setState((prev) => ({ ...prev, content: currenInfo.content }));
  };

  const ApplyDataChange = () => {
    if (state.content.length < 1) {
      Swal.fire(
        'Không có thông tin cập nhật giá sản phẩm, xin vui lòng check lại'
      );
    } else {
      console.log('state.content', state.content);
      sendTemplate(state.content);
    }
  };

  return (
    <div className="layout-info-group">
      <div className={'group-button-dm-layout'}>
        <AcessButton
          name={' Chi tiết'}
          onClick={() => ApplyDataChange()}
          id={product.product_id}
        />
      </div>
      <Collapse
        title="Hình ảnh chi tiết sản phẩm và giá"
        expanded={collapses}
        setExpand={() => {
          setCollapses(!collapses);
        }}
      >
        <div className={'text-box-dm-message'}>
          <span>Nội dung</span>
          <div className={'messages-dm-message'}>
            {state.content.map((item, index) => (
              <div className={'title-dm-message messages-dm-message'}>
                <div
                  onClick={() => {
                    removeInfoProduct(index);
                  }}
                >
                  <RemoveCircleOutlineIcon />
                </div>

                <UploadImage
                  urlImage={item.link_url}
                  uploadfileDataLink={(url) => {
                    editInfoProduct(index, 'link_url', url);
                  }}
                />
                <div>
                  <div>
                    <label className="margin-label-right">
                      Chi tiết sản phẩm{' '}
                    </label>
                    <Input
                      name="title"
                      value={item.title}
                      style={{ width: '100%' }}
                      onChange={(e) =>
                        editInfoProduct(index, 'title', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="margin-label-right">Giá đăng</label>
                    <Input
                      name="mid_cost"
                      value={item.mid_cost}
                      style={{ width: 120, fontSize: 20 }}
                      onChange={(e) =>
                        editInfoProduct(index, 'mid_cost', e.target.value)
                      }
                    />

                    <label className="margin-label-right">Giá thật </label>
                    <Input
                      name="final_cost"
                      value={item.final_cost}
                      style={{ width: 120, fontSize: 20 }}
                      onChange={(e) =>
                        editInfoProduct(index, 'final_cost', e.target.value)
                      }
                    />
                    <label className="margin-label-right">Khuyến mại </label>
                    <Input
                      name="promotion"
                      value={item.promotion}
                      style={{ width: 120, fontSize: 20 }}
                      onChange={(e) =>
                        editInfoProduct(index, 'promotion', e.target.value)
                      }
                    />
                    <label className="margin-label-right">Hạn sử dụng </label>
                    <Input
                      type="date"
                      name="expiration-date"
                      value={item.expiration_date}
                      style={{ width: 120, fontSize: 20 }}
                      onChange={(e) =>
                        editInfoProduct(
                          index,
                          'expiration_date',
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                {item.id == 0 ? (
                  <AcessButton
                    name={' Chi tiết'}
                    onClick={() => {
                      sendDetailImageProduct(index);
                    }}
                    id={item.id}
                  />
                ) : (
                  ''
                )}
              </div>
            ))}
          </div>
          <div onClick={addInfoProduct}>
            <AddCircleOutlineIcon />
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default AddProductStep2;
