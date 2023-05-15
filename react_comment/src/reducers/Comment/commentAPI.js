import { axiosMethod, axiosRequest } from '../../utils/handleAPIRequest.js';
import { HOST_HTTP_COMMENT } from '../../config/config';
import { getLocalStorage } from '../../utils/storageUtils.js';


class CommentAPI {
    constructor() {
        this.apiEndPoint = HOST_HTTP_COMMENT;
    }
    send(topic, comment) {
        const token = getLocalStorage('token_AirSENSE')

        return axiosRequest(this.apiEndPoint + '/comment/send', axiosMethod.POST, token, {topic,comment});
    }
    getAll(){
        const token = getLocalStorage('token_AirSENSE')
        return axiosRequest(this.apiEndPoint + '/comment/',axiosMethod.GET,token)
    }
    getBytopic({topic}){
        const token = getLocalStorage('token_AirSENSE')
        console.log("token: ",token);
        return axiosRequest(this.apiEndPoint + '/comment/get-by-topic',axiosMethod.GET,token, {topic})
    }
    delete(id){
        const token = getLocalStorage('token_AirSENSE')
        return axiosRequest(this.apiEndPoint + '/comment/delete',axiosMethod.DELETE ,token, {id})
    }

}


export default new CommentAPI();
