import React from "react";
import { Row, Col, Card, Timeline, Divider, Statistic, Space } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import "./dashboard.css";
import LineChart from "../../components/Chart";
const Dashboard = () => {
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
                <LineChart />
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
