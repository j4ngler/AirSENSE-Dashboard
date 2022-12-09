import React from "react";
import "./manageUser.css";
import TableData from "../../../components/Table/dataTable";
const columns = [
  {
    title: "Username",
    width: 40,
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Họ tên",
    width: 40,
    dataIndex: "fullName",
    key: "fullname",
  },
  {
    title: "Số điện thoại",
    width: 40,
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Email",
    width: 40,
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Địa chỉ",
    width: 40,
    dataIndex: "address",
    key: "address",
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
console.log(data);
const ManageUser = () => {
  return (
    <>
      <TableData columns={columns} data={data} />
    </>
  );
};
export default ManageUser;
