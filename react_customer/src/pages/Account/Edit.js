import React from "react";
import { Button, Form, Input, Image } from "antd";
import avatarDemo from "../../assets/icons/avatar.svg";
import { Col, Row } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function () {
  const navigate = useNavigate();
  return (
    <div>
      <Col span={22} offset={1}>
        <h1>Personal Information</h1>
        <br />
        <div>
          <h2>Avatar</h2>
          <Image width={100} src={avatarDemo}></Image>
        </div>
        <br />
        <Form layout="vertical">
          <Row>
            <Col span={10}>
              <Form.Item label="Full name">
                <Input value={"Phùng Bá Trường Giang"} name="fullname" />
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item label="User name">
                <Input value={"Giang handsome"} name="username" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label="Phone number">
                <Input value={"0836123318"} name="phone_number" />
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item label="Email">
                <Input value={"sparc.hust@gmail.com"} name="email" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={10} offset={0}>
              <Form.Item label="Address">
                <Input
                  value={"176, Ngọc Thụy, Long Biên, Hà Nội"}
                  name="address"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={10}>
              <Form.Item>
                <Button type="primary">Submit</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
    </div>
  );
}
