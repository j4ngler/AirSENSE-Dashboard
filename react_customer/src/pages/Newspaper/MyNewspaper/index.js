import React from "react";
import { Row } from "antd";
import TableData from "../../../components/Table/dataTable";

const MyNewspaper = () => {
  return (
    <>
      <div>MyNewSpaper</div>
      <Row>
          <TableData table={'device_sensor'}/>
      </Row>
    </>
  )
};
export default MyNewspaper;
