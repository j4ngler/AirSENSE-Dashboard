import { axiosMethod, axiosRequest } from '../../utils/handleAPIRequest.js';
import { HOST_HTTP_COMMENT } from '../../config/config';
import { getLocalStorage } from '../../utils/storageUtils.js';


class CommentAPI {
    constructor() {
        this.apiEndPoint = HOST_HTTP_COMMENT;
    }
    send(data) {
        const token = getLocalStorage('token_AirSENSE')

        return axiosRequest(this.apiEndPoint + '/comment/send', axiosMethod.POST, token, data);
    }
    getAll(){
        const token = getLocalStorage('token_AirSENSE')
        return axiosRequest(this.apiEndPoint + '/comment/',axiosMethod.GET,token)
    }
    getBytopic(topic){
        const token = getLocalStorage('token_AirSENSE')
        return axiosRequest(this.apiEndPoint + '/comment/get-by-topic',axiosMethod.GET,token, topic)
    }
    delete(id){
        const token = getLocalStorage('token_AirSENSE')
        return axiosRequest(this.apiEndPoint + '/comment/delete',axiosMethod.DELETE ,token, id)
    }
    getListUsers(){
        const token = getLocalStorage('token_AirSENSE')
        return axiosRequest(this.apiEndPoint + '/auth/list-users',axiosMethod.GET,token)
    }
}


export default new CommentAPI();
