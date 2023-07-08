import React from "react";
import EditBlog from "./EditBlog";

const ModalEdit = ({
  table,
  dataRow,
  setShowModalEdit,
  showModalEdit,
  refresh,
  setRefresh,
}) => {
  if (table === "content_page") {
    return (
      <EditBlog
        setShowModalEdit={setShowModalEdit}
        showModalEdit={showModalEdit}
        refresh={refresh}
        setRefresh={setRefresh}
        dataRow = {dataRow}
      />
    );
  }
};

export default ModalEdit;
