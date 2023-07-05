import { Form, Input, Button } from "antd";
import {useSearchParams, useParams } from "react-router-dom";
import React from "react";
import "./ForgotPassword.css";
import axios from "axios";
const EnterNewPassword = () => {
  let { user_id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const onFinish = async (values) => {
    let token = searchParams.get("token");
    const { password } = { ...values };
    const data = {
      password,
      user_id,
      token,
    };
    const newPassword = await axios
      .post("http://localhost:3000/api/auth/new_password", {
        data,
      })
      .then((res) => {
        alert(res.data.message);
        window.location.assign("/login")
      })
      .catch((err) => console.log(err));
  };
  const onFinishFailed = (err) => {
    console.log(err);
  };

  return (
    <div className="reset-password-wrapper">
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        className="form-forgot-password"
      >
        <h2>Đổi mật khẩu</h2>
        <Form.Item
          label="Nhập mật khẩu mới"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu",
            },
            {
              min: 6,
              message: "Mật khẩu phải lớn hơn 6 ký tự",
            },
          ]}
          name="password"
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu phải trùng khớp"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="btn-submit-email">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EnterNewPassword;
