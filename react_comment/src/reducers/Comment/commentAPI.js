import { axiosMethod, axiosRequest } from '../../utils/handleAPIRequest.js';
import { HOST_HTTP_COMMENT } from '../../config/config';
import { getLocalStorage } from '../../utils/storageUtils.js';


class CommentAPI {
    constructor() {
        this.apiEndPoint = HOST_HTTP_COMMENT;
    }
    postComment(dataComment) {
        const token = getLocalStorage('AirSENSE_token')
        return axiosRequest(this.apiEndPoint + '/comment/comment_user', axiosMethod.POST, token, dataComment);
    }
    getComment(){
        const token = getLocalStorage('AirSENSE_token')
        return axiosRequest(this.apiEndPoint + '/comment/comment_user',axiosMethod.GET,token)
    }
}


export default new CommentAPI();
