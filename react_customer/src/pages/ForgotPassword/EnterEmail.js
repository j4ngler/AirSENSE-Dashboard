import { Form, Input, Button } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./ForgotPassword.css";
import axios from "axios";
import { API_URL } from "../../configs/config";
const ResetPassword = () => {
  const [isSentEmail, setIsSentEmail] = useState(false);
  const onFinish = async (values) => {
    setIsSentEmail(true);
    const { email } = { ...values };
    await axios
      .post(API_URL+"auth/reset_password", {
        email,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
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
        <h2>Quên mật khẩu</h2>
        <Form.Item
          label="Nhập email đã đăng ký"
          rules={[
            { required: true, message: "" },
            {
              type: "email",
              message: "Vui lòng nhập đúng định dạng email",
            },
          ]}
          name="email"
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="btn-submit-email">
            Submit
          </Button>
        </Form.Item>
        {isSentEmail && (
          <p style={{ color: "red" }}>
            Link đổi mật khẩu đã được gửi đến mail của bạn
          </p>
        )}
        <Link to="/login" style={{"textDecoration":"underline"}}>Quay lại trang đăng nhập</Link>
      </Form>
    </div>
  );
};

export default ResetPassword;
