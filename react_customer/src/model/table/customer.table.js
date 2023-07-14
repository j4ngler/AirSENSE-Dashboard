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
        title: "Số diện thoại",
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

  getInformationToEdit() {}

  getInformationToAdd() {}

  getHTMLToAdd() {}

  getTypeSelectToAdd() {}

  getColumnValidate() {}
}

export default user;
