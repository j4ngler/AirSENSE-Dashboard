import { axiosMethod, axiosRequest } from '../../utils/handleAPIRequest.js';
import { API_URL } from '../../config/config.js';
import { getLocalStorage } from '../../utils/storageUtils';


class AuthApi {
  constructor() {
    this.apiEndpoint = API_URL;
    this.loginApiEndpoint = this.apiEndpoint + '/user';
  }
  getAPILogin({ email, password, role }) {
    const apiLogin = role === "admin" ? "auth/login" : "auth/login/customer"
    return axiosRequest(this.apiEndpoint + apiLogin, axiosMethod.POST, null, {
      email,
      password
    });
  }
  getAPIInformationCustomer(role) {
    const apiLogin = role === "admin" ? "auth/user" : "auth/customer"
    const token = getLocalStorage('token_AirSENSE');
    return axiosRequest(this.apiEndpoint + apiLogin, axiosMethod.GET, token, null);
  }
  
}

export default new AuthApi();






