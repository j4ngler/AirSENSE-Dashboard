import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const authContext = React.createContext();

const AuthProvider = ({ children }) => {
  
  // let authenticate = useMemo(() => {
  // const token = localStorage.getItem('AirSENSE_token');
  // const username = localStorage.getItem('username');
  //   if(!!username && !!token) return false;
  //   return true;
  // }, [localStorage.getItem('AirSENSE_token'), localStorage.getItem('username')])

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token_AirSENSE');
    const username = localStorage.getItem('username');
    console.log(token, username);
  if(!token | !username) navigate('/login')
  }, [localStorage.getItem('token_AirSENSE'), localStorage.getItem('username')])


  // const login = ({username, password}) => {
  //   return new Promise((resolve, reject) => {
  //       login({ email: username, password: password })
  //         .then((value) => {
  //           console.log(value);
  //           localStorage.setItem('username', username);
  //           resolve(value);
  //         })
  //         .catch((err) => {
  //           console.log('err.... ', err.response.request.response);
  //           reject(err);
  //         });
  //     });
  // }

  // const logout = () => {
  //       localStorage.removeItem('username');
  //       return Promise.resolve();
  // }

  // const checkError = ({status}) => {
  //   if (status === 401 || status === 403) {
  //       localStorage.removeItem('username');
  //       return Promise.reject();
  //     }
  //     return Promise.resolve();
  // }

  // const checkAuth = () => {
  //   var username = localStorage.getItem('username');
  //   if (username != null) {
  //     return Promise.resolve(username);
  //   } else {
  //     return Promise.reject();
  //   }
  // }

  // const getPermissions = () => {

  // }



  return (
    <authContext.Provider>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;