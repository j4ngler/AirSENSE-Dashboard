import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { Button, Form, Input, Image } from "antd";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const handleNewPassord = (e) => {
    setNewPassword(e.target.value);
    console.log(newPassword);
  };
  return (
    <Col span={22} offset={1} className="change-password">
      <h1>Change Password</h1>
      <br />
      <Form layout="vertical" action="/abc" method="get">
        <Row>
          <Col span={10}>
            <Form.Item label="Nhập mật khẩu cũ">
              <Input name="old_pass_word" placeholder="Enter password" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item label="Nhập mật khẩu mới">
              <Input
                type="password"
                name="new_pass_word"
                placeholder="Enter password"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item label="Nhập lại mật khẩu mới">
              <Input
                type="password"
                name="confirm_new_pass_word"
                id="display"
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) => handleNewPassord(e)}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className="change-pass-submit">
          <Form.Item>
            <Button type="primary submit">Submit</Button>
          </Form.Item>
        </div>
      </Form>
    </Col>
  );
};

export default ChangePassword;
