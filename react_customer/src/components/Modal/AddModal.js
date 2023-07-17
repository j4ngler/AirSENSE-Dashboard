import React from "react";
import {
    exportFieldCheckEdit,
    exportFieldToAdd,
} from "../../model/manage.table";
import { Button, Form, Modal, Spin } from "antd";
import { useState } from "react";
import DynamicForm from "../Form/DynamicForm";
import { httpPostData } from "../../features/API/httpBaseUtils";
import { API_URL } from "../../configs/config";
import { openNotification, typeNotify } from "../../utils/notification";
import { LoadingOutlined } from "@ant-design/icons";

const AddModal = ({
    table,
    setShowModalAdd,
    showModalAdd,
    refresh,
    setRefresh,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    let titleModal = "";
    let infoCheckEditPermission;
    if (table !== "customer") {
        infoCheckEditPermission = exportFieldCheckEdit(table);
    } else if (table === "customer") {
        infoCheckEditPermission = {
            dataIndex: 0,
            edit_permission: 2,
        };
    }
    //matching table config with data
    const infoTitleAdd = exportFieldToAdd(table);
    let newInfo = {}; //information matched with data
    let header = []; //information of column config
    for (let i = 0; i < infoTitleAdd.view.length; i++) {
        var detail = {};
        newInfo[infoTitleAdd.view[i].dataIndex] = "";
        detail.view = infoTitleAdd.view[i];
        detail.html = infoTitleAdd.html[i];
        detail.selectTable = infoTitleAdd.selectTable[i];
        detail.selectValidate = infoTitleAdd.selectValidate[i];
        header.push(detail);
    }
    const handleCancel = () => {
        setShowModalAdd(false);
    };
    var dataDetail = { header: header, value: newInfo };
    const [state, setState] = useState(dataDetail);
    const [form] = Form.useForm();
    const onSave = async (value) => {
        const permissionValue =
            infoCheckEditPermission.dataIndex +
            "/" +
            infoCheckEditPermission.edit_permission;
        console.log(value)
        // setIsLoading(true);
        // if (table === "customer") {
        //     await httpPostData(
        //         API_URL + "customers/add-customer",
        //         value,
        //         permissionValue
        //     )
        //         .then((data) => {
        //             setIsLoading(false);
        //             if (data && data.data) {
        //                 console.log("data.message", data)
        //                 openNotification(typeNotify.SUCCESS, data.data.message);
        //             } else {
        //                 openNotification(typeNotify.ERROR, data.data.message);
        //             }
        //             handleCancel();
        //         })
        //         .catch((err) => {
        //             setIsLoading(false);
        //             openNotification(typeNotify.ERROR, err);
        //         });
        // }
    };
    const loadingIcon = (
        <LoadingOutlined
            style={{
                fontSize: 64,
            }}
            spin
        />
    );
    return (
        <>
            <Modal
                width={800}
                title={titleModal}
                onCancel={handleCancel}
                footer={[]}
                open={showModalAdd}
            >
                {isLoading === false ? (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onSave}
                        scrollToFirstError
                    >
                        {state.header.map((variantInput) => (
                            <DynamicForm
                                form={form}
                                key={variantInput.view.dataIndex}
                                variantInput={variantInput}
                                valueInput={state.value[variantInput.view.dataIndex]}
                                selectTable={variantInput.selectTable}
                            />
                        ))}
                        <Button key="cancel" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button key="save" type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form>
                ) : (
                    <div
                        style={{
                            width: "800px",
                            height: "500px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Spin indicator={loadingIcon} />
                    </div>
                )}
            </Modal>
        </>
    );
};

export default AddModal;
