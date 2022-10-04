import axios from 'axios';
import { API_URL, JWT_TOKEN } from '../config/config';
import {
  setLocalStorage,
  clearLocalStorage,
  getLocalStorage,
} from '../utils/storageUtil';


//  change information
export const  updateInfomation = (data) => {
    return new Promise((resolve, reject) => {
        axios
          .put(
            API_URL + 'auth/changeInfo',
            Object.assign(data),
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                authorization: 'Beard ' + getLocalStorage(JWT_TOKEN),
              },
            }
          )
          .then((response) => {
            alert(response.data);
            resolve(response);
          })
          .catch((error) => {
            checkErrorRetun(error);
            reject(error);
          });
      });
};



// change password

export const changePassword = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        API_URL + 'auth/changePassword',Object.assign(data),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: 'Beard ' + getLocalStorage(JWT_TOKEN),
          },
        }
      )
      .then((response) => {
        alert(response.data);
        resolve(response);
      })
      .catch((error) => {
        checkErrorRetun(error);
        reject(error);
      });
  });
}
