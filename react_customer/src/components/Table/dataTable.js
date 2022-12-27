import React, { useEffect, useState } from "react";
import { Table } from 'antd';
import { exportColumnTable } from "../../model/manage.table";
import { ActionControl } from "../../utils/commonUtils";
import { httpGetDataTable } from "../../features/API/httpBaseUtils";
import ModalComponent from "../Modal";


const TableData = ({table}) =>{
    const [dataTable, setDataTable] = useState([]);
    const [column, setColumn] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [showModalReport, setShowModalReport] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showNotification, setShowNotification] = useState(false);


    useEffect(() => {
        const columnTable = exportColumnTable(table, callBack);
        setColumn(columnTable);
        async function fetchData() {
            const data = await httpGetDataTable(table);
            setDataTable(data);
            console.log(data);
        }
        fetchData();
    }, [refresh])

    const callBack = (type) => {
        if (ActionControl.ACTION_REPORT === type) setShowModalReport(true);
        if (ActionControl.ACTION_UPDATE === type)  setShowModalEdit(true);
        if (ActionControl.ACTION_DELETE === type)  setShowModalDelete(true);
    }


    return(
        <>
        <Table bordered columns={column} dataSource={dataTable} scroll={{ x: 1500, y: 300,}} />
        {
            showModalReport?(
                <ModalComponent />
            ):('')
        }
        </>
    )
}
export default TableData
