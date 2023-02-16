import "./News.css";
import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Select, Input, Modal, Upload, Button, message, Col, Row } from "antd";
import { FormOutlined, UploadOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../components/Button";
import { PlusOutlined } from "@ant-design/icons";
import {} from "antd";

export default function News() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const options = [
    {
      value: "zhejiang",
      label: "Chuyên mục đơn lẻ",
    },
    {
      value: "jiangsu",
      label: " Chuyên mục chính",
    },
  ];
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) =>
  
  {
    console.log('Heloo guang....')
    setFileList(newFileList);

  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const onChange = (value) => {
    console.log(value);
  };
  return (
    <Col span={22} offset={1} className="news-container">
      <div className="title">
        <h1>Đăng bài viết</h1>
      </div>
      <Row>
        <Col span={10} offset={1}>
          <div>Ảnh bài báo</div>
          <Upload
            action="http://localhost:3006/customer/register_newspaper"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={file=>{
              console.log({file})
              return false
            }}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
        </Col>
      </Row>
      <Row>
        <Col span={10} offset={1}>
          <p>Chuyên mục (menu)</p>
          <Select
            size="large"
            placeholder="Please select"
            onChange={onChange}
            style={{
              width: "100%",
            }}
            options={options}
          />
        </Col>
        <Col span={10} offset={2}>
          <p>Chuyên mục chi tiết</p>
          <Select
            size="large"
            placeholder="Please select"
            onChange={onChange}
            style={{
              width: "100%",
            }}
            options={options}
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={10} offset={1}>
          <p>Tiêu đề bài viết</p>
          <Input
            size="large"
            placeholder="large size"
            prefix={<FormOutlined />}
          />
        </Col>

        <Col span={10} offset={2}>
          <p>Mô tả cụ thể</p>
          <Input
            size="large"
            placeholder="large size"
            prefix={<FormOutlined />}
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={22} offset={1}>
          <h2>Nội dung bài viết</h2>
          <div className={"document-editor"}>
            <div id="toolbar-container"></div>
            <CKEditor
              editor={ClassicEditor}
              data="<p>Hello from CKEditor 5!</p>"
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                console.log({ event, editor, data });
              }}
              onBlur={(event, editor) => {
                console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                console.log("Focus.", editor);
              }}
            />
          </div>
        </Col>
      </Row>
      <br />
      <Row>
        <Col offset={1}>
          <ButtonComponent content={'Đăng bài'} />
        </Col>
      </Row>
    </Col>
  );
}
