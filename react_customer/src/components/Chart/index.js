import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import "./chart.css";

const LineChart = ({nameX,nameY}) => {

 const data = [
      {
        "Date": "2010-01",
        "scales": 1998
      },
      {
        "Date": "2010-02",
        "scales": 1850
      },
      {
        "Date": "2010-03",
        "scales": 1720
      },
      {
        "Date": "2010-04",
        "scales": 1818
      },
      {
        "Date": "2010-05",
        "scales": 1920
      },
      {
        "Date": "2010-06",
        "scales": 1802
      },
      {
        "Date": "2010-07",
        "scales": 1945
      },
      {
        "Date": "2010-08",
        "scales": 1856
      },
      {
        "Date": "2010-09",
        "scales": 2107
      },
      {
        "Date": "2010-10",
        "scales": 2140
      },
      {
        "Date": "2010-11",
        "scales": 2311
      },
      {
        "Date": "2010-12",
        "scales": 1972
      },
      {
        "Date": "2011-01",
        "scales": 1760
      },
      {
        "Date": "2011-02",
        "scales": 1824
      },
      {
        "Date": "2011-03",
        "scales": 1801
      },
      {
        "Date": "2011-04",
        "scales": 2001
      },
      {
        "Date": "2011-05",
        "scales": 1640
      },
      {
        "Date": "2011-06",
        "scales": 1502
      },
      {
        "Date": "2011-07",
        "scales": 1621
      },
      {
        "Date": "2011-08",
        "scales": 1480
      },
      {
        "Date": "2011-09",
        "scales": 1549
      },
      {
        "Date": "2011-10",
        "scales": 1390
      },
      {
        "Date": "2011-11",
        "scales": 1325
      },
      {
        "Date": "2011-12",
        "scales": 1250
      },
      {
        "Date": "2012-01",
        "scales": 1394
      },
      {
        "Date": "2012-02",
        "scales": 1406
      },
      {
        "Date": "2012-03",
        "scales": 1578
      },
      {
        "Date": "2012-04",
        "scales": 1465
      },
      {
        "Date": "2012-05",
        "scales": 1689
      },
      {
        "Date": "2012-06",
        "scales": 1755
      },
 ]
  const config = {
    data,
    padding: 'auto',
    xField: 'Date',
    yField: 'scales',
    xAxis: {
        type: 'timeCat',
      tickCount: 5,
    },
    smooth: true,
    collor: 'red'
  };
  return (
  <div className='chart'>
    <div className='x-Axis-Name'>{nameX ? nameX: "x"}</div>
    <div className='chart-graphic'>
  <Line {...config}/>
    </div>
  <div className='y-Axis-Name'>{nameY? nameY: "y"}</div>
  </div>
  )
};
export default LineChart