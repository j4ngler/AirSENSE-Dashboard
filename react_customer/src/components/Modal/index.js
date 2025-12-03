import React from "react";
import { Modal } from "antd";

const typeEnum = {
  infomation: 1,
  success: 2,
  error: 3,
  warninig: 4,
  edit: 5,
  delete: 6,
};

const ModalComponent = ({
  type,
  title,
  message,
  isModalOpen,
  handleOK,
  handleCancel,
}) => {

  return (
    <Modal
      title={title}
      open={isModalOpen}
      onCancel={handleCancel}
      closable={false}
      footer={false}
    >
      {message}
    </Modal>
  );
};
export default ModalComponent;
