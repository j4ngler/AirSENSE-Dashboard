import "./News.css";
import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import { Select, Input } from "antd";
import { FormOutlined, UploadOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { Button, message, Upload } from "antd";

export default function News() {
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
  const props = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
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
          <p>Upload ảnh</p>
          <Upload {...props} size="large">
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
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
    </Col>
  );
}
