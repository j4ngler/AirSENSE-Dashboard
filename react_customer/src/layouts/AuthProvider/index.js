import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const authContext = React.createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token_AirSENSE");
    if (!token | !username) navigate("/login");
  }, [
    localStorage.getItem("token_AirSENSE"),
    localStorage.getItem("username"),
  ]);

  return <authContext.Provider value={{username}}>{children}</authContext.Provider>;
};

export default AuthProvider;
