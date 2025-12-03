import React from 'react';
import logo from './img/airsense.jpg';
import './header.css';
import ManagerData from '../../actions/ManagerData';
const Header = () => {
  const userName = ManagerData.saveInfoUser.name;

  return (
    <>
      <i class="bi bi-list toggle-sidebar-btn"></i>
      <header id="header" className="fixed-top">
        <div className="container d-flex align-items-center">
          <a href="" class="logo me-auto">
            <img src={logo} alt="" class="img-fluid" />
          </a>
          <nav id="navbar" className="navbar order-last order-lg-0">
            <ul>
              <li>
                <a className="nav-link scrollto active" href="/">
                  Trang chủ
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="">
                  Map
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="">
                  Đào tạo
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="">
                  Tin tức
                </a>
              </li>
              <li className="dropdown">
                <a href="#">
                  <span>Hỗ trợ</span> <i className="bi bi-chevron-down" />
                </a>
                <ul>
                  <li>
                    <a href="#">Drop Down 1</a>
                  </li>
                  <li className="dropdown">
                    <a href="#">
                      <span>Deep Drop Down</span>{' '}
                      <i className="bi bi-chevron-right" />
                    </a>
                    <ul>
                      <li>
                        <a href="#">Deep Drop Down 1</a>
                      </li>
                      <li>
                        <a href="#">Deep Drop Down 2</a>
                      </li>
                      <li>
                        <a href="#">Deep Drop Down 3</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#">Drop Down 2</a>
                  </li>
                </ul>
              </li>
              <li>
                <a className="nav-link scrollto" href="/api/auth/register">
                  Liên hệ
                </a>
              </li>
            </ul>
            <i className="bi bi-list mobile-nav-toggle" />
          </nav>
          <a id="managerAuthen" href="#" className="appointment-btn scrollto">
            <span className="d-none d-md-inline">{userName}</span>
          </a>
        </div>
      </header>
    </>
  );
};

export default Header;
