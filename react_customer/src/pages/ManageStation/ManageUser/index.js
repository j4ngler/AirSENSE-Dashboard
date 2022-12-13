import React from "react";
import "./manageUser.css";
import TableData from "../../../components/Table/dataTable";
import { Link } from "react-router-dom";
import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ButtonPrimary from "../../../components/Button/ButtonPrimary";
const { Search } = Input;

const columns = [
  {
    title: "Username",
    width: 10,
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Họ tên",
    width: 10,
    dataIndex: "fullName",
    key: "fullname",
  },
  {
    title: "Số điện thoại",
    width: 10,
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Email",
    width: 10,
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Địa chỉ",
    width: 40,
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Chức năng",
    width: 40,
    dataIndex: "action",
    key: "action",
    fixed: "left",
    render: (_, record) => (
      <Space size="middle">
        <Link>Xem chi tiết {record.fullName}</Link>
      </Space>
    ),
  },
];
const data = [];
for (let i = 0; i < 40; i++) {
  data.push({
    key: i,
    username: `Edward ${i}`,
    fullName: `Brian Edward ${i}`,
    phone: `${i}${i}${i}${i}${i}${i}${i}`,
    email: `edward${i}@gmail.com`,
    address: `London, Park Lane no. ${i}`,
  });
}
const onSearch = (value) => {
  console.log(value);
};
const ManageUser = () => {
  return (
    <>
      <div className="search-user">
        <Search
          prefix={<SearchOutlined/>}
          placeholder="Nhập tên người dùng"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
        />
      </div>
      <TableData columns={columns} data={data} />
    </>
  );
};
export default ManageUser;
