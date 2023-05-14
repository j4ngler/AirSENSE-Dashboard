import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const authContext = React.createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const value = "comment"
  useEffect(() => {
    const token = localStorage.getItem('token_AirSENSE');
    const username = localStorage.getItem('username');
  if(!token | !username) navigate('/login')
  }, [localStorage.getItem('token_AirSENSE'), localStorage.getItem('username')])

  return (
    <authContext.Provider value={value}>
      {children}
    </authContext.Provider >
  );
};

export default AuthProvider;