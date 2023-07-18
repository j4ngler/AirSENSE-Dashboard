import { ruleValidates } from "../../configs/constants";
import { TypeDialogueShow } from "../../utils/commonUtils";

class user {
  getColumnShow() {
    const columns = [
      {
        title: "Username",
        width: 60,
        dataIndex: "username",
        key: "username",
        fixed: "left",
      },
      {
        title: "Họ và tên",
        width: 60,
        dataIndex: "fullname",
        key: "fullname",
        fixed: "left",
      },
      {
        title: "Số điện thoại",
        width: 60,
        dataIndex: "phone_number",
        key: "phone_number",
        fixed: "left",
      },
      {
        title: "Email",
        width: 60,
        dataIndex: "email",
        key: "email",
        fixed: "left",
      },
      {
        title: "Địa chỉ",
        width: 60,
        dataIndex: "address",
        key: "address",
        fixed: "left",
      },
    ];

    return columns;
  }

  getInformationToEdit() {
    return {
      mainID: "customer_id",
      mainInfo: {
        dataIndex: "fullname",
        title: "Khách hàng",
        width: 200,
      },
      detailEdit: [
        {
          dataIndex: "username",
          title: "Username",
          width: 200,
        },
        {
          dataIndex: "fullname",
          title: "Họ và tên",
          width: 200,
        },
        {
          dataIndex: "phone_number",
          title: "Số điện thoại",
          width: 200,
        },
        {
          dataIndex: "email",
          title: "Email",
          width: 200,
        },
        {
          dataIndex: "address",
          title: "Địa chỉ",
          width: 200,
        },
        {
          dataIndex: "permission",
          title: "Quyền",
          width: 200,
        },
      ],
    };
  }

  getInformationToAdd() {
    return [
      {
        dataIndex: "username",
        title: "Username",
        width: 200,
      },
      {
        dataIndex: "fullname",
        title: "Họ và tên",
        width: 200,
      },
      {
        dataIndex: "phone_number",
        title: "Số điện thoại",
        width: 200,
      },
      {
        dataIndex: "email",
        title: "Email",
        width: 200,
      },
      {
        dataIndex: "address",
        title: "Địa chỉ",
        width: 200,
      },
      {
        dataIndex: "contact",
        title: "Liên hệ",
        width: 200,
      },
      {
        dataIndex: "permission",
        title: "Quyền",
        width: 200,
      }
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
      TypeDialogueShow.SELECT_GROUP_PERMISSION,
    ];
  }
  getTypeSelectTableToAdd() {
    return ["", "", "", "", "", "", ""];
  }
  getInformationCheckDelete() {
  }
  getInformationCheckEdit() {
  }
  getInformationToValidate() {
    return [
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue, ruleValidates.requiredPhone],
      [ruleValidates.requiredValue, ruleValidates.requiredEmail],
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue],
      [ruleValidates.requiredValue,ruleValidates.notFalse],
    ];
  }
  getColumnToSearch() {
    return ["fullname"]
  }
}

export default user;
