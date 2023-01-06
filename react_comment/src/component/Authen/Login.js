import React, { useState} from "react";
import Swal from "sweetalert2";
import { login } from "../../reducers/Auth/authSlice";
import { useDispatch } from "react-redux";

const LoginComment = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isCustomer, setIsCustomer] = useState(true);
    const dispatch = useDispatch();


    const submitDataLogin = () => {
        try{
        const dataLogin = {
            username: email,
            password: password,
            isCustomer: isCustomer    // change it later
        }
        dispatch(login(dataLogin));
        }
        catch(error) {
            console.log('error login', login);
        }
    }

    return(
        <div>
            <input type={'text'} placeholder={'Email'} className='comment-airsense-input' value={email} onChange={e => setEmail(e.target.value)} />
            <input type={'password'} placeholder={'Password'} className='comment-airsense-input' value={password} onChange={e => setPassword(e.target.value)} />
            <p>Đăng nhập với tư cách</p>
            <p>Admin hệ thống</p>
            <p>Khách hàng</p>
            <p>Người dùng hệ thống</p>
            <button className="" onClick={() => submitDataLogin()}>Đăng nhập</button>
        </div>
    )
}

export default LoginComment;