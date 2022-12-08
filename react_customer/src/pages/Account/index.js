import React from "react";
import { Tabs } from "antd";
import "./account.css";
import Edit from "./Edit";
import { Col, Row } from "antd";
import ChangePassword from "./ChangePassword";
const onChange = (key) => {
  console.log(key);
};
const Account = () => (
  <Col span={22} offset={1} className="account-app">
    <Tabs
      defaultActiveKey="1"
      onChange={onChange}
      items={[
        {
          label: `Thông tin chi tiết`,
          key: "1",
          children:'',
        },
        {
          label: `Chỉnh sửa thông tin`,
          key: "2",
          children: <Edit />,
        },
        {
          label: `Đổi mật khẩu`,
          key: "3",
          children:  <ChangePassword />,
        },
      ]}
    />
  </Col>
);
export default Account;
