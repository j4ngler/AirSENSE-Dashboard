import { Modal } from "antd";
import React from "react";
import {
  exportFieldCheckDelete,
  exportFieldToEdit,
} from "../../model/manage.table";
import { useState } from "react";
import { deleteOneTable } from "../../features/API/httpBaseUtils";
import { openNotification, typeNotify } from "../../utils/notification";

const DeleteModal = ({
  table,
  dataRow,
  showModalDelete,
  setShowModalDelete,
  refresh,
  setRefresh,
}) => {
  let infoTitle = exportFieldToEdit(table);
  let infoCheckDeletePermission = exportFieldCheckDelete(table);
  let dataInfo = "";
  let infoSent = {};
  if (!!infoTitle.mainInfo) {
    dataInfo =
      infoTitle.mainInfo.dataIndex +
      " :" +
      dataRow[infoTitle.mainInfo.dataIndex];
  }
  if (!!infoTitle.mainID && infoCheckDeletePermission.dataIndex) {
    infoSent[infoTitle.mainID] = dataRow[infoTitle.mainID];
    infoSent[infoCheckDeletePermission.dataIndex] = dataRow[infoCheckDeletePermission.dataIndex];
  }

  const handleOk = () => {
    const permissionValue =
      dataRow[infoCheckDeletePermission.dataIndex] +
      "/" +
      infoCheckDeletePermission.delete_permission;
    deleteOneTable(table, infoSent, permissionValue).then(() => {
      openNotification(typeNotify.SUCCESS, "Xóa dữ liệu thành công!");
      handleCancel();
      setRefresh(!refresh);
    });
  };
  const handleCancel = () => {
    setShowModalDelete(false);
  };

  return (
    <Modal
      title="Bạn có chắc chắn muốn xóa bài báo này?"
      open={showModalDelete}
      onOk={handleOk}
      onCancel={handleCancel}
    ></Modal>
  );
};

export default DeleteModal;
