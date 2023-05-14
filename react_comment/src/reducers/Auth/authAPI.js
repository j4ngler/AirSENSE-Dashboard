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

  getAPIInformationCustomer() {
    const token = getLocalStorage('token_AirSENSE');
    return axiosRequest(this.apiEndpoint + 'auth/customer', axiosMethod.GET, token, null);
  }
  getAPIChangePassword({ old_pass, new_pass }) {
    return axiosRequest(
      this.loginApiEndpoint + '/password',
      axiosMethod.POST,
      { old_pass, new_pass }
    );
  }
  getAPIRegister({ email, password, full_name, phone, address }) {
    return axiosRequest(this.loginApiEndpoint + '/signup', axiosMethod.POST, null, {
      email,
      password,
      full_name,
      phone,
      address
    });
  }
  getAPIForgotPassword({ email }) {
    return axiosRequest(this.loginApiEndpoint + '/forgot-password', axiosMethod.POST, null, {
      email
    });
  }
  getAPIResetPassword({ token, password }) {
    return axiosRequest(this.loginApiEndpoint + '/set-password', axiosMethod.POST, null, {
      token,
      password
    });
  }
}

export default new AuthApi();
