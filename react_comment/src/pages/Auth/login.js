import React from "react";
import LoginComponent from '../../component/LoginPage/login'
import { Helmet } from "react-helmet";
const LoginPage = () => {


    return (
        <>
        <Helmet>
        <title>Login | AirSENSE</title>
        </Helmet>
        <LoginComponent />
        
        </>
    )
}

export default LoginPage