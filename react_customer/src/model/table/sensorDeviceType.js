import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ActionControl, TypeDialogueShow } from "../../utils/commonUtils";
import { TableManifest } from "../../configs/constants";

class sensorDeviceType {
    getColumnShow = (callback) => {
        const columns = [
            {
                title: 'ID type',
                width: 60,
                dataIndex: 'device_type_id',
                key: 'device_type_id',
                fixed: 'left',
            },
            {
                title: "Nội dung",
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
            mainID: "device_type_id",
            mainInfo: {
                dataIndex: "content",
                title: "Nội dung",
                width: 200,
            },
            detailEdit: [
                {
                    dataIndex: "content",
                    title: "Nội dung",
                    width: 200,
                }
            ],
        };
    }

    getInformationToAdd() {
        return [
            {
                dataIndex: "content",
                title: "Nội dung",
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
            dataIndex: "sensor_device_type",
            delete_permission: TableManifest.ADMIN_STATION,
        };
    }
    getInformationCheckEdit() {
        return {
            dataIndex: "sensor_device_type",
            edit_permission: TableManifest.ADMIN_STATION,
        };
    }
}

export default sensorDeviceType;