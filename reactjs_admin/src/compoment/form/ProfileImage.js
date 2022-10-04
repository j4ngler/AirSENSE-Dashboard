
import React, { useState } from 'react';
import {
    FormControl,
    Button,
    InputLabel,
    MenuItem,
    Select,
    TextField
  } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import { uploadImgUser } from '../../api/httpBaseUtil.js';
import Swal from 'sweetalert2';
import {HOST_HTTP}  from '../../config/config.js';

const ProfileImage = ({ urlImage, uploadfileDataLink }) => {
        const [state, setState] = useState({link:urlImage});

        const uploadImageData=(event)=>{
            console.log("Content: " + event);
            event.preventDefault();
            const data = new FormData() 
            data.append('file', event.target.files[0]);  
            console.log(data);  
            uploadImgUser(data).then((response)=>{
                var value = response.data.url;
                console.log("uploadfileDataImage.....................",response,response.data.path,value);
                Swal.fire("Cập nhật thông tin thành công");
                setState({ link:value});
                uploadfileDataLink(value);
            });
        }

        return (
            <Button variant="outlined" component="label" disableElevation style={{width:160,height: 160}}>
                {/* <PublishIcon /> */}
                {/* <label style={{fontSize:8,lineHeight: 1.6 ,height: 15}}>Cập nhật</label>   */}
                <input type="file" 
                        type="file"
                        name="fileUpload1"
                        id="fileUpload1"
                        accept=".png,.jpg,.jpeg"
                        onChange={(event)=> {uploadImageData(event)}}
                        hidden />
                <img  src={state.link} className='account-img' width="160px" height="160px" />
                
            </Button>
        );
}

export default ProfileImage;

