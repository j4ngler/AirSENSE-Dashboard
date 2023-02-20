import React, { useState } from "react";
import { Col, Row } from "antd";
import { Button, Form, Input } from "antd";
import { openNotification, typeNotify } from "../../utils/notification";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const submitForm = () => {
    openNotification(typeNotify.SUCCESS, 'Bạn đã thay đổi mật khẩu cá nhân thành công');
  }


  const handleConfirmPassword = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  return (
    <>
    <Col span={22} offset={1} className="change-password">
      <br />
      <Form layout="vertical" action="/abc" method="get">
        <Row>
          <Col span={10}>
            <Form.Item label="Nhập mật khẩu cũ">
              <Input
                type="password"
                name="old_pass_word"
                placeholder="Enter password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                value={confirmNewPassword}
                onChange={(e) => handleConfirmPassword(e)}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className="change-pass-submit">
          <Form.Item>
            <Button type="primary submit" onClick={submitForm}>Submit</Button>
          </Form.Item>
        </div>
      </Form>
    </Col>


   
    </>
  );
};

export default ChangePassword;
