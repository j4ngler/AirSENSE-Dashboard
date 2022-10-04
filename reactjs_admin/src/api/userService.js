import axios from 'axios';
import { API_URL, JWT_TOKEN } from '../config/config';
import Swal from 'sweetalert2';
import {
  setLocalStorage,
  clearLocalStorage,
  getLocalStorage,
} from '../utils/storageUtil';
import {checkErrorRetun} from '../utils/commonUtil';


export const sendMessageToAnothenMobile = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        API_URL + 'customers/send_message',Object.assign(data),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getLocalStorage(JWT_TOKEN),
            authorization: 'Beard ' + getLocalStorage(JWT_TOKEN),
          },
        }
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        checkErrorRetun(error);
        reject(error);
      });
  });
}

export const uploadfileDataExel = (data) => {
  console.log("uploadfileDataExel.........");

  return new Promise((resolve, reject) => {
   /* var xhr = new XMLHttpRequest();
    xhr.onreadystatechange=()=>{
      if(xhr.readyState==4 && xhr.status==200){
        store.dispatch({ type: LOADING.HIDE });
        resolve(xhr.response);
      }
      else
      {
        reject(xhr.response);
      }

    }
    xhr.open("POST", API_URL + 'customers/import-data');
    xhr.setRequestHeader('Accept','application/json');
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization', 'Beard ' + getLocalStorage(JWT_TOKEN));
    xhr.send(data);
  });*/

    axios
      .post(
        API_URL + 'customers/import-data',Object.assign(data),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getLocalStorage(JWT_TOKEN),
            authorization: 'Beard ' + getLocalStorage(JWT_TOKEN),
          },
        }
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        checkErrorRetun(error);
        reject(error);
      });
  });
};

export const uploadfileDataImage = (data) => {
  console.log("uploadfileDataExel.........");
  return new Promise((resolve, reject) => {
    axios
      .post(
        API_URL + 'customers/import-image',Object.assign(data),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getLocalStorage(JWT_TOKEN),
            authorization: 'Beard ' + getLocalStorage(JWT_TOKEN),
          },
        }
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        checkErrorRetun(error);
        reject(error);
      });
  });
};


