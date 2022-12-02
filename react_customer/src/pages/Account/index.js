import { Col, Row } from "antd";
import React, { useState } from "react";
import "./account.css";
import { Button, Form, Input, Image } from "antd";
import avatarDemo from "../../assets/icons/avatar.svg";
function Account() {
  const ItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 10,
    },
  };
  return (
    <>
      <Col span={22} offset={1} className="account-app">
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

          <Form.Item>
            <Button type="primary">Submit</Button>
          </Form.Item>
        </Form>
      </Col>
    </>
  );
}

export default Account;
