import { notification } from 'antd';

  
export const typeNotify = {
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error'
}

export const openNotification = (type, message) => {
      notification[type]({
        message: type,
        description: message
      });
    };