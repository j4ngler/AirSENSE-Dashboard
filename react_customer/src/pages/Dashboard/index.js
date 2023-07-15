import React, { useEffect, useState } from "react";
import { Row, Col, Card, Timeline, Divider, Statistic, Space, Select } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import "./dashboard.css";
import LineChart from "../../components/Chart";
import axios from "axios";
const Dashboard = () => {
  const [dataAverage, setDataAverage] = useState([]);
  const [dataStationPick, setDataStationPick] = useState({})
  const fetchData = async () => {
    const data = await axios.get(
      "http://localhost:3000/api/customers/dashboard-data-average"
    );
    setDataAverage(data.data);
    setDataStationPick(data.data[0])
  };
  const handleChangeStation = (value) => {

    dataAverage.forEach((item) => {
      if (item.station_id === value) {
        setDataStationPick(item)
      }
    })
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Row gutter={[16, 16]}>
      <Col span={16} className="gutter-row">
        <Space direction="vertical">
          <Row gutter={[16, 16]}>
            <Col>
              <Card title="Chất lượng không khí" style={{ width: 300 }}>
                <Select
                  defaultValue={dataAverage[0]?.station_id}
                  style={{
                    width: 120,
                  }}
                  onChange={handleChangeStation}
                  options={dataAverage?.map((item) => {
                    return {
                      value: item.station_id,
                      label: `Trạm ${item.station_id}`
                    }
                  })}
                />
                <br />
                <br />
                <br />
                <Row>
                  <Col span={16}>Nhiệt độ</Col>
                  <Col span={8}>{dataStationPick.temperature}</Col>
                </Row>
                <Row>
                  <Col span={16}>Độ ẩm</Col>
                  <Col span={8}>{dataStationPick.humidity}</Col>
                </Row>
                <Row>
                  <Col span={16}>CO</Col>
                  <Col span={8}>{dataStationPick.CO}</Col>
                </Row>
                <Row>
                  <Col span={16}>PM10</Col>
                  <Col span={8}>{dataStationPick.PM10}</Col>
                </Row>
                <Row>
                  <Col span={16}>Pm2p5</Col>
                  <Col span={8}>{dataStationPick.PM2p5}</Col>
                </Row>
                <Row>
                  <Col span={16}>PM1</Col>
                  <Col span={8}>{dataStationPick.PM1}</Col>
                </Row>
                <Row>
                  <Col span={16}>Pressure</Col>
                  <Col span={8}>{dataStationPick.pressure}</Col>
                </Row>
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
