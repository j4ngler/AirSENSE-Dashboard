import axios from 'axios';
import React, { forwardRef } from 'react';
import { API_URL, JWT_TOKEN ,HOST_HTTP_CHAT,HOST_HTTP_HISTORY_CHAT} from '../config/config';
import Swal from 'sweetalert2';
import {
  setLocalStorage,
  clearLocalStorage,
  getLocalStorage,
} from '../utils/storageUtil';

import {checkErrorRetun} from '../utils/commonUtil';
import ManagerData from '../actions/ManagerData.js';



function showLoadding(){
    Swal.fire({
        title: 'Xin vui lòng đợi '
    });
    Swal.showLoading();
}


function getHeader(){
  return  {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': getLocalStorage(JWT_TOKEN),
      authorization: 'Beard ' + getLocalStorage(JWT_TOKEN),
    },
  };
}


export const httpPostData = (url, data) => {
  showLoadding();
  return new Promise((resolve, reject) => {
    axios
      .post(url,data,getHeader())
      .then((response) => {
        Swal.close();
        resolve(response);
      })
      .catch((error) => {
        checkErrorRetun(error);
        reject(error);
      });
  });
};


export const registerNewAccount = (url, data) => {
  showLoadding();
  return new Promise((resolve, reject) => {
    axios
      .post(url,data,getHeader())
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        checkErrorRetun(error);
        reject(error);
      });
  });
};

export const httpGetData = (url) => {
  showLoadding();
  return new Promise((resolve, reject) => {
    axios.get(url,getHeader())
      .then((response) => {
        Swal.close();
        resolve(response);
      })
      .catch((error) => {
        checkErrorRetun(error);
        reject(error);
      });
  });
};


export const login = ({ email, password }) => {
  return new Promise((resolve, reject) =>  {
    axios.post(API_URL + 'auth/login_customer', { email, password })
      .then((response) => {
        setLocalStorage(JWT_TOKEN, response.data.token);
        resolve(response);
      })
      .catch((error) => {
        checkErrorRetun(error);
        reject(error);
        //logout();
      });
  });
}

export const logout = () => {
  return (dispatch) => {
    clearLocalStorage(JWT_TOKEN);
  //  dispatch(push('/tool/#/'));
    return false;
  };
}



export const getallInfoTable = (table,addInfo=null) => {
  var dataUpload= null;
  if(addInfo!=null) {
    addInfo["table"]=table;
    dataUpload=addInfo;
  }
  else  dataUpload={ table: table };
  return httpPostData(API_URL + 'users/report',dataUpload);
}

export const getNumberPageOnTable = (table,addInfo=null) => {
  var dataUpload= null;
  if(addInfo!=null) {
    addInfo["table"]=table;
    dataUpload=addInfo;
  }
  else  dataUpload={ table: table };
  return new Promise((resolve, reject) => {
    httpPostData(API_URL + 'users/report-page',dataUpload)
      .then((response) => {
          var numberPage=0;
          var detailInfo={numberPage:0,detailFillter:null};
          if(!!response.data.result[0][0]["COUNT(*)"]){
            numberPage= response.data.result[0][0]["COUNT(*)"];
          }
          detailInfo.numberPage = Math.round(numberPage/1000);
          detailInfo.detailFillter=response.data.dataFind
          resolve(detailInfo);
      })
      .catch((error) => {
          reject(error);
      });
  });
}

export const getCurUser = () => {
  return  httpGetData(API_URL + 'auth/info_customer');
}

export const addOneDataToTable = (table, data) => {
  return  httpPostData(API_URL + 'users/manager_add' ,Object.assign(data, { table: table }));
}

export const registerNewCustomer = (table, data) => {
  return  registerNewAccount(API_URL + 'customers/new_register' ,Object.assign(data, { table: table }));
}


export const registerInfoCustomer = async ( data) => {
  return await  httpPostData(API_URL + 'customers/register' ,data);
}

export const deleteOneDataToTable = async (table, data) => {
  return await httpPostData(API_URL + 'users/manager_delete' ,Object.assign(data, { table: table }));
}
export const updateOneDataInfoTable = (table, data) => {
  return httpPostData(API_URL + 'users/manager_update' ,Object.assign(data, { table: table }));
}


export const updatePagesToFist = (data) => {
  return  httpPostData(API_URL + 'users/fist_pages' ,data);
}

export const registerPageToWriter = ( data) => {
  return httpPostData(API_URL + 'document/registerPages' ,data);
}

export const updatePageToWriter = ( data) => {
  return  httpPostData(API_URL + 'document/updatePages' ,data);
}

export const registerPageToAdvertisement = ( data) => {
  return httpPostData(API_URL + 'document/registerAdvertisement' ,data);
}

export const updatePageToAdvertisement = ( data) => {
  return httpPostData(API_URL + 'document/updateAdvertisement' ,data);
}
export const uploadfileDataImageAdmin = (data) => {
  showLoadding();
  return new Promise((resolve, reject) => {
    axios.post(API_URL + 'customers/import-image-admin',Object.assign(data),getHeader())
      .then((response) => {
        Swal.close();
        resolve(response);
      })
      .catch((error) => {
        checkErrorRetun(error);
        reject(error);
      });
  });
};


export const uploadfileDataImage = async (data) => {
  showLoadding();
  try {
    let response = await fetch('/api/customers/import-image-customer', 
      {method: "POST", body: data}); 
      console.log('HTTP response code:',response.status); 
      const result = await response.json();
      Swal.close();
      console.log('HTTP response result.url:',result.url); 
      return  result.url;
  }
  catch(e) {
    Swal.close();
    return null;
  }    

};


export const sendMessageChat = async (data) => {
  return await httpPostData(HOST_HTTP_CHAT + 'chat',Object.assign(data));
}

export const getGeolocation = async () => {
  try
  {
    const res = await axios.get('https://geolocation-db.com/json/');
    return res.data.IPv4;
  }
  catch(ie){
    return "0.0.0.0";
  }        
}



export const getListFindChat = async ( data) => {
  return await httpPostData(HOST_HTTP_CHAT + 'find_chat' ,data);

}

export const getParentCommentId = (data) => {
  return httpPostData(HOST_HTTP_CHAT + 'find_parent_comment_id', data)
}


export const getInfoArticle = async (data) => {
  return await httpPostData(HOST_HTTP_CHAT + 'load_comment' ,data);
}

export const getInfoCustomerInfo = async (data) => {
  return await  httpPostData(API_URL + 'customers/info_chat',data);

}

export const  getListUserChat = ( data) => {
  return new Promise((resolve, reject) => {
    httpGetData(API_URL + 'users/list_user_comment')
    .then((result) => {
      for(var i=0;i<result.data.result.length;i++){
        result.data.result[i].name = result.data.result[i].fullname;
      }
      resolve(result.data.result);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

export const getChatWithFriend = ( data) => {
  return httpPostData(HOST_HTTP_CHAT + 'create_friend' ,data);
}

export const getHistoryRoutes = ( data) => {
  return httpPostData(HOST_HTTP_HISTORY_CHAT + 'content' ,data);
}
export const getInfoClientMqtt = ( data) => {
  return  httpGetData(HOST_HTTP_CHAT + 'info_mqtt');
}

export const uploadImageDataRegisterInfo = async ( data) => {
  try{
          let response = await fetch(API_URL+'customers/import-image-customer',{method: "POST", body: data}); 
          console.log('HTTP response code:',response.status); 
          const result = await response.json();
          console.log("uploadfileDataImage.....................",result.url); 
          return result.url;
  }
  catch(error){
    return null;
  }
}