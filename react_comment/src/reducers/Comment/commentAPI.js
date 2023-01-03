import { axiosMethod, axiosRequest } from '../../utils/handleAPIRequest.js';
import { HOST_HTTP_COMMENT } from '../../config/config';
import { getLocalStorage } from '../../utils/storageUtils.js';


class CommentAPI {
    constructor() {
        this.apiEndPoint = HOST_HTTP_COMMENT;
    }
    postComment({content}) {
        const token = getLocalStorage('AirSENSE_token')
        return axiosRequest(this.apiEndPoint, axiosMethod.POST, token, {content});
    }
}


export default new CommentAPI();
