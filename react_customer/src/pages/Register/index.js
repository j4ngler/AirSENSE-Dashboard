import { Col, Row, Form, Input, Button } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo/airsense.jpg";
import "./register.css";
import { API_URL } from "../../configs/config";
const Register = () => {
  const onFinish = async (values) => {
    const {
      username,
      email,
      password,
      fullName,
      phoneNumber,
      address,
      contact,
    } = {
      ...values,
    };
    try {
      await axios
        .post(API_URL+"auth/customer_register", {
          username,
          email,
          password,
          fullName,
          phoneNumber,
          address,
          contact,
        })
        .then((res) => {
          alert(res.data.message);
          if (res.status === 208) {
            return;
          } else {
            window.location.assign("/login");
          }
        });
    } catch (error) {
      // Handle error
      console.log(error.message);
    }
  };
  const onFinishFailed = (err) => {
    console.log(err);
  };
  return (
    <Form
      name="basic"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="wrapper"
    >
      <Col span={12} offset={6} className="register-form-container">
        <div className="logo-form">
          <img src={logo} width="50%" alt=""/>
        </div>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Họ và tên"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập vào họ và tên đầy đủ",
                },
              ]}
              name="fullName"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập vào username",
                },
              ]}
              name="username"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập vào số điện thoại",
                },
              ]}
              name="phoneNumber"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Mật khẩu"
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
          </Col>
        </Row>
        <Row>
          <Col span={12}>
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
                    return Promise.reject(
                      new Error("Mật khẩu phải trùng khớp")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Địa chỉ email"
              rules={[
                {
                  type: "email",
                  message: "Vui lòng nhập đúng định dạng email",
                },
                {
                  required: true,
                  message: "Vui lòng nhập email",
                },
              ]}
              name="email"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="Địa chỉ"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập vào địa chỉ của bạn",
                },
              ]}
              name="address"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="Liên hệ"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập vào thông tin liên hệ",
                },
              ]}
              name="contact"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item className="btn-submit-wrapper">
          <Button type="primary" htmlType="submit">
            Đăng ký
          </Button>
        </Form.Item>
        <div className="back-to-login">
          <Link to="/login"> Đã có tài khoản, đăng nhập ngay</Link>
        </div>
      </Col>
    </Form>
  );
};

export default Register;
