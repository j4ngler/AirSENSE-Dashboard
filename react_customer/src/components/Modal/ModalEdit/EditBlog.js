import { Button, Form, Input, Modal, Upload } from "antd";
import React from "react";
import { uploadFileDataImage } from "../../../features/API/httpBaseUtils";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

const EditBlog = ({
  dataRow,
  setShowModalEdit,
  showModalEdit,
  refresh,
  setRefresh,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([
    { uid: "-1", name: "image.png", status: "done", url: dataRow?.content_img },
  ]);
  const [contentImg, setContentImg] = useState("");

  const [form] = Form.useForm();
  const onSave = () => {};
  const handleSave = () => {
    form.validateFields().then((values) => {
      values.content_image = contentImg;
      onSave(values);
      form.resetFields();
    });
  };
  const handleCancel = () => {
    setShowModalEdit(false);
  };

  //Upload Image
  const handleChangeImg = ({ fileList: newFileList }) =>
    setFileList(newFileList);
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
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
  return (
    <Modal
      title="Edit Modal"
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
      open={showModalEdit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tiêu đề"
          name="title"
          initialValue={dataRow.title}
          rules={[{ required: true, message: "Trường này là bắt buộc" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ảnh bìa"
          name="content_image"
          rules={[{ required: true, message: "Image is required" }]}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChangeImg}
            beforeUpload={async (file) => {
              const data = new FormData();
              data.append("file", file);
              const dataImg = await uploadFileDataImage(data);
              setContentImg(dataImg.data.url);
              return false;
            }}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
        {/* Add more Form.Item for other fields */}
      </Form>
    </Modal>
  );
};

export default EditBlog;
