import React, { useEffect, useState } from "react";
import { Row, Col, Card, Timeline, Divider, Statistic, Space } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import "./dashboard.css";
import LineChart from "../../components/Chart";
import axios from "axios";
import { Column } from "@ant-design/plots";
const Dashboard = () => {
  const [dataAverage, setDataAverage] = useState({});
  const fetchData = async () => {
    const data = await axios.get(
      "http://localhost:3000/api/customers/dashboard-data-average"
    );
    setDataAverage(data.data);
    console.log(data.data);
  };
  const data = [
    {
      type: "NO2",
      data_average: dataAverage?.NO2,
    },
    {
      type: "O3",
      data_average: dataAverage?.O3,
    },
    {
      type: "SO2",
      data_average: dataAverage?.SO2,
    },
    {
      type: "CO",
      data_average: dataAverage?.CO,
    },
    {
      type: "PM2p5",
      data_average: dataAverage?.PM2p5,
    },
    {
      type: "PM1",
      data_average: dataAverage?.PM1,
    },
    {
      type: "PM10",
      data_average: dataAverage?.CO,
    },
    {
      type: "Humidity",
      data_average: dataAverage?.humidity,
    },
    {
      type: "temperature",
      data_average: dataAverage?.temperature,
    },
    {
      type: "pressure",
      data_average: dataAverage?.pressure,
    },
    {
      type: "wind_speed",
      data_average: dataAverage?.wind_speed,
    },
    {
      type: "sound_noise",
      data_average: dataAverage?.sound_noise,
    },
  ];
  const config = {
    data,
    xField: 'type',
    yField: 'data_average',
    label: {
      position: 'middle',
      // 'top', 'bottom', 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: 'type',
      },
      data_average: {
        alias: 'data_average',
      },
    },
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Row gutter={[16, 16]}>
      <Col span={16} className="gutter-row">
        <Space direction="vertical">
          <Row gutter={[16, 16]}>
            <Col>
              <Card title="Customer" style={{ width: 300 }}>
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{
                    color: "#3f8600",
                  }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col>
              <Card title="Customer" style={{ width: 300 }}>
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{
                    color: "#3f8600",
                  }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col>
              <Card title="Customer" style={{ width: 300 }}>
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{
                    color: "#3f8600",
                  }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Card>
                <Column {...config} />
              </Card>
            </Col>
          </Row>
        </Space>
      </Col>
      <Col span={8} gutter={[16, 16]}>
        <Row className="timeline-container">
          <div className="title">
            <p>Recent activity</p>
            <Divider
              type="vertical"
              style={{ height: "100%", backgroundColor: "#ccc" }}
            />
            <p>Today</p>
          </div>
          <Timeline mode={"left"}>
            <Timeline.Item label="2015-09-01">Create a services</Timeline.Item>
            <Timeline.Item label="2015-09-01 09:12:11">
              Solve initial network problems
            </Timeline.Item>
            <Timeline.Item>Technical testing</Timeline.Item>
            <Timeline.Item label="2015-09-01 09:12:11">
              Network problems being solved
            </Timeline.Item>
          </Timeline>
        </Row>
      </Col>
    </Row>
  );
};

export default Dashboard;
