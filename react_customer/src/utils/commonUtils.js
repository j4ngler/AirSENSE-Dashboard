// import Swal from 'sweetalert2';
// modal, notification, spin
import { JWT_TOKEN } from "../configs/config";
import { openNotification, typeNotify } from "./notification";

export const TableView = {
  MAIN_ID: 0,
  SYSTEM_EIDIT: 1,
  DATE_TIME_EIDIT: 2,
  ONLY_VIEW: 3,
  EDIT_DIRECTLY: 4,
  EIDIT_FROM: 5,
  EDIT_FROM_HTML: 6,
  STOP_EIDIT: 7,
  MAIN_ID_EDIT: 10,
  EIDIT_GET_ID_FROM_ANOTHER_TABLE: 11,
};

export const ActionControl = {
  NO_ACTION: 0,
  ACTION_ADD: 1,
  ACTION_UPDATE: 2,
  ACTION_DELETE: 3,
  ACTION_VIEW: 4,
  ACTION_REPORT: 5,
};

export const TypeDialogueShow = {
  NO_CHECK: 0,
  EDIT_TEXT: 1,
  EDIT_DOCUMENT: 2,
  SELECT_TYPE: 3,
  SELECT_TABLE: 4,
  SELECT_PERMISSION: 5,
  SELECT_GROUP_CONTENT_SUB: 6,
  SELECT_IMAGE_UP_LOAD: 7,
  SELECT_CUSTOMER_PERMISSION: 8,
  SELECT_TOGGLE:9,
};

export const LOADING = {
  SHOW: "SHOW_LOADING",
  HIDE: "HIDE_LOADING",
};

export const isNull = (value) => {
  return value === null;
};

export const isObject = (value) => {
  const type = typeof value;
  return value != null && (type === "object" || type === "function");
};

export const isEmpty = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

export const toUpper = (v, prev) => {
  if (v === prev) {
    return v;
  }
  return v && v.charAt(0).toUpperCase() + v.slice(1);
};

export const stringExplode = (str, delimiter) => {
  return str.split(delimiter);
};

export const convertStingToPascalCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const arrayCompare = (arr1, arr2) => {
  if (!arr1 || !arr2) return;
  let result;
  arr1.forEach((e1, i) =>
    arr2.forEach((e2) => {
      if (e1.length > 1 && e2.length) {
        result = arrayCompare(e1, e2);
      } else if (e1 !== e2) {
        result = false;
      } else {
        result = true;
      }
    })
  );
  return result;
};

export const stringCompare = (str1, str2) => {
  const string1 = !isEmpty(str1) ? str1.toString() : "";
  const string2 = !isEmpty(str2) ? str2.toString() : "";
  return string1 === string2;
};

export const objectCompare = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const isBase64 = (str, mimeRequired = true) => {
  if (str instanceof Boolean || typeof str === "boolean" || str === "") {
    return false;
  }
  let regex =
    "(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?";
  let mimeRegex = "(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)";
  if (mimeRequired === true) {
    regex = mimeRegex + regex;
  }
  return new RegExp("^" + regex + "$", "gi").test(str);
};

export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email === "") return false;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  const re = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  if (phone === "") return false;
  return re.test(phone);
};

export const isNumeric = (str) => {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};

export const validateDate = (timeDate) => {
  return timeDate instanceof Date && !isNaN(timeDate);
};

export const checkErrorReturn = (error) => {
  if (!!!error.response) {
    openNotification(typeNotify.WARNING, "Kết nối mạng có vấn đề");
  } else {
    if (401 === error.response.status || 403 === error.response.status) {
      // redirect to login page
      console.log("error ... error . ", error.response.request.response);
      localStorage.removeItem(JWT_TOKEN);
      openNotification(typeNotify.WARNING, "Bạn đã quá phiên đăng nhập");
      return;
    }
    if (404 === error.response.status) {
      openNotification(typeNotify.WARNING, "Không tìm thấy dữ liệu");

      // window.location.href='/customer/404';
      return;
    }
    if (500 === error.response.status) {
      openNotification(typeNotify.ERROR, "Có lỗi từ phía máy chủ hệ thống");
      return;
    }
    if (error.response.data.error === "No token provided") {
      openNotification(typeNotify.WARNING, "Bạn đã quá phiên đăng nhập");
      localStorage.removeItem(JWT_TOKEN);
      setTimeout(() => {
        window.location.href = "/customer/login";
      }, 6000);
      return;
    }
    console.log("error ... error . ", error.response);
    openNotification(typeNotify.ERROR, error.response);
  }
};
