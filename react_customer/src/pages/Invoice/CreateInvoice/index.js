import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Select, Input, Modal, Upload, Button, message, Col, Row, InputNumber } from "antd";
import ButtonComponent from "../../../components/Button";
import {} from "antd";

export default function CreateInvoice() {
  const options = [
    {
      value: "001",
      label: "Thuê dữ liệu trạm",
    },
    {
      value: "002",
      label: "Dịch vụ khác",
    },
  ];
  const timeOptions = [
    {
      value: "hour",
      label: "giờ"
    },
    {
      value: "day",
      label: "ngày"
    },
    {
      value: "week",
      label: "tuần"
    },
    {
      value: "month",
      label: "tháng"
    },
    {
      value: "year",
      label: "năm"
    }
  ]
  const onChange = (value) => {
    console.log(value);
  };
  return (
    <Col span={22} offset={1} className="news-container">
      <div className="title">
        <h1>Tạo hóa đơn</h1>
      </div>
      <Row>
        <Col span={10} offset={1}>
          <p>Danh mục (menu)</p>
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
          <p>Thời hạn</p>
          <Row>
            <InputNumber 
              min={0}
              size="large"
              className="input-number"
              onChange={onChange}
            />
            <Select
              size="large"
              placeholder="Please select"
              onChange={onChange}
              style={{
                width: "50%",
              }}
              options={timeOptions}
              className="input-time-options"
            />
          </Row>
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={22} offset={1}>
          <h2>Ghi chú</h2>
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
          <ButtonComponent content={'Tạo hóa đơn'} />
        </Col>
      </Row>
    </Col>
  );
}
