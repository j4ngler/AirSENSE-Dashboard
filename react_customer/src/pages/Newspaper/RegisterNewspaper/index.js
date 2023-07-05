import "./News.css";
import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Select, Input, Modal, Upload,Col, Row } from "antd";
import { FormOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../components/Button";
import { PlusOutlined } from "@ant-design/icons";
import { } from "antd";
import {
  httpGetData,
  httpPostData,
  registerPageToWriter,
  uploadfileDataImage,
} from "../../../features/API/httpBaseUtils";
import { API_URL } from "../../../configs/config";
import { MyCustomUploadAdapterPlugin } from "../../../features/API/uploadAdapter";
import { useNavigate } from "react-router-dom";

export default function News() {
  const navigate = useNavigate()
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [contentGroups, setContentGroups] = useState();
  const [contentGroup, setContentGroup] = useState();
  const [contentSubs, setContentSubs] = useState();
  const [contentSub, setContentSub] = useState();
  const [contentSubOptions, setContentSubOptions] = useState([]);
  const [contentImg, setContentImg] = useState("")
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileList, setFileList] = useState([]);
  const [contentHtml, setContentHtml] = useState()
  const fetchInitial = async () => {
    const dataGroups = await httpPostData(API_URL + "customers/report", {
      table: "content_group",
    });
    const dataSubs = await httpPostData(API_URL + "customers/report", {
      table: "content_sub",
    });
    setContentGroups(dataGroups.data.result);
    setContentSubs(dataSubs.data.result);
  };
  const contentGroupOptions =
    contentGroups &&
    contentGroups.map((item) => {
      return {
        value: item.content_group_id,
        label: item.content,
      };
    });
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
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
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
  const onChangeGroup = (value) => {
    setContentSubOptions(
      contentSubs
        .filter((item) => item.content_group_id === value)
        .map((item) => {
          return {
            value: item.content_sub_id,
            label: item.content,
          };
        })
    );
    setContentGroup(value);
  };
  const onChangeSub = (value) => {
    setContentSub(value);
  };
  const handleSubmit = () => {
    let data = {
      title,
      content: description,
      content_sub_id: contentSub,
      content_group_id: contentGroup,
      content_img: contentImg,
      group_file: "group_file",
      content_html: contentHtml,
      set_to_first: "1"
    };
    registerPageToWriter(data).then(response => {
      navigate("/customer/result", {
        state: {
          status: "success",
          title: "Đăng bài báo thành công!",
          finishedBtn: "Quay về trang chủ",
          againBtn: "Tiếp tục đăng báo",
        },
      });
    })
  };
  const custom_config = {
    extraPlugins: [MyCustomUploadAdapterPlugin],
  };
  useEffect(() => {
    fetchInitial();
  }, []);
  return (
    <Col span={22} offset={1} className="news-container">
      <div className="title">
        <h1>Đăng bài viết</h1>
      </div>
      <Row>
        <Col span={10} offset={1}>
          <div>Ảnh bài báo</div>
          <Upload
            // action="http://localhost:3006/customer/register_newspaper"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={async (file) => {
              const data = new FormData();
              data.append("file", file);
              const dataImg = await uploadfileDataImage(data);
              setContentImg(dataImg.data.url)
              return false;
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
            onChange={onChangeGroup}
            style={{
              width: "100%",
            }}
            options={contentGroupOptions}
          />
        </Col>
        <Col span={10} offset={2}>
          <p>Chuyên mục chi tiết</p>
          <Select
            size="large"
            placeholder="Please select"
            onChange={onChangeSub}
            style={{
              width: "100%",
            }}
            options={contentSubOptions}
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Col>

        <Col span={10} offset={2}>
          <p>Mô tả cụ thể</p>
          <Input
            size="large"
            placeholder="large size"
            prefix={<FormOutlined />}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
              data={contentHtml}
              config={custom_config}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContentHtml(data)
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
          <ButtonComponent content={"Đăng bài"} handle={handleSubmit} />
        </Col>
      </Row>
    </Col>
  );
}
