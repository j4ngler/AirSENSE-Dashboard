import { SwapLeftOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../features/Authen/AuthSlice";
import Swal from 'sweetalert2'

import "./login.css";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let username_gs = useSelector((state) => state.authSlice.username);
  const dispatch = useDispatch();
  const handleLoginClick = (e) => {
    e.preventDefault();
    const values = {
      email: email,
      password: password,
    };
    dispatch(login(values));
    // if (username_gs == null) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Sai rồi!',
    //   })
    // }
  };
  // console.log(username_gs);
  
  const navigate = useNavigate();
  useEffect(() => {
    if (!!username_gs) {
      navigate("/customer/dashboard");
    }
  }, [username_gs]);

  return (
    <div className="customer-login">
      <div className="customer-login-container" id="container">
        <div className="customer-login-form-container customer-login-sign-up-container">
          <form action="#">
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="customer-login-social">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" className="customer-login-social">
                <i className="fab fa-google-plus-g" />
              </a>
              <a href="#" className="customer-login-social">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button>Sign Up</button>
          </form>
        </div>
        <div className="customer-login-form-container customer-login-sign-in-container">
          <form action="#">
            <h1>Sign in</h1>
            <div className="customer-login-social-container">
              <a href="#" className="customerlogin-social">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" className="customer-login-social">
                <i className="fab fa-google-plus-g" />
              </a>
              <a href="#" className="customer-login-social">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
            <span>or use your account</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Link to="/auth/reset_password">Forgot your password?</Link>
            <button onClick={(e) => handleLoginClick(e)}>Sign In</button>
          </form>
        </div>
        <div className="customer-login-overlay-container">
          <div className="customer-login-overlay">
            <div className="customer-login-overlay-panel customer-login-overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button className="customer-login-ghost" id="signIn">
                Sign In
              </button>
            </div>
            <div className="customer-login-overlay-panel customer-login-overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className="customer-login-ghost"
                id="customer-login-signUp"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
