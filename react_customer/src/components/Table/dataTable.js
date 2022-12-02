import React from "react";
import { Table } from 'antd';

// 2 props of table component that are data and collums name 
const TableData = ({data,columns}) =>{
    return(
        <Table bordered columns={columns} dataSource={data} scroll={{ x: 1500, y: 300,}} />
    )
}
export default TableData

//ex data and collum data
/*const columns = [
    {
      title: 'Sensor Name',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    
    {
      title: 'PM2p5 index',
      dataIndex: 'address',
      key: '1',
      width: 150,
    },
    {
      title: 'PM10 index',
      dataIndex: 'age',
      key: '2',
      width: 150,
    },
    
  ];
  const data = [
    {{
    key: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  }}
  ]; */