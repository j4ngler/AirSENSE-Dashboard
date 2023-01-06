import Swal from 'sweetalert2';
import React, { useState,} from 'react';
// import {Button} from '@material-ui/core';
// import { uploadImageDataRegisterInfo ,registerInfoCustomer} from '../../api/httpBaseUtil.js';
// import PublishIcon from '@material-ui/icons/Publish';
import withReactContent from "sweetalert2-react-content";
import { loginUser } from '../../api/authen';

const MySwal = withReactContent(Swal)


const RegisterUser = ({summitData,onclose}) => {
    // state for register
    const [res_username, setResUsername] = useState("");
    const [res_fullname, setResFullname] = useState("");
    const [res_Email, setResEmail] = useState("");
    const [res_Password, setResPassword] = useState("");
    const [res_phone, setResPhone] = useState("");
    const [res_avatar, setResAvatar] = useState("");
    const [res_address, setResAddress] = useState("");
    const [res_note, setResNote] = useState("");

    const uploadImageData=(event)=>{
        event.preventDefault();
        const data = new FormData() 
        data.append('file', event.target.files[0]);    
        uploadImageDataRegisterInfo(data).then((response)=>{
            setResAvatar(response);
        });
    }

    const summitDataInfo= async ()=>{
        try{
            var infoValue= {username:res_username,fullname:res_fullname,
                email:res_Email,password:res_Password,
                phone:res_phone,avatar:res_avatar,
                address:res_address,note:res_note};
                var info= await registerInfoCustomer(infoValue);
                var infoLogin={email:infoValue.email,password:infoValue.password};
                var response= await    loginUser(infoLogin);
                localStorage.setItem('customer', response["email"]);
                localStorage.setItem('token', response.token);
                summitData(true);
        }
        catch(error){
            Swal.showValidationMessage(
              `Request failed: ${error}`
            );
            summitData(false);
        }
    }
    
    return (
        <div>
            <div className="input-register">Đăng ký người dùng </div>
            <div className="input-register"> <input placeholder="Tên tài khoản" type="text" value={res_username} onChange={(e)=>setResUsername(e.target.value)} /></div>
            <div className="input-register"> <input placeholder="Họ và tên" type="text" value={res_fullname} onChange={(e)=>setResFullname(e.target.value)}/></div>
            <div className="input-register"> <input placeholder="email" type="text" value={res_Email} onChange={(e)=>setResEmail(e.target.value)}/></div>
            <div className="input-register"> <input placeholder="Mật khẩu" type="password" value={res_Password} onChange={(e)=>setResPassword(e.target.value)}/></div>
            <div className="input-register"> <input placeholder="Số điện thoại" type="text" value={res_phone} onChange={(e)=>setResPhone(e.target.value)}/></div>
            <div >
                {/* <Button variant="outlined" component="label" disableElevation style={{width:160,height: 100}}>
                    <PublishIcon /><label style={{fontSize:8,lineHeight: 1.6 ,height: 30}}>Upload Ảnh</label>  
                    <input type="file"  type="file" name="fileUpload1"id="fileUpload1"
                            accept=".png,.jpg,.jpeg" onChange={(event)=> {uploadImageData(event)}} hidden />
                    <img  src={res_avatar} width="100px" height="100px" />
                </Button> */}
            </div>
            <div className="input-register"> <input placeholder="address" type="text" value={res_address} onChange={(e)=>setResAddress(e.target.value)}/></div>
            <div className="input-register"> <input placeholder="note" type="text" value={res_note} onChange={(e)=>setResNote(e.target.value)}/></div> 
            <div className="input-register-2colume"> 
                {/* <Button variant="outlined" onClick={()=>summitDataInfo()} color="#1294f1" > Đăng ký </Button> */}
                {/* <Button variant="outlined" onClick={()=>onclose()} color="#1294f1" > Hủy bỏ </Button> */}
            </div> 
        </div>
    )
}


export default RegisterUser;
