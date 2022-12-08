import { API_URL, JWT_TOKEN } from "../../configs/config";
import { setLocalStorage, clearLocalStorage, getLocalStorage,} from "../../utils/storageUltils";
import { axiosRequest, axiosMethod } from "../../utils/handleApiRequest";


const showLoading = () => {
    // run spin
}


export const httpPostData = (url, data) => {
    const token = getLocalStorage(JWT_TOKEN);
    return Promise((resolve, reject) => {
        axiosRequest(url, axiosMethod.POST, token, data)
        .then((response) => {
            resolve(response)
        })
        .catch((error) => {
            // check error return: no data found
            reject(error)
        })
    })
}


export const httpGetData = (url, data) => {
    const token = getLocalStorage(JWT_TOKEN);
    return Promise((resolve, reject) => {
        axiosRequest(url, axiosMethod.GET, token, data)
        .then((response) => {
            resolve(response)
        })
        .catch((error) => {
            // check error return: no data found
            reject(error)
        })
    })
}

