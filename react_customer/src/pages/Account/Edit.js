import React, { useState } from "react";
import { Button, Form, Input, Image } from "antd";
import avatarDemo from "../../assets/icons/avatar.svg";
import { Col, Row } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import Swal from "sweetalert2";
export default function () {
  const customerInfo_gs = useSelector(
    (state) => state.authSlice.userInformation
  );
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const changeInformation = async (event) => {
    event.preventDefault();
    const data = {
      username: username,
      fullname: fullname,
      address: address,
      phone_number: phoneNumber,
    };
    try {
      const res = await axios.put(
        "http://localhost:3000/api/customers/update_info",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_AirSENSE")}`,
            // 'X-XSRF-TOKEN': localStorage.getItem("token_AirSENSE")
          },
        }
      );
      Swal.fire(
        'Đổi thông tin thành công!',
        '',
        'success'
      )
    } catch (error) {
      console.log(error);
    }
  };

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
  // const navigate = useNavigate();
  useEffect(() => {
    setFullname(customerInfo_gs?.user?.fullname);
    setUsername(customerInfo_gs?.user?.username);
    setAddress(customerInfo_gs?.user?.address);
    setPhoneNumber(customerInfo_gs?.user?.phone_number);
  }, []);
  return (
    <div>
      {customerInfo_gs && (
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
                <Form.Item label="Họ và tên">
                  <Input
                    value={fullname}
                    name="fullname"
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={10} offset={2}>
                <Form.Item label="Username hệ thống">
                  <Input
                    value={username}
                    name="Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <Form.Item label="Số điện thoại">
                  <Input
                    value={phoneNumber}
                    name="phone_number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={10} offset={2}>
                <Form.Item label="Địa chỉ email">
                  <Input value={customerInfo_gs?.user?.email} name="email" />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={10} offset={0}>
                <Form.Item
                  label="Địa chỉ"
                  onChange={(e) => setAddress(e.target.value)}
                >
                  <Input value={address} name="address" />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={10}>
                <Form.Item>
                  <Button type="primary" onClick={changeInformation}>
                    Submit
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      )}
    </div>
  );
}