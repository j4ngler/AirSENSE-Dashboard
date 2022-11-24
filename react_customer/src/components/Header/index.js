import React from 'react';
import ringingIcon from '../../assets/icons/ringing.svg'
import refreshIcon from '../../assets/icons/refresh.svg'
import logo from '../../assets/images/logo/airsense.jpg'
import './header.css';
const Header = () => {
  return (
    <>
      <header className='header-customer'>
        <img src={logo} height={'45px'}/>
      <input type='text' placeholder='Tìm kiếm nội dung' className='customer-input-header'/>
      <span className='customer-button-header'>
      <img src={refreshIcon} />
      <img src={ringingIcon} />
      <img src={ringingIcon} />
      </span>
      
      </header>
    </>
  );
};

export default Header;
