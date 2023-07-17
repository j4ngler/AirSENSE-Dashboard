import React, { useEffect, useState } from 'react';
import { Select, Button, Space, Form } from 'antd';
import { httpPostData } from '../../features/API/httpBaseUtils';
import { API_URL } from '../../configs/config';

const { Option } = Select;

const SelectGroupPermission = ({ variantInput, form }) => {
  const [permissionOptions, setPermissionOptions] = useState([])
  const [stationOptions, setStationOptions] = useState([])
  const [contentSubOptions, setContentSubOptions] = useState([])
  const [groups, setGroups] = useState([]);

  const handleStationChange = (value, index) => {
    const updatedGroups = [...groups];
    delete updatedGroups[index].contentSub
    updatedGroups[index].station = value;
    setGroups(updatedGroups);
  };

  const handlePermissionChange = (value, index) => {
    const updatedGroups = [...groups];
    delete updatedGroups[index].station
    delete updatedGroups[index].contentSub
    updatedGroups[index].permission = value;
    setGroups(updatedGroups);
  };
  const handleContentSubChange = (value, index) => {
    const updatedGroups = [...groups];
    delete updatedGroups[index].station
    updatedGroups[index].contentSub = value;
    setGroups(updatedGroups);
  };

  const handleAddGroup = () => {
    setGroups([...groups, {}]);
  };

  const handleRemoveGroup = (index) => {
    const updatedGroups = [...groups];
    updatedGroups.splice(index, 1);
    setGroups(updatedGroups);
  };
  const fetchInitial = async () => {
    const permissionData = await httpPostData(API_URL + "customers/report", {
      table: "permission",
    });
    const stationData = await httpPostData(API_URL + "customers/report", {
      table: "device_sensor",
    });
    const contentSubData = await httpPostData(API_URL + "customers/report", {
      table: "content_sub",
    });

    setPermissionOptions(permissionData.data.result.filter((item) => item.permission_id > 20))
    setStationOptions(stationData.data.result)
    setContentSubOptions(contentSubData.data.result)
  }
  useEffect(() => {
    handleAddGroup()
    fetchInitial()
  }, [])
  const checkSaveGroup = (groupItems) => {
    if(groupItems.length===0){
      return false
    }
    for (let i = 0; i < groupItems.length; i++) {
      if (groupItems[i] && groupItems[i].permission) {
        if (!groupItems[i].station && !groupItems[i].contentSub) {
          console.log("groupItems[i]", groupItems[i])
          return false
        }
      }
      else {
        return false
      }
    }
    return true
  }
  useEffect(() => {
    if(checkSaveGroup(groups)){
      form.setFieldsValue({"permission":})
    }
  }, [groups])
  return (
    <div>
      <Form.Item label={
        <span style={{ fontWeight: "bold" }}>Chọn quyền</span>
      }
        name={variantInput.view.dataIndex}
        rules={variantInput.selectValidate}
      >
        {groups.map((group, index) => (
          <Space key={index} style={{ marginBottom: 8 }} direction='horizontal' >
            <Select
              placeholder="Quyền người dùng"
              style={{ width: 200 }}
              value={group.permission}
              onChange={(value) => handlePermissionChange(value, index)}
            >
              {permissionOptions.map((item) => {
                return <Option key={"permission-" + item.permission_id} value={item.permission_id}>{item.content}</Option>
              })}
            </Select>
            {group.permission > 20 && group.permission < 30 ? <Select Select
              placeholder="Trạm"
              style={{ width: 200 }}
              value={group.station}
              onChange={(value) => handleStationChange(value, index)}
            >
              {stationOptions.map((item) => {
                return <Option key={"station-" + item.station_id} value={item.station_id}>{`${item.title}(${item.address})`}</Option>
              })}
            </Select> :
              <Select
                placeholder="Bài báo"
                style={{ width: 200 }}
                value={group.contentSub}
                onChange={(value) => handleContentSubChange(value, index)}
              >
                {contentSubOptions.map((item) => {
                  return <Option key={"content-sub" + item.content_sub_id} value={item.content_sub_id}>{item.content}</Option>
                })}
              </Select>}
            <Button type="danger" onClick={() => handleRemoveGroup(index)}>Xóa</Button>
          </Space>
        ))}
        <Button type="primary" onClick={handleAddGroup}>Thêm group</Button>
      </Form.Item>
    </div>
  );
};

export default SelectGroupPermission;