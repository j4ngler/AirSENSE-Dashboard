import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { exportColumnTable } from "../../model/manage.table";
import { ActionControl } from "../../utils/commonUtils";
import { httpGetDataTable } from "../../features/API/httpBaseUtils";
import ModalComponent from "../Modal";
import ModalDelete from "../Modal/DeleteModal";
import EditModal from "../Modal/EditModal";
import AddModal from "../Modal/AddModal";

const TableData = ({ table, searchText = "", showModalAdd = false,setShowModalAdd }) => {
  const [dataTable, setDataTable] = useState([]);
  const [column, setColumn] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModalReport, setShowModalReport] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [dataRow, setDataRow] = useState({});
  const [dataFilter, setDataFilter] = useState([]);
  async function fetchData() {
    const data = await httpGetDataTable(table);
    setDataTable(data);
  }
  useEffect(() => {
    const columnTable = exportColumnTable(table, callBack);
    setColumn(columnTable);
    fetchData();
  }, [refresh]);
  useEffect(() => {
    const dataSet = dataTable.filter((item) => {
      return item?.fullname?.toLowerCase().includes(searchText?.toLowerCase());
    });
    setDataFilter(dataSet);
  }, [searchText, dataTable]);
  const callBack = (type) => {
    if (ActionControl.ACTION_REPORT === type) setShowModalReport(true);
    if (ActionControl.ACTION_UPDATE === type) setShowModalEdit(true);
    if (ActionControl.ACTION_DELETE === type) setShowModalDelete(true);
  };
  const paginationConfig = {
    pageSize: 5,
    total:
      searchText && searchText !== "" ? dataFilter.length : dataTable.length,
  };
  return (
    <>
      <Table
        bordered
        columns={column}
        dataSource={searchText === "" || !searchText ? dataTable : dataFilter}
        scroll={{ x: 1500, y: 300 }}
        pagination={paginationConfig}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setDataRow(record);
            },
          };
        }}
      />
      {showModalDelete ? (
        <ModalDelete
          setShowModalDelete={setShowModalDelete}
          showModalDelete={showModalDelete}
          table={table}
          dataRow={dataRow}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      ) : (
        ""
      )}
      {showModalEdit ? (
        <EditModal
          setShowModalEdit={setShowModalEdit}
          showModalEdit={showModalEdit}
          table={table}
          dataRow={dataRow}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      ) : (
        ""
      )}
      {showModalAdd ? (
        <AddModal
        table={table}
          setShowModalAdd={setShowModalAdd}
          showModalAdd={showModalAdd}
          dataRow={dataRow}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      ) : (
        ""
      )}
      {showModalReport ? <ModalComponent /> : ""}
    </>
  );
};
export default TableData;
