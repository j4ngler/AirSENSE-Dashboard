import { axiosMethod, axiosRequest } from '../../utils/handleApiRequest';
import { API_URL } from '../../configs/config';
import { getLocalStorage } from '../../utils/storageUltils';

class AuthApi {
  constructor() {
    this.apiEndpoint = API_URL;
    this.loginApiEndpoint = this.apiEndpoint + '/user';
  }
  getAPILogin({ email, password }) {
    return axiosRequest(this.apiEndpoint + 'auth/customer/login', axiosMethod.POST, null, {
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
