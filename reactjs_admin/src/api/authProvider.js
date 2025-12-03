import { login } from './httpBaseUtil.js';

export default {
  // called when the user attempts to log in
  login: ({ username, password }) => {
    return new Promise((resolve, reject) => {
      login({ email: username, password: password })
        .then((value) => {
          console.log(value);
          localStorage.setItem('username', username);
          // localStorage.setItem('token_AirSENSE', token)
          resolve(value);
        })
        .catch((err) => {

          console.log('err....', err.response.request.response);
          reject(err);
        });
    });
    //  return Promise.resolve();
  },
  // called when the user clicks on the logout button
  logout: () => {
    localStorage.removeItem('username');
    return Promise.resolve();
  },
  // called when the API returns an error
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('username');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    var username = localStorage.getItem('username');
    if (username != null) {
      return Promise.resolve(username);
    } else {
      return Promise.reject();
    }
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => Promise.resolve(),
};
