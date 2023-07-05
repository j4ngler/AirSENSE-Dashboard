import React from "react";
import { Row, Col, Image } from "antd";
import avatarDemo from "../../assets/icons/avatar.svg";
import { useSelector } from "react-redux";
export default function Detail() {
  const customerInfo_gs = useSelector(
    (state) => state.authSlice.userInformation
  );

  return (
    <div>
      {customerInfo_gs && (
        <div style={{ marginTop: "20px" }}>
          <Col offset={1}>
            <Row>
              <Image width={100} src={avatarDemo}></Image>
            </Row>
          </Col>
          <br />
          <Col offset={1} className="detail-container">
            <Row>
              <Col span={8} className="title">
                <p>Họ và tên</p>
              </Col>
              <Col offset={1} span={12}>
                <p>{customerInfo_gs?.user?.fullname}</p>
              </Col>
            </Row>
            <Row>
              <Col span={8} className="title">
                <p>Username</p>
              </Col>
              <Col offset={1} span={12}>
                <p>{customerInfo_gs?.user?.username}</p>
              </Col>
            </Row>
            <Row>
              <Col span={8} className="title">
                <p>Số điện thoại</p>
              </Col>
              <Col offset={1} span={12}>
                <p>{customerInfo_gs?.user?.phone_number}</p>
              </Col>
            </Row>
            <Row>
              <Col span={8} className="title">
                <p>Email</p>
              </Col>
              <Col offset={1} span={12}>
                <p>{customerInfo_gs?.user?.email}</p>
              </Col>
            </Row>
            <Row>
              <Col span={8} className="title">
                <p>Địa chỉ</p>
              </Col>
              <Col offset={1} span={12}>
                <p>{customerInfo_gs?.user?.address}</p>
              </Col>
            </Row>
            <Row>
              <Col span={8} className="title">
                <p>Liên hệ</p>
              </Col>
              <Col offset={1} span={12}>
                <p>{customerInfo_gs?.user?.contact}</p>
              </Col>
            </Row>
          </Col>
        </div>
      )}
    </div>
  );
}