import { Row, Col } from "antd";
import React from "react";
import LeafletMap from "../../../components/Map/leafletmap";
import TableData from "../../../components/Table/dataTable";
const ListStation = () => {
  const columns = [
    {
      title: "Sensor Name",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },

    {
      title: "PM2p5 index",
      dataIndex: "address",
      key: "1",
      width: 150,
    },
    {
      title: "PM10 index",
      dataIndex: "address",
      key: "2",
      width: 150,
    },
    {
      title: "PM1 index",
      dataIndex: "address",
      key: "3",
      width: 150,
    },
    {
      title: "Temperature",
      dataIndex: "address",
      key: "4",
      width: 150,
    },
    {
      title: "Humidity",
      dataIndex: "address",
      key: "5",
      width: 150,
    },
    {
      title: "Pressure",
      dataIndex: "address",
      key: "6",
      width: 150,
    },
    {
      title: "SO2 index",
      dataIndex: "address",
      key: "7",
      width: 150,
    },
    {
      title: "NO2 index",
      dataIndex: "address",
      key: "8",
      width: 150,
    },
    {
      title: "NO2 index",
      dataIndex: "address",
      key: "9",
      width: 150,
    },
    {
      title: "NO2 index",
      dataIndex: "address",
      key: "10",
      width: 150,
    },
    {
      title: "CO2 index",
      dataIndex: "address",
      key: "11",
      width: 150,
    },
    {
      title: "CO index",
      dataIndex: "address",
      key: "12",
      width: 150,
    },
    {
      title: "O3 index",
      dataIndex: "address",
      key: "13",
      width: 150,
    },
    {
      title: "NO2W index",
      dataIndex: "address",
      key: "14",
      width: 150,
    },
    {
      title: "NO2A index",
      dataIndex: "address",
      key: "15",
      width: 150,
    },
    {
      title: "O3W index",
      dataIndex: "address",
      key: "16",
      width: 150,
    },
    {
      title: "O3A index",
      dataIndex: "address",
      key: "17",
      width: 150,
    },
    {
      title: "COW index",
      dataIndex: "address",
      key: "18",
      width: 150,
    },
    {
      title: "COA index",
      dataIndex: "address",
      key: "19",
      width: 150,
    },
    {
      title: "SO2W index",
      dataIndex: "address",
      key: "20",
      width: 150,
    },
    {
      title: "SO2A index",
      dataIndex: "address",
      key: "21",
      width: 150,
    },
  ];
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    });
  }
  return (
    <Row>
      <TableData data={data} columns={columns}/>
      <Col span={18} offset={3}>
        <LeafletMap />
      </Col>
    </Row>
  );
};

export default ListStation;
