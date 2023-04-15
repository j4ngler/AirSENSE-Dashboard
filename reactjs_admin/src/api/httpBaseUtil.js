import axios from 'axios';
import { useLogout } from 'react-admin';
import React, { forwardRef } from 'react';
import { API_URL, JWT_TOKEN } from '../config/config';
import Swal from 'sweetalert2';
import {
  setLocalStorage,
  clearLocalStorage,
  getLocalStorage,
} from '../utils/storageUtil';

import { checkErrorRetun } from '../utils/commonUtil';

function showLoadding() {
  Swal.fire({
    title: 'Xin vui lòng đợi ',
  });
  Swal.showLoading();
}

export const httpPostData = (url, data) => {
  showLoadding();
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getLocalStorage(JWT_TOKEN),
          authorization: 'Beard ' + getLocalStorage(JWT_TOKEN),
        },
      })
      .then((response) => {
        Swal.close();
        resolve(response);
      })
      .catch((error) => {
        checkErrorRetun(error);
        reject(error);
      });
  });
};

export const httpGetData = (url) => {
  showLoadding();
  var headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-XSRF-TOKEN': getLocalStorage(JWT_TOKEN),
    authorization: 'Beard ' + getLocalStorage(JWT_TOKEN),
  };
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: headers,
      })
      .then((response) => {
        Swal.close();
        resolve(response);
      })
      .catch((error) => {
        checkErrorRetun(error);
        reject(error);
      });
  });
};

export const login = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    axios
      .post(API_URL + 'auth/login', { email, password })
      .then((response) => {
        setLocalStorage(JWT_TOKEN, response.data.token);
        resolve(response);
      })
      .catch((error) => {
        checkErrorRetun(error);
        reject(error);
        //logout();
      });
  });
};

export const logout = () => {
  return (dispatch) => {
    clearLocalStorage(JWT_TOKEN);
    dispatch(push('/tool/#/'));
    return false;
  };
};

export const getallInfoTable = (table, addInfo = null) => {
  var dataUpload = null;
  if (addInfo != null) {
    addInfo['table'] = table;
    dataUpload = addInfo;
  } else dataUpload = { table: table };
  return httpPostData(API_URL + 'users/report', dataUpload);
};
export const getChangeLog = (table, addInfo = null) => {
  var dataUpload = null;
  if (addInfo != null) {
    addInfo['table'] = table;
    dataUpload = addInfo;
  } else dataUpload = { table: table };
  return httpPostData(API_URL + 'users/getChangeLog', dataUpload);
};

export const getNumberPageOnTable = (table, addInfo = null) => {
  var dataUpload = null;
  if (addInfo != null) {
    addInfo['table'] = table;
    dataUpload = addInfo;
  } else dataUpload = { table: table };
  return new Promise((resolve, reject) => {
    httpPostData(API_URL + 'users/report-page', dataUpload)
      .then((response) => {
        var numberPage = 0;
        var detailInfo = { numberPage: 0, detailFillter: null };
        if (!!response.data.result[0][0]['COUNT(*)']) {
          numberPage = response.data.result[0][0]['COUNT(*)'];
        }
        detailInfo.numberPage = Math.round(numberPage / 1000);
        detailInfo.detailFillter = response.data.dataFind;
        resolve(detailInfo);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getCurUser = () => {
  return httpGetData(API_URL + 'auth/user');
};

export const Register = () => {};

export const addOneDataToTable = (table, data) => {
  return httpPostData(
    API_URL + 'users/manager_add',
    Object.assign(data, { table: table })
  );
};

export const deleteOneDataToTable = (table, data) => {
  console.log('datadelete', data);
  return httpPostData(
    API_URL + 'users/manager_delete',
    Object.assign(data, { table: table })
  );
};

export const updateOneDataInfoTable = (table, data) => {
  return httpPostData(
    API_URL + 'users/manager_update',
    Object.assign(data, { table: table })
  );
};

export const updatePagesToFist = (data) => {
  return httpPostData(API_URL + 'users/fist_pages', data);
};

export const updateCourseToFist = (data) => {
  return httpPostData(API_URL + 'users/fist_course', data);
};

export const registerPageToWriter = (data) => {
  return httpPostData(API_URL + 'document/registerPages', data);
};
export const registerProductPageToWriter = (data) => {
  return httpPostData(API_URL + 'document/registerProductPages', data);
};
export const updateProductPageToWriter = (data) => {
  return httpPostData(API_URL + 'document/updateProductPages', data);
};
export const updatePageToWriter = (data) => {
  return httpPostData(API_URL + 'document/updatePages', data);
};

export const registerCourseToWriter = (data) => {
  return httpPostData(API_URL + 'document/registerCourse', data);
};

export const updateCourseToWriter = (data) => {
  return httpPostData(API_URL + 'document/updateCourse', data);
};

export const registerExamToWriter = (data) => {
  return httpPostData(API_URL + 'document/registerExam', data);
};

export const updateExamToWriter = (data) => {
  return httpPostData(API_URL + 'document/updateExam', data);
};

export const registerPageToAdvertisement = (data) => {
  return httpPostData(API_URL + 'document/registerAdvertisement', data);
};

export const updatePageToAdvertisement = (data) => {
  return httpPostData(API_URL + 'document/updateAdvertisement', data);
};

export const uploadfileDataImage = (data) => {
  showLoadding();
  console.log('Dataimg', data);
  return new Promise((resolve, reject) => {
    axios
      .post(API_URL + 'customers/import-image', Object.assign(data), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getLocalStorage(JWT_TOKEN),
          authorization: 'Beard ' + getLocalStorage(JWT_TOKEN),
        },
      })
      .then((response) => {
        Swal.close();
        resolve(response);
      })
      .catch((error) => {
        checkErrorRetun(error);
        reject(error);
      });
  });
};

export const uploadImgUser = (data) => {
  showLoadding();
  return new Promise((resolve, reject) => {
    axios
      .post(API_URL + 'customers/image-user', Object.assign(data), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getLocalStorage(JWT_TOKEN),
          authorization: 'Beard ' + getLocalStorage(JWT_TOKEN),
        },
      })
      .then((response) => {
        Swal.close();
        resolve(response);
      })
      .catch((error) => {
        checkErrorRetun(error);
        reject(error);
      });
  });
};
