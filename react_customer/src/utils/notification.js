import { notification } from "antd";

export const typeNotify = {
  SUCCESS: "success",
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
};

export const openNotification = (type, message) => {
  console.log("type", type)
  console.log("message", message)
  notification.config({
    maxCount: 3,
  });
  notification[type]({
    message: type,
    description: message,
  });
};
