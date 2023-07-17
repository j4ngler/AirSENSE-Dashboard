import React, { useState } from "react";
import "./manageUser.css";
import TableData from "../../../components/Table/dataTable";
import { Input } from "antd";
import { SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";

const { Search } = Input;
const ManageUser = () => {
  const [searchText, setSearchText] = useState("");
  const onSearch = (value) => {
    setSearchText(value);
  };
  const [showModalAdd, setShowModalAdd] = useState(false);

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
        onClick={() => setShowModalAdd(!showModalAdd)}
        tooltip={<div>Thêm mới người dùng</div>}
      />
      <TableData
        table={"customer"}
        searchText={searchText}
        showModalAdd={showModalAdd}
        setShowModalAdd={setShowModalAdd}
      />
    </>
  );
};
export default ManageUser;
