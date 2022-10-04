import React, { useState, useEffect } from 'react';
import ManagerData from '../../actions/ManagerData.js'
import { updateInfomation, changePassword } from '../../api/authen.js';
import ProfileImage from '../../compoment/form/ProfileImage.js';
const InfoAccount = () => {
  // change information user
    useEffect(() => {
    ManagerData.getInfoUser();
    }, [])
    const user = ManagerData.saveInfoUser;
    console.log(user);
    const [changePasswordBlock, setChangePasswordBlock] = useState(0);
    const [name, setName] = useState(user.name);
    const [fullname, setFullname] = useState(user.fullname);
    const [phone, setPhone] = useState(user.phoneNumber);
    const [contact, setContact] = useState(user.contact);
    const [imgUser, setImgUser] = useState(user.avartar);


    const updateInfo = (e) => {
      e.preventDefault();
      const data = {
        table: 'users',
        userid: user.userid,
        name: name,
        fullname: fullname,
        phone: phone,
        contact: contact, 
        avartar: imgUser,
      };
      console.log(data);
      updateInfomation(data);
    }

    

    // change password
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [checkPass, setCheckPass] = useState('');

    const ChangePassword = (e) => {
      e.preventDefault();
      const data = {
        table: 'users',
        userid: user.userid,
        oldPassword: oldPass,
        newPassword: newPass
      }
      console.log(data);
      changePassword(data);
    }

    return (
        <div className='new-user-data'>
        <div className="account-info">  
      <h2 className='account-info-title'>Thông tin cá nhân</h2>
    <form className='account-info-user' onSubmit={e => updateInfo(e)}>
      <div className='account-form-divide'>
      <div className='account-form-item-half'>
      <label className='account-label'>Tên người dùng</label>
      <input className='account-field' type="text" placeholder value={name} onChange={(e) =>setName(e.target.value)} />
      </div>
      <div className='account-form-item-half'>
      <label className='account-label'>Họ và tên</label>
      <input className='account-field' type="text" placeholder value={fullname} onChange={(e) => setFullname(e.target.value)} />
      </div>
      <div className='account-form-item-half'>
      <label className='account-label'>Email</label>
      <input className='account-field' type="text" placeholder value={user.email} readOnly />
      </div>
      <div className='account-form-item-half'>
      <label className='account-label'>Số điện thoại</label>
      <input className='account-field' type="text" placeholder value={phone} onChange={(e) => setPhone(e.target.value) } />
      </div>
      </div>
      <label className='account-label'>Địa chỉ</label>
      <input className='account-field' type="text" placeholder value={contact} onChange={(e) => setContact(e.target.value) }/>
      <label className='account-label'>Vai trò</label>
      <input className='account-field' type="text" placeholder value={'Quản trị viên'} readOnly />
      
      <div className="account-image">
        {/* {!!imgUser? (
    <ProfileImage
    urlImage={imgUser}
    uploadfileDataLink={(url) => setImgUser(url)}
    />
        ):(
    <img className='account-none-img' src='https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg' />

        )} */}
        <ProfileImage
    urlImage={imgUser}
    uploadfileDataLink={(url) => setImgUser(url)}
    />
  </div>
  <div className="account-button">
      <button type='submit' className="account-button-item">Lưu thay đổi</button>
    </div>

    </form>
    <p className='displayChangePass' onClick={()=>setChangePasswordBlock(1)}>Thay đổi mật khẩu</p>

  </div>
  {changePasswordBlock === 1 ? (
    <div id='changePasswordBlock'>
    <form className='change-password' onSubmit= {e => ChangePassword(e)}>
    <label className='account-label'>Mật khẩu hiện tại</label> 
    <input type='password' className='account-field' value={oldPass} onChange={(e) => setOldPass(e.target.value) }/>
    <label className='account-label'>Mật khẩu mới</label> 
    <input type='password' className='account-field' value={newPass} onChange={(e) => setNewPass(e.target.value) }/>
    <label className='account-label'>Nhập lại mật khẩu mới</label> 
    <input type='password' className='account-field' value={checkPass} onChange={(e) => setCheckPass(e.target.value) }/>
    <div className="account-button">
    <button className="account-button-cancel" onClick={()=>setChangePasswordBlock(0)}>Hủy</button>
    <button type='submit' className="account-button-item">Thay đổi mật khẩu</button>
  </div>
      </form>
    
    </div>
  ):''}
  
        </div>
    )
}
export default InfoAccount;