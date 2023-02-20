import { Row, Col } from "antd";
import React from "react";
import LeafletMap from "../../../components/Map/leafletmap";
import TableData from "../../../components/Table/dataTable";
const ListStation = () => {
  // const data = [];
  // for (let i = 0; i < 100; i++) {
  //   data.push({
  //     key: i,
  //     name: `Edrward ${i}`,
  //     age: 32,
  //     address: `London Park no. ${i}`,
  //   });
  // }
  return (
    <Row> 
      <TableData table={'device_sensor'}/>
      <Col span={18} offset={3}>
        <LeafletMap />
      </Col>
    </Row>
  );
};

export default ListStation;
