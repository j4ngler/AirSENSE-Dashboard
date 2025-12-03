import React from "react";
import { TypeDialogueShow } from "../../utils/commonUtils";
import { Form, Input, Switch } from "antd";
import UploadImage from "./UploadImage";
import SelectGroupContentSub from "./SelectGroupContentSub";
import DocumentForm from "./DocumentForm";
import SelectType from "./SelectType";
import SelectGroupPermission from "./SelectGroupPermission";

const DynamicForm = ({ variantInput, valueInput, selectTable, form }) => {
  if (variantInput.html === TypeDialogueShow.NO_CHECK) {
    return <></>;
  } else if (variantInput.html === TypeDialogueShow.EDIT_TEXT) {
    return (
      <Form.Item
        label={
          <span style={{ fontWeight: "bold" }}>{variantInput.view.title}</span>
        }
        name={variantInput.view.dataIndex}
        rules={variantInput.selectValidate}
        key={variantInput.view.dataIndex}
        initialValue={valueInput}
      >
        <Input />
      </Form.Item>
    );
  } else if (variantInput.html === TypeDialogueShow.EDIT_DOCUMENT) {
    //BLOG
    return (
      <Form.Item
        label={
          <span style={{ fontWeight: "bold" }}>{variantInput.view.title}</span>
        }
        name={"content_html"}
        rules={variantInput.selectValidate}
        key={variantInput.view.dataIndex}
      >
        <DocumentForm idBlog={valueInput} form={form} />
      </Form.Item>
    );
  } else if (variantInput.html === TypeDialogueShow.SELECT_IMAGE_UP_LOAD) {
    return (
      <Form.Item
        label={
          <span style={{ fontWeight: "bold" }}>{variantInput.view.title}</span>
        }
        name={variantInput.view.dataIndex}
        rules={variantInput.selectValidate}
        key={variantInput.view.dataIndex}
      >
        <UploadImage url={valueInput} form={form} />
      </Form.Item>
    );
  } else if (variantInput.html === TypeDialogueShow.SELECT_GROUP_CONTENT_SUB) {
    return (
      <Form.Item
        label={
          <span style={{ fontWeight: "bold" }}>{variantInput.view.title}</span>
        }
        name={variantInput.view.dataIndex}
        rules={variantInput.selectValidate}
        key={variantInput.view.dataIndex}
      >
        <SelectGroupContentSub initSubId={valueInput} />
      </Form.Item>
    );
  } else if (variantInput.html === TypeDialogueShow.SELECT_TOGGLE) {
    return (
      <Form.Item
        label={
          <span style={{ fontWeight: "bold" }}>{variantInput.view.title}</span>
        }
        name={variantInput.view.dataIndex}
        rules={variantInput.selectValidate}
        key={variantInput.view.dataIndex}
        initialValue={valueInput === 1 ? true : false}
      >
        <Switch defaultChecked={valueInput === 1 ? true : false} />
      </Form.Item>
    );
  } else if (variantInput.html === TypeDialogueShow.SELECT_TYPE) {
    return (
      <SelectType
        table={variantInput.selectTable}
        initialValue={valueInput}
        variantInput={variantInput}
      />
    );
  }
  else if (variantInput.html === TypeDialogueShow.SELECT_GROUP_PERMISSION) {
    return (
      <Form.Item label={<span style={{ fontWeight: "bold" }}>{variantInput.view.title}</span>
      }
        name={"permission"}
        rules={variantInput.selectValidate}
        key={variantInput.view.dataIndex}
        initialValue={valueInput === 1 ? true : false}>
        <SelectGroupPermission variantInput={variantInput} />
      </Form.Item>
    )
  }
  return <></>;
};

export default DynamicForm;
