import React from "react";
import { Row } from "antd";
import TableData from "../../../components/Table/dataTable";

const MyNewspaper = () => {
  return (
    <>
      <Row>
          <TableData table={'content_page'}/>
      </Row>
    </>
  )
};
export default MyNewspaper;
