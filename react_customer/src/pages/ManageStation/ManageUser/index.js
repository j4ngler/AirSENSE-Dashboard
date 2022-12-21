import React from "react";
import "./manageUser.css";
import TableData from "../../../components/Table/dataTable";
import { Link } from "react-router-dom";
import { Input, Space } from "antd";
import { SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
const { Search } = Input;

const columns = [
  {
    title: "Username",
    width: 10,
    dataIndex: "username",
    key: "username",
    align: "center",
  },
  {
    title: "Họ tên",
    width: 10,
    dataIndex: "fullName",
    key: "fullname",
    align: "center",
  },
  {
    title: "Số điện thoại",
    width: 10,
    dataIndex: "phone",
    key: "phone",
    align: "center",
  },
  {
    title: "Email",
    width: 10,
    dataIndex: "email",
    key: "email",
    align: "center",
  },
  {
    title: "Địa chỉ",
    width: 40,
    dataIndex: "address",
    key: "address",
    align: "center",
  },
  {
    title: "Chức năng",
    width: 20,
    dataIndex: "action",
    key: "action",
    fixed: "left",
    render: (_, record) => (
      <Space size="middle">
        <Link>Xem chi tiết {record.fullName}</Link>
      </Space>
    ),
    align: "center",
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
          prefix={<SearchOutlined />}
          placeholder="Nhập tên người dùng"
          allowClear
          enterButton="Tìm kiếm"
          size="large"
          onSearch={onSearch}
        />
      </div>
      <FloatButton
        icon={<PlusCircleOutlined />}
        type="default"
        style={{
          right: 110,
          top: 120,
        }}
        tooltip={<div>Thêm mới người dùng</div>}
      />
      <TableData columns={columns} data={data} />
    </>
  );
};
export default ManageUser;
