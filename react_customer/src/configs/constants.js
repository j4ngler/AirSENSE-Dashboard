const CONSTANT = {
  SUCCESS_CODE: 200,
  CREATED_CODE: 201,
  DELETED_CODE: 202,
  SERVER_ERROR_CODE: 500,
  BAD_REQUEST_CODE: 400,
  NOT_FOUND_CODE: 404,
  NOT_AUTHEN_CODE: 401,
  NOT_AUTHOR_CODE: 403,
};

export const APP_USER_TYPE = {
  CUSTOMER: 1,
  SUB_CUSTOMER: 2,
  RESEARCHER: 3,
};

export const aqiToColor = (aqi) => {
  if (aqi <= 50) {
    return "#00e400";
  } else if (aqi <= 100) {
    return "#ffff00";
  } else if (aqi <= 150) {
    return "#ff7e00";
  } else if (aqi <= 200) {
    return "#ff0000";
  } else if (aqi <= 300) {
    return "#99004c";
  } else {
    return "#7e0023";
  }
};

export const URLMapping = {
  dashboard: {
    title: "Dashboard",
    url: "/dashboard",
  },
  newspaper: {
    title: "Bài báo",
    url: "/newspaper",
  },
  station: {
    title: "Quản lí trạm",
    url: "/manage_account",
  },
  data_station: {
    title: "Dữ liệu trạm",
    url: "/station/data_station",
  },
  list_station: {
    title: "Danh sách trạm",
    url: "/station/list_station",
  },
  user: {
    title: "Người dùng",
    url: "/station/user",
  },
  customer: {
    title: "Khách hàng",
    url: "/customer",
  },
  404: {
    title: "",
    url: "/customer/404",
  },
  account: {
    title: "Tài khoản",
    url: "/account",
  },
};

export const TableManifest = {
  MASTER: 1, // Quản trị cấp cao toan quyền sửa
  MANAGER: 2, // quản trị Trang, toàn quyền thêm sửa xóa trang web nhưng không thể  xóa liên quan nghiệp vụ kinh doanh
  SUPPORT: 3, //  kế toán, chỉ có thể xem và sửa liên quan nghieep vụ kinh doanh
  ACCOUNT: 4, //  kế toán, chỉ có thể xem và sửa liên quan nghieep vụ kinh doanh
  ADMIN: 10, // Quản trị trang có thể thêm sửa  trang web

  NEW_REGISTER: 11, //Ghi danh
  ADMIN_STATION: 21,
  GET_DATA_STATION: 22,
  SUPER_VIEW: 23,
  VIEW: 24,
  MANAGER_BLOG: 31,
  DELETE_BLOG: 32,
  EDIT_BLOG: 33,
  CREATE_BLOG: 34,
};
export const ruleValidates = {
  requiredValue: { required: true, message: "Trường này là bắt buộc" },
  min6: { min: 6, message: "Ít nhất phải nhập 6 ký tự" },
  notSpecialWord: {
    pattern: /^[a-zA-Z0-9]+$/,
    message: "Chỉ được nhập chữ và số",
  },
  requiredPhone: {
    pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
    message: "Vui lòng nhập đúng định dạng số điện thoại!",
  },
  requiredEmail: { type: "email", message: "Email không hợp lệ" },
};
