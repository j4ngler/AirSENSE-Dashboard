import { Row, Col } from "antd";
import React from "react";
import LeafletMap from "../../../components/Map/leafletmap";
import TableData from "../../../components/Table/dataTable";
const ListStation = () => {
  return (
    <Row>
      <TableData table={"device_sensor"} />
      <Col span={18} offset={3}>
        <LeafletMap />
      </Col>
    </Row>
  );
};

export default ListStation;
