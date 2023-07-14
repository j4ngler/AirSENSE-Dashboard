import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  ActionControl,
  TypeDialogueShow,
} from "../../utils/commonUtils";
import { TableManifest } from "../../configs/constants";
import { ruleValidates } from "../../configs/constants";
class pageContent {
  getColumnShow(callback) {
    const columns = [
      {
        dataIndex: "content_page_id",
        title: "ID bài báo",
        key: "content_page_id",
        width: 200,
        fixed: "left",
      },
      {
        dataIndex: "title",
        key: "title",
        title: "Tiêu đề",
        width: 200,
      },
      {
        dataIndex: "created_at",
        title: "Thời gian tạo",
        key: "created_at",
        width: 200,
      },
      {
        dataIndex: "updated_at",
        key: "updated_at",
        title: "Thời gian chỉnh sửa",
        width: 200,
      },
      {
        title: "Thao tác",
        dataIndex: "",
        width: 200,
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
        ),
      },
    ];

    return columns;
  }

  getInformationToEdit() {
    return {
      mainID: "content_page_id",
      mainInfo: {
        dataIndex: "title",
        title: "Chi tiết bài báo",
        width: 200,
      },
      detailEdit: [
        {
          dataIndex: "group_file",
          title: "group_file",
          width: 200,
        },
        {
          dataIndex: "file_save",
          title: "file_save",
          width: 200,
        },
        {
          dataIndex: "title",
          title: "Số title thoại",
          width: 200,
        },
        {
          dataIndex: "content",
          title: "content",
          width: 200,
        },
        {
          dataIndex: "content_img",
          title: "content_img",
          width: 200,
        },
        {
          dataIndex: "set_to_first",
          title: "set_to_first",
          width: 200,
        },
      ],
    };
  }

  getInformationToAdd() {
    return [
      {
        dataIndex: "content_img",
        title: "Ảnh bài báo",
        width: 200,
      },
      { dataIndex: "title", title: "Tiêu đề bài báo", width: 200 },
      {
        dataIndex: "content_sub_id",
        title: "Chuyên mục chi tiết",
        width: 200,
      },
      {
        dataIndex: "group_file",
        title: "File lưu ở server",
        width: 200,
      },
      {
        dataIndex: "description",
        title: "Miêu tả",
        width: 200,
      },
      {
        dataIndex: "set_to_first",
        title: "Đưa lên đầu trang",
        width: 200,
      },
      {
        dataIndex: "file_save",
        title: "Nội dung của bài báo",
        width: 200,
      },
    ];
  }

  getHTMLToAdd() {
    return [
      TypeDialogueShow.SELECT_IMAGE_UP_LOAD,
      TypeDialogueShow.EDIT_TEXT,
      TypeDialogueShow.SELECT_GROUP_CONTENT_SUB,
      TypeDialogueShow.EDIT_TEXT,
      TypeDialogueShow.EDIT_TEXT,
      TypeDialogueShow.SELECT_TOGGLE,
      TypeDialogueShow.EDIT_DOCUMENT,
    ];
  }
  getTypeSelectTableToAdd() {
    return ["", "", "content_group", "content_sub", "", "", "", ""];
  }
  getInformationCheckDelete() {
    return {
      dataIndex: "content_sub_id",
      delete_permission: TableManifest.DELETE_BLOG,
    };
  }
  getInformationToValidate() {
    return [
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue, ruleValidates.min6],
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue],
    ];
  }
}
export default pageContent;
