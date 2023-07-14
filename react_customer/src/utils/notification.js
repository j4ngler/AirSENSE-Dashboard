import { notification } from "antd";

export const typeNotify = {
  SUCCESS: "Success",
  INFO: "Info",
  WARNING: "Warning",
  ERROR: "Error",
};

export const openNotification = (type, message) => {
  notification.config({
    maxCount: 3,
  });
  notification[type]({
    message: type,
    description: message,
  });
};
