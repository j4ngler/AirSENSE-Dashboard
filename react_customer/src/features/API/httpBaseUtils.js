import { API_URL, JWT_TOKEN } from "../../configs/config";
import { getLocalStorage } from "../../utils/storageUltils";
import { axiosRequest, axiosMethod } from "../../utils/handleApiRequest";
import { checkErrorReturn } from "../../utils/commonUtils";
import { SpinLoading } from "../../components/Spin/SpinLoading";
import axios from "axios";
import "../../configs/config.js";
export const showLoading = () => {
  <SpinLoading />;
};
export const httpPostData = (url, data, permissionValue) => {
  const token = getLocalStorage(JWT_TOKEN);
  return new Promise((resolve, reject) => {
    axiosRequest(url, axiosMethod.POST, token, data, permissionValue)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        // console.log('error post data', error);
        checkErrorReturn(error);
        reject(error);
      });
  });
};

export const httpGetData = (url, data) => {
  const token = getLocalStorage(JWT_TOKEN);
  return new Promise((resolve, reject) => {
    axiosRequest(url, axiosMethod.GET, token, data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        // console.log('error get data', error)
        checkErrorReturn(error);
        reject(error);
      });
  });
};

export const uploadFileDataImage = (data, permissionValue) => {
  return new Promise((resolve, reject) => {
    axios
      .post(API_URL + "customers/import-image", Object.assign(data), {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "X-XSRF-TOKEN": getLocalStorage(JWT_TOKEN),
          authorization: "Beard " + getLocalStorage(JWT_TOKEN),
          "X-Authorized-Permission": permissionValue,
        },
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const registerPageToWriter = (data) => {
  return httpPostData(API_URL + "document/registerPages", data);
};

//table
export const httpGetDataTable = async (table, filter = null) => {
  return new Promise((resolve, reject) => {
    let dataUpload = null;
    if (!!filter) {
      filter["table"] = table;
      dataUpload = filter;
    } else {
      dataUpload = { table: table };
    }
    return httpPostData(API_URL + "customers/report", dataUpload)
      .then((result) => {
        let data = result.data;
        if (data?.result[0]?.id !== undefined)
          for (let i = 0; i < data.result.length; i++) data.result[i].idf = i;
        else for (let i = 0; i < data.result.length; i++) data.result[i].id = i;
        // check filter is right?
        // ManagerData.checkTableInfoUpdate(tableName,data.result);
        resolve(data.result);
      })
      .catch((error) => {
        checkErrorReturn(error);
        reject(error);
      });
  });
};
export const deleteOneTable = (table, data, permissionValue) => {
  console.log("dataDelete", data);
  return httpPostData(
    API_URL + "customers/manager_delete",
    Object.assign(data, { table: table }),
    permissionValue
  );
};
