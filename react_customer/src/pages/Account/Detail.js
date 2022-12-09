import React from "react";
import { Row, Col } from "antd";
export default function Detail() {
  return (
    <div>
      <h2>Thông tin chi tiết</h2>
      <br />
      <div className="detail-container">
        <Row>
          <Col span={8} className="title">
            <p>Họ và tên</p>
          </Col>
          <Col offset={1} span={12}>
            <p>Phùng Bá Trường Giang</p>
          </Col>
        </Row>
        <Row>
          <Col span={8} className="title">
            <p>Username</p>
          </Col>
          <Col offset={1} span={12}>
            <p>Giang handsome</p>
          </Col>
        </Row>
        <Row>
          <Col span={8} className="title">
            <p>Số điện thoại</p>
          </Col>
          <Col offset={1} span={12}>
            <p>0836123318</p>
          </Col>
        </Row>
        <Row>
          <Col span={8} className="title">
            <p>Email</p>
          </Col>
          <Col offset={1} span={12}>
            <p>sparc.hust@gmail.com</p>
          </Col>
        </Row>
        <Row>
          <Col span={8} className="title">
            <p>Địa chỉ</p>
          </Col>
          <Col offset={1} span={12}>
            <p>176, Ngọc Thụy, Long Biên, Hà Nội</p>
          </Col>
        </Row>
      </div>
    </div>
  );
}
