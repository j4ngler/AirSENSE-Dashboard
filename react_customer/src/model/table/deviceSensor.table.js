import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ActionControl, TypeDialogueShow } from "../../utils/commonUtils";
import { TableManifest, ruleValidates } from "../../configs/constants";

class deviceSensor {
  getColumnShow = (callback) => {
    const columns = [
      {
        title: 'Tên trạm',
        width: 60,
        dataIndex: 'title',
        key: 'title',
        fixed: 'left',
      },
      {
        title: 'ID trạm',
        dataIndex: 'station_id',
        key: 'station_id',
        width: 60,
      },
      {
        title: 'MAC',
        dataIndex: 'mac',
        key: 'MAC',
        width: 60,
      },
      {
        title: 'Longitude',
        dataIndex: 'longitude',
        key: 'longitude',
        width: 50,
      },
      {
        title: 'Latitude',
        dataIndex: 'latitude',
        key: 'latitude',
        width: 50,
      },
      {
        title: 'Chủ sở hữu',
        dataIndex: 'owner',
        key: 'owner',
        width: 50,
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'address',
        key: 'address',
        width: 150,
      },
      {
        title: 'Tình trạng',
        dataIndex: 'type_sensor',
        key: '6',
        width: 80,
      },
      {
        title: 'Action',
        key: '7',
        width: 100,
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
      mainID: "station_id",
      mainInfo: {
        dataIndex: "title",
        title: "Trạm",
        width: 200,
      },
      detailEdit: [
        {
          title: 'Tên Trạm',
          width: 200,
          dataIndex: 'title',
        },
        {
          title: 'Địa chỉ MAC',
          width: 200,
          dataIndex: 'mac',
        },
        {
          title: 'Kinh độ',
          dataIndex: 'longitude',
          width: 200,
        },
        {
          title: 'Vĩ độ',
          dataIndex: 'latitude',
          width: 200,
        },
        {
          title: 'Chủ sở hữu',
          dataIndex: 'owner',
          width: 200,
        },
        {
          title: 'Địa chỉ',
          dataIndex: 'address',
          key: '5',
          width: 200,
        },
        {
          title: 'Tình trạng',
          dataIndex: 'type_sensor',
          width: 200,
        },
      ],
    };
  }

  getInformationToAdd() {
    return [
      {
        title: 'Tên Trạm',
        width: 200,
        dataIndex: 'title',
      },
      {
        title: 'Địa chỉ MAC',
        width: 200,
        dataIndex: 'mac',
      },
      {
        title: 'Kinh độ',
        dataIndex: 'longitude',
        width: 200,
      },
      {
        title: 'Vĩ độ',
        dataIndex: 'latitude',
        width: 200,
      },
      {
        title: 'Chủ sở hữu',
        dataIndex: 'owner',
        width: 200,
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'address',
        key: '5',
        width: 200,
      },
      {
        title: 'Tình trạng',
        dataIndex: 'type_sensor',
        width: 200,
      },
    ];
  }

  getHTMLToAdd() {
    return [
      TypeDialogueShow.EDIT_TEXT,
      TypeDialogueShow.EDIT_TEXT,
      TypeDialogueShow.EDIT_TEXT,
      TypeDialogueShow.EDIT_TEXT,
      TypeDialogueShow.EDIT_TEXT,
      TypeDialogueShow.EDIT_TEXT,
      TypeDialogueShow.SELECT_TYPE,
    ];
  }

  getTypeSelectTableToAdd() {
    return ["", "", "", "", "", "", "sensor_device_type"];
  }

  getColumnValidate() {

  }
  getInformationCheckDelete() {
    return {
      dataIndex: "station_id",
      delete_permission: TableManifest.ADMIN_STATION,
    };
  }
  getInformationCheckEdit() {
    return {
      dataIndex: "station_id",
      edit_permission: TableManifest.ADMIN_STATION,
    };
  }
  getInformationToValidate() {
    return [
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue],
    ];
  }
}

export default deviceSensor;