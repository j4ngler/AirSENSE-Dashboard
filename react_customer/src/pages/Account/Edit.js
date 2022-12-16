import React from "react";
import { Button, Form, Input, Image } from "antd";
import avatarDemo from "../../assets/icons/avatar.svg";
import { Col, Row } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";

export default function () {
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Change Avatar
      </div>
    </div>
  );
  const navigate = useNavigate();
  return (
    <div>
      <Col span={22} offset={1}>
        <br />
        <Row>
          <Col>
            <div>
              <Image width={100} src={avatarDemo}></Image>
            </div>
          </Col>
          <Col>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Col>
        </Row>
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
