import { API_URL, JWT_TOKEN } from "../../configs/config";
import { setLocalStorage, clearLocalStorage, getLocalStorage,} from "../../utils/storageUltils";
import { axiosRequest, axiosMethod } from "../../utils/handleApiRequest";
import { checkErrorReturn } from "../../utils/commonUtils";
import { SpinLoading } from "../../components/Spin/SpinLoading";


export const showLoading = () => {
    <SpinLoading size={'medium'} />
}


export const httpPostData = (url, data) => {
    const token = getLocalStorage(JWT_TOKEN);
    return new Promise((resolve, reject) => {
        axiosRequest(url, axiosMethod.POST, token, data)
        .then((response) => {
            showLoading();
            resolve(response)
        })
        .catch((error) => {
            showLoading();
            // console.log('error post data', error);
            checkErrorReturn(error);
            reject(error)
        })
    })
}


export const httpGetData = (url, data) => {
    const token = getLocalStorage(JWT_TOKEN);
    return Promise((resolve, reject) => {
        axiosRequest(url, axiosMethod.GET, token, data)
        .then((response) => {
            showLoading();
            resolve(response)
        })
        .catch((error) => {
            // console.log('error get data', error)
            showLoading();
            checkErrorReturn(error);
            reject(error)
        })
    })
}

export const httpGetDataTable = async (table, filter = null) => {
    return new Promise((resolve, reject) => {
        let dataUpload = null;
        if(!!filter) {
            filter['table'] = table;
            dataUpload = filter;
        }
        else {
            dataUpload = {table: table};
        }
        return httpPostData(API_URL + 'customers/report', dataUpload)
        .then((result) => {
            let data = result.data;
            if(data.result[0].id !== undefined)
            for (let i = 0; i < data.result.length; i++) data.result[i].idf = i;
            else 
            for (let i = 0; i < data.result.length; i++) data.result[i].id = i;
            // check filter is right?
            // ManagerData.checkTableInfoUpdate(tableName,data.result);
            resolve(data.result);
          })
          .catch((error) => {
            checkErrorReturn(error);
            reject(error)
        });
        });
}

export const uploadFileDataImage = (data) => {
    return new Promise((resolve, reject) => {
        return httpPostData(API_URL + 'customers/upload-image', data)
        .then((result) => {
            resolve(result.result);
          })
          .catch((error) => {
            reject(error)
        });
        });
}

