import React from "react";
import ringingIcon from "../../assets/icons/ringing.svg";
import refreshIcon from "../../assets/icons/refresh.svg";
import logo from "../../assets/images/logo/airsense.jpg";
import { Input } from "antd";
import "./header.css";
import {
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Dropdown, Space } from "antd";
import avatar from "../../assets/icons/avatar.svg";
const Header = () => {
  const items = [
    {
      label: (
        <a href="" style={{ display: "flex", justifyContent: "start" }}>
          Account
        </a>
      ),
      key: "0",
      icon: <UserOutlined />,
    },
    {
      label: (
        <a href="" style={{ display: "flex", justifyContent: "start" }}>
          Setting
        </a>
      ),
      key: "1",
      icon: <SettingOutlined />,
    },
    {
      label: (
        <a href="" style={{ display: "flex" }}>
          Sign out
        </a>
      ),
      key: "2",
      icon: <LogoutOutlined />,
    },
  ];
  return (
    <>
      <header className="header-customer">
        <img src={logo} height={"45px"} />
        <Input
          placeholder="Tìm kiếm nội dung"
          prefix={<SearchOutlined />}
          className="input-search"
        />
        <span className="customer-button-header">
          <img src={refreshIcon} />
          <img src={ringingIcon} />
          <Dropdown
            menu={{
              items,
            }}
            trigger={["hover"]}
          >
            <img src={avatar} />
          </Dropdown>
        </span>
      </header>
    </>
  );
};

export default Header;
