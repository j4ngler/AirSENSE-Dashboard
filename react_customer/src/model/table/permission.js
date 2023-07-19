import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ActionControl, TypeDialogueShow } from "../../utils/commonUtils";
import { TableManifest } from "../../configs/constants";

class sensorDeviceType {
    getColumnShow = (callback) => {
        const columns = [
            {
                title: 'ID Permission',
                width: 60,
                dataIndex: 'permission_id',
                key: 'permission_id',
                fixed: 'left',
            },
            {
                title: "Quyền",
                dataIndex: 'content',
                key: 'content',
                width: 60,
            },
            {
                render: () => (
                    <div>
                        <span
                            style={{ fontSize: "20px", margin: "0 20px" }}
                            onClick={() => {
                                if (callback != null) callback(ActionControl.ACTION_UPDATE);
                            }}
                        >
                            <EditOutlined />
                        </span>
                        <span
                            style={{ fontSize: "20px", margin: "0 20px" }}
                            onClick={() => {
                                if (callback != null) callback(ActionControl.ACTION_DELETE);
                            }}
                        >
                            <DeleteOutlined />
                        </span>
                    </div>

                )
            }

        ];

        return columns;
    }

    getInformationToEdit() {
        return {
            mainID: "permission_id",
            mainInfo: {
                dataIndex: "content",
                title: "Quyền",
                width: 200,
            },
            detailEdit: [
                {
                    dataIndex: "content",
                    title: "Quyền",
                    width: 200,
                }
            ],
        };
    }

    getInformationToAdd() {
        return [
            {
                dataIndex: "content",
                title: "Quyền",
                width: 200,
            }
        ];
    }

    getHTMLToAdd() {
        return [
            TypeDialogueShow.EDIT_TEXT,
        ];
    }

    getTypeSelectTableToAdd() {
        return [""];
    }

    getColumnValidate() {

    }
    getInformationCheckDelete() {
        return {
            dataIndex: "permission_id",
            delete_permission: TableManifest.ADMIN,
        };
    }
    getInformationCheckEdit() {
        return {
            dataIndex: "permission_id",
            edit_permission: TableManifest.ADMIN,
        };
    }
}

export default sensorDeviceType;