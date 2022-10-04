// in src/LoginPage.js
import React, { useState } from 'react';
import { useLogin } from 'react-admin';
import { Register } from '../../api/httpBaseUtil';
import decor from './img/DecorLogin.png';
import './authen.css';
const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const submit = (e) => {
    e.preventDefault();
    // gather your data/credentials here
    const credentials = {
      username: userName,
      password: password,
    };
    // Dispatch the userLogin action (injected by connect)
    login(credentials);
  };

  return (
    <div>
      <div className="login-container">
        <div className="grid wide">
          <div className="center row">
            <div className="col l-6 m-6 c-12">
              <div>
                <img
                  src="https://bootstrapious.com/i/snippets/sn-registeration/illustration.svg"
                  alt="login-img"
                  className="login-img hide-on-mobile"
                />
                <h1 className="login-heading">Đăng nhập</h1>
                <p className="login-description">
                  Chào mừng bạn đến với hệ thống Airsense
                </p>
              </div>
            </div>
            <div className="col l-6 m-6 c-12">
              <form action className="login-form">
                <div className="row sm-gutter">
                  <div className="col l-12 m-12 c-12">
                    <div className="login-group">
                      <div>
                        <i className="login-icon fad fa-envelope" />
                      </div>
                      <input
                        type="email"
                        className="login-input"
                        placeholder="Email"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col l-12 m-12 c-12">
                    <div className="login-group">
                      <div>
                        <i className="login-icon fad fa-lock" />
                      </div>
                      <input
                        type="password"
                        className="login-input login-input-password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="show-hide-password">
                        <i className="far fa-eye-slash" />
                      </div>
                    </div>
                  </div>
                  <div className="col l-12 m-12 c-12">
                    <div className="forget-password">
                      <a
                        href="http://127.0.0.1:3000/api/auth/resetPassword"
                        className="forget-password-link"
                      >
                        Quên mật khẩu?
                      </a>
                    </div>
                  </div>
                  <div className="col l-12 m-12 c-12">
                    <div>
                      <div
                        className="login-btn login-btn-primary"
                        onClick={submit}
                      >
                        <span>Đăng nhập</span>
                      </div>
                    </div>
                  </div>
                  <div className="col l-12 m-12 c-12">
                    <div className="login-divider-section">
                      <div className="login-divider-line" />
                      <span className="login-divider-text">HOẶC</span>
                      <div className="login-divider-line" />
                    </div>
                  </div>
                  <div className="col l-12 m-12 c-12">
                    <div className="login-btn login-btn-facebook">
                      <i className="fab fa-facebook-f" />
                      <span>Đăng nhập với Facebook</span>
                    </div>
                  </div>
                  <div className="col l-12 m-12 c-12">
                    <div className="login-btn login-btn-google">
                      <svg
                        viewBox="0 0 24 24"
                        width={20}
                        height={20}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                          <path
                            fill="#4285F4"
                            d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                          />
                          <path
                            fill="#34A853"
                            d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                          />
                          <path
                            fill="#EA4335"
                            d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                          />
                        </g>
                      </svg>
                      <span>Đăng nhập với Google</span>
                    </div>
                  </div>
                  <div className="col l-12 m-12 c-12">
                    <div className="login-question">
                      <span>Bạn chưa có tài khoản?</span>
                      <a href="http://127.0.0.1:3000/api/auth/register">
                        Đăng ký ngay
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
