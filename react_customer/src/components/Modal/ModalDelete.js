import { Modal } from "antd";
import React from "react";
import {
  exportFieldCheckDelete,
  exportFieldToEdit,
} from "../../model/manage.table";
import { useState } from "react";
import { deleteOneTable } from "../../features/API/httpBaseUtils";
import { openNotification, typeNotify } from "../../utils/notification";

const ModalDelete = ({
  table,
  dataRow,
  showModalDelete,
  setShowModalDelete,
  refresh,
  setRefresh,
}) => {
  let infoTitle = exportFieldToEdit(table);
  let infoCheckDelete = exportFieldCheckDelete(table);
  let dataInfo = "";
  let infoSent = {};
  if (!!infoTitle.mainInfo) {
    dataInfo =
      infoTitle.mainInfo.dataIndex +
      " :" +
      dataRow[infoTitle.mainInfo.dataIndex];
  }
  if (!!infoTitle.mainID && infoCheckDelete.dataIndex) {
    infoSent[infoTitle.mainID] = dataRow[infoTitle.mainID];
    infoSent[infoCheckDelete.dataIndex] = dataRow[infoCheckDelete.dataIndex];
  }

  const handleOk = () => {
    const permissionValue =
      dataRow[infoCheckDelete.dataIndex] +
      "/" +
      infoCheckDelete.delete_permission;
    console.log(permissionValue);
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

export default ModalDelete;
