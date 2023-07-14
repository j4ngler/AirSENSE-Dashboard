import { Button, Form, Input, Modal } from "antd";
import React from "react";
import {
  exportFieldCheckEdit,
  exportFieldToAdd,
  exportFieldToEdit,
  exportFieldToValidate,
} from "../../model/manage.table";
import { useState } from "react";
import DynamicForm from "../Form/DynamicForm";
import { editBlog, editTable } from "../../features/API/httpBaseUtils";
const EditModal = ({
  table,
  dataRow,
  setShowModalEdit,
  showModalEdit,
  refresh,
  setRefresh,
}) => {
  let infoCheckEditPermission = exportFieldCheckEdit(table);
  //matching table config with data
  const infoTitleAdd = exportFieldToAdd(table);
  let newInfo = {}; //information matched with data
  let header = []; //information of column config
  for (let i = 0; i < infoTitleAdd.view.length; i++) {
    newInfo[infoTitleAdd.view[i].dataIndex] =
      dataRow[infoTitleAdd.view[i].dataIndex];
    let detail = {};
    detail.view = infoTitleAdd.view[i];
    detail.html = infoTitleAdd.html[i];
    detail.selectTable = infoTitleAdd.selectTable[i];
    detail.selectValidate = infoTitleAdd.selectValidate[i];
    header.push(detail);
  }
  const infoTitleEdit = exportFieldToEdit(table);
  var titleModal = "";
  if (!!infoTitleEdit.mainInfo) {
    titleModal =
      infoTitleEdit.mainInfo.title +
      " : " +
      dataRow[infoTitleEdit.mainInfo.dataIndex];
  }
  if (!!infoTitleEdit.mainID) {
    newInfo[infoTitleEdit.mainID] = dataRow[infoTitleEdit.mainID];
  }
  var dataDetail = { header: header, value: newInfo };
  const [state, setState] = useState(dataDetail);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setShowModalEdit(false);
  };
  let initialValues = {};
  state.header.map((variantInput) => {
    initialValues = {
      ...initialValues,
      [variantInput.view.dataIndex]: state.value[variantInput.view.dataIndex],
    };
  });
  if (dataRow.content_sub_id) {
    initialValues.content_sub_id = {
      label: dataRow.content_sub_title,
      value: dataRow.content_sub_id
    }
  }
  if (dataRow.content_group_id) {
    initialValues.content_group_id = {
      label: dataRow.content_group_title,
      value: dataRow.content_group_id
    }
  }
  const onSave = async (values) => {
    const dataEdit = { ...state.value, ...values }
    const permissionValue =
      dataRow[infoCheckEditPermission.dataIndex] +
      "/" +
      infoCheckEditPermission.edit_permission;
    if (table === "content_page") {

      const data = await editBlog(dataEdit, permissionValue)
      console.log(data)
    }
    else {
      const data = await editTable(table, dataEdit, permissionValue)
      console.log(data)
    }
  }
  return (
    <Modal
      width={800}
      title={titleModal}
      onCancel={handleCancel}
      footer={[
      ]}
      open={showModalEdit}
    >
      <Form form={form} layout="vertical" onFinish={onSave} scrollToFirstError  >
        {state.header.map((variantInput) => (
          <DynamicForm form={form}
            key={variantInput.view.dataIndex}
            variantInput={variantInput}
            valueInput={state.value[variantInput.view.dataIndex]}
            selectTable={variantInput.selectTable}
          />
        ))}

        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" htmlType="submit">
          Save
        </Button>,
      </Form>
    </Modal >
  );
};

export default EditModal;
