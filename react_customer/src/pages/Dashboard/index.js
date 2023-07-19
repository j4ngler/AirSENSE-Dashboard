import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Select,
  Image,
  Tooltip,
  Divider,
  Skeleton,
} from "antd";
import "./dashboard.css";
import temperature from "../../assets/icons/temperature.svg";
import humidity from "../../assets/icons/humidity.svg";
import wind from "../../assets/icons/wind.svg";
import { httpGetData } from "../../features/API/httpBaseUtils";
import {
  COThreshold,
  NO2Threshold,
  O3Threshold,
  PM10Threshold,
  PM1Threshold,
  SO2Threshold,
  getAQIColor,
  getAQIMessage,
  AQIThreshold,
} from "../../utils/checkInformationAQI";
import ProgressChartAQI from "../../components/Chart/ProgressChartAQI";
import { aqiToColor } from "../../configs/constants";
import { API_URL } from "../../configs/config";
const Dashboard = () => {
  const [dataAverage, setDataAverage] = useState([]);
  const [dataStationPick, setDataStationPick] = useState({});
  const [dataAQI, setDataAQI] = useState({});
  const [dataAQIPick, setDataAQIPick] = useState({});
  const [isLoading, setIsLoading] = useState(false)
  const fetchData = async () => {
    setIsLoading(true)
    const data = await httpGetData(
      API_URL + "customers/dashboard-data-average"
    );
    setIsLoading(false)
    setDataAverage(data.data.dataAverage);
    setDataAQI(data.data.dataAQI)
    setDataStationPick(data.data.dataAverage[0]);
    setDataAQIPick(data.data.dataAQI[0]);
  };
  const handleChangeStation = (value) => {
    dataAverage.forEach((item) => {
      if (item.station_id === value) {
        setDataStationPick(item);
      }
    });
    dataAQI.forEach((item) => {
      if (item.station_id === value) {
        setDataAQIPick(item);
      }
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Row gutter={[16, 16]}>
        <Card
          style={{ boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }}
        >
          <Row gutter={[16, 16]}>
            <Col span={2} style={{ display: "flex", alignItems: "center" }}>
              <Image
                width={100}
                src="https://aqicn.org/air/experiments/images/aqi-transparent.png"
              />
            </Col>
            <Col span={10}>
              <Row style={{ fontSize: "20px", color: "#676a6c" }}>
                Air Quality Index (AQI)
              </Row>
              <Row style={{ color: "#676a6c" }}>
                Chỉ số chất lượng không khí là một con số được các cơ quan chính
                phủ sử dụng để thông báo cho công chúng biết mức độ ô nhiễm của
                không khí hiện tại hoặc mức độ ô nhiễm được dự báo. Khi chỉ số
                AQI tăng lên, tỷ lệ phần trăm dân số ngày càng lớn có khả năng
                gặp phải những ảnh hưởng xấu đến sức khỏe ngày càng nghiêm
                trọng.
              </Row>
            </Col>
            <Col span={12}>
              <Row gutter={[32, 16]} style={{ color: "#676a6c" }}>
                <Col span={12}>
                  <Row
                    gutter={[16, 16]}
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    <Col span={16}>Mức độ ảnh hưởng</Col>
                    <Col span={8}>Màu sắc</Col>
                  </Row>
                  <Divider style={{ margin: "2px" }} />
                  <Row gutter={[16, 16]} style={{ textAlign: "center" }}>
                    <Col span={16}>Good</Col>
                    <Col
                      span={8}
                      style={{ backgroundColor: "#00e400", fontWeight: "bold" }}
                    >
                      0-50
                    </Col>
                  </Row>
                  <Divider style={{ margin: "2px" }} />
                  <Row gutter={[16, 16]} style={{ textAlign: "center" }}>
                    <Col span={16}>Moderate</Col>
                    <Col
                      span={8}
                      style={{ backgroundColor: "#ffff00", fontWeight: "bold" }}
                    >
                      51-100
                    </Col>
                  </Row>
                  <Divider style={{ margin: "2px" }} />
                  <Row gutter={[16, 16]} style={{ textAlign: "center" }}>
                    <Col span={16}>Unhealthy for Sensitive Groups</Col>
                    <Col
                      span={8}
                      style={{
                        backgroundColor: "#ff7e00",
                        fontWeight: "bold",
                        margin: "auto 0",
                      }}
                    >
                      101-150
                    </Col>
                  </Row>
                  <Divider style={{ margin: "2px" }} />
                </Col>
                <Col span={12}>
                  <Row
                    gutter={[16, 16]}
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    <Col span={16}>Mức độ ảnh hưởng</Col>
                    <Col span={8}>Màu sắc</Col>
                  </Row>
                  <Divider style={{ margin: "2px" }} />
                  <Row gutter={[16, 16]} style={{ textAlign: "center" }}>
                    <Col span={16}>Unhealthy</Col>
                    <Col
                      span={8}
                      style={{ backgroundColor: "#ff0000", fontWeight: "bold" }}
                    >
                      151-200
                    </Col>
                  </Row>
                  <Divider style={{ margin: "2px" }} />
                  <Row gutter={[16, 16]} style={{ textAlign: "center" }}>
                    <Col span={16}>Very Unhealthy</Col>
                    <Col
                      span={8}
                      style={{ backgroundColor: "#99004c", fontWeight: "bold" }}
                    >
                      201-300
                    </Col>
                  </Row>
                  <Divider style={{ margin: "2px" }} />
                  <Row gutter={[16, 16]} style={{ textAlign: "center" }}>
                    <Col span={16}>Hazardous</Col>
                    <Col
                      span={8}
                      style={{ backgroundColor: "#7e0023", fontWeight: "bold" }}
                    >
                      301-500
                    </Col>
                  </Row>
                  <Divider style={{ margin: "2px" }} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Row>
      <br />
      <Row>
        <Card
          style={{ boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)", width: "100%" }}
        >
          <Skeleton loading={isLoading} active>
            <Row style={{ display: "flex" }} gutter={[16, 32]}>
              <Col style={{ margin: "auto 0" }}>
                Chọn trạm muốn theo dõi
              </Col>
              <Col>
                <Select
                  defaultValue={dataAverage[0]?.station_id}
                  onChange={handleChangeStation}
                  options={dataAverage?.map((item) => {
                    return {
                      value: item.station_id,
                      label: `Trạm ${item.station_id}`,
                    };
                  })}
                />
              </Col>
            </Row>
          </Skeleton>
        </Card>
      </Row>
      <br />
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card
            title="Các chỉ số không khí"
            style={{ boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }}
            headStyle={{ textAlign: "center" }}
          >
            <Skeleton loading={isLoading} active>
              <Row gutter={[48, 16]} >
                <Col span={8} style={{ textAlign: "center" }}>
                  <div style={{ textAlign: "center", marginBottom: "10px" }}>AQI</div>
                  <ProgressChartAQI
                    value={dataAQIPick?.aqi}
                    min={0}
                    max={300}
                    renderColor={aqiToColor}
                    width={200}
                    type="dashboard"
                  />
                  <button
                    style={{
                      backgroundColor: `${getAQIColor(
                        AQIThreshold,
                        dataAQIPick?.aqi
                      )}`,
                      border: "none",
                      fontWeight: "bold",
                      color: "#fff",
                      height: "50px",
                      borderRadius: "10px",
                      fontSize: "16px"
                    }}

                    size="large"
                  >
                    {getAQIMessage(AQIThreshold, dataAQIPick?.aqi)}
                  </button>
                </Col>
                <Col span={8} style={{ borderRight: "1px solid #eeeeee" }}>
                  <div style={{ textAlign: "center", marginBottom: "10px" }}>Pollution</div>
                  <div style={{ fontSize: "18px", color: "#676a6c", fontWeight: "bold" }}>PM2.5</div>
                  <ProgressChartAQI
                    value={dataAQIPick?.PM2p5_aqi}
                    min={0}
                    max={200}
                    renderColor={aqiToColor}
                  />
                </Col>
                <Col span={8}>
                  <div style={{ marginBottom: "10px", textAlign: "center" }} >Weather</div>
                  <Row style={{ marginBottom: "10px" }}>
                    <Col span={12} style={{ textAlign: "center" }}>
                      <img src={temperature} width={40} alt="" />
                    </Col>
                    <Col span={12} style={{ fontSize: "18px", margin: "auto 0" }}>
                      {dataStationPick?.temperature?.toFixed(1) + "℃"}
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: "10px" }}>
                    <Col span={12} style={{ textAlign: "center" }}>
                      <img src={humidity} width={40} alt="" />
                    </Col>
                    <Col span={12} style={{ fontSize: "18px", margin: "auto 0" }}>
                      {dataStationPick?.humidity?.toFixed(1)}%
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: "10px" }}>
                    <Col span={12} style={{ textAlign: "center" }}>
                      <img src={wind} width={40} alt="" />
                    </Col>
                    <Col span={12} style={{ fontSize: "18px", margin: "auto 0" }}>
                      {dataStationPick?.wind_speed?.toFixed(1)}kph
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Skeleton>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Các chỉ số không khí khác"
            style={{ boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)" }}
            headStyle={{ textAlign: "center" }}
          >

            <Skeleton loading={isLoading} active>
              <Row className="data-wrapper">
                <Col span={14} className="data-title">
                  NO2
                </Col>
                <Tooltip
                  placement="rightTop"
                  title={getAQIMessage(NO2Threshold, dataStationPick?.NO2)}
                >
                  <button
                    className="data-index-wrapper"
                    size="large"
                    style={{
                      backgroundColor: `${getAQIColor(
                        NO2Threshold,
                        dataStationPick?.NO2
                      )}`,
                    }}
                  >
                    <Col span={10} className="data-index">
                      {dataStationPick?.NO2?.toFixed(2)}
                    </Col>
                  </button>
                </Tooltip>
              </Row>
              <Row className="data-wrapper">
                <Col span={14} className="data-title">
                  O3
                </Col>
                <Tooltip
                  placement="rightTop"
                  title={getAQIMessage(O3Threshold, dataStationPick?.O3)}
                >
                  <button
                    className="data-index-wrapper"
                    size="large"
                    style={{
                      backgroundColor: `${getAQIColor(
                        O3Threshold,
                        dataStationPick?.O3
                      )}`,
                      outline: "none",
                    }}
                  >
                    <Col span={10} className="data-index">
                      {dataStationPick?.O3?.toFixed(2)}
                    </Col>
                  </button>
                </Tooltip>
              </Row>
              <Row className="data-wrapper">
                <Col span={14} className="data-title">
                  SO2
                </Col>
                <Tooltip
                  placement="rightTop"
                  title={getAQIMessage(NO2Threshold, dataStationPick?.SO2)}
                >
                  <button
                    className="data-index-wrapper"
                    size="large"
                    style={{
                      backgroundColor: `${getAQIColor(
                        SO2Threshold,
                        dataStationPick?.SO2
                      )}`,
                    }}
                  >
                    <Col span={10} className="data-index">
                      {dataStationPick?.SO2?.toFixed(2)}
                    </Col>
                  </button>
                </Tooltip>
              </Row>
              <Row className="data-wrapper">
                <Col span={14} className="data-title">
                  CO
                </Col>
                <Tooltip
                  placement="rightTop"
                  title={getAQIMessage(COThreshold, dataStationPick?.CO)}
                >
                  <button
                    className="data-index-wrapper"
                    size="large"
                    style={{
                      backgroundColor: `${getAQIColor(
                        COThreshold,
                        dataStationPick?.CO
                      )}`,
                    }}
                  >
                    <Col span={10} className="data-index">
                      {dataStationPick?.CO?.toFixed(2)}
                    </Col>
                  </button>
                </Tooltip>
              </Row>
              <Row className="data-wrapper">
                <Col span={14} className="data-title">
                  PM1
                </Col>
                <Tooltip
                  placement="rightTop"
                  title={getAQIMessage(PM1Threshold, dataStationPick?.PM1)}
                >
                  <button
                    className="data-index-wrapper"
                    size="large"
                    style={{
                      backgroundColor: `${getAQIColor(
                        PM1Threshold,
                        dataStationPick?.PM1
                      )}`,
                    }}
                  >
                    <Col span={10} className="data-index">
                      {dataStationPick?.PM1?.toFixed(2)}
                    </Col>
                  </button>
                </Tooltip>
              </Row>
              <Row className="data-wrapper">
                <Col span={14} className="data-title">
                  PM10
                </Col>
                <Tooltip
                  placement="rightTop"
                  title={getAQIMessage(PM10Threshold, dataStationPick?.PM10)}
                >
                  <button
                    className="data-index-wrapper"
                    size="large"
                    style={{
                      backgroundColor: `${getAQIColor(
                        PM10Threshold,
                        dataStationPick?.PM10
                      )}`,
                    }}
                  >
                    <Col span={10} className="data-index">
                      {dataStationPick?.PM10?.toFixed(2)}
                    </Col>
                  </button>
                </Tooltip>
              </Row>
            </Skeleton>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
