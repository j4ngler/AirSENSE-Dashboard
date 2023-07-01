import React, { useState,useCallback, useEffect } from "react";
import axios from 'axios';
import { HOST_HTTP_ATTENDANCE } from "../../config/config";
import { getLocalIPAddress } from "../../utils/commonUtils";
import './style.scss'
const Attendance = () => {
  const [time,setTime] = useState();
   const [date,setDate] = useState();
   const [isValid,setIsValud] = useState(false);
   const [isSuccess,setIsSuccess] = useState(false);

   const [ip1,setIp] =useState();
   const [studentNumber,setStudentNumber] = useState();
   useEffect(() => {
      const timer = setInterval(() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        setTime(`${hours}:${minutes}:${seconds}`);
        setDate(`${day}/${month}/${year}`);
      }, 1000);
      
      return () => {
        clearInterval(timer);
      };
      
    }, []);
    useEffect(() => {
     getLocalIPAddress((ip)=>
     {
      setIp(ip);
      console.log('Địa chỉ IP của máy hiện tại:', ip1)
     })
    }, []);

    const sendDataToAPI = async (data) => {
      try {
       
        const response = await axios.post('http://127.0.0.1:3003/api/attendance', data);
        console.log(response.data);
        setIsSuccess(true);
      } catch (error) {

        console.error(error);
        
      }
    };
    const isNumber = (str) => {
      return /^\d+$/.test(str);
    };
   const butonClick = useCallback(()=>{
      if(studentNumber == null || !isNumber(studentNumber)) {
         setIsValud(true);
      }
      else 
      {
         setIsValud(false);
         sendDataToAPI({
            user_number:studentNumber,
            ip:ip1
         })
      }
   },[studentNumber]);
    return (
        <>

     <header className="cd__intro">
         <h1>  Sparc Lab Attendance System</h1>
        
      </header>

      <main className="cd__main">
         <div id="clockdate">
         <div className="clockdate-wrapper">
            <div id="clock">{time}</div>
            <div id="date">{date}</div>
         </div>
         </div>
         <div id="clockdate">
         <div className="tab">                    
                      <input placeholder="Enter Student Numbers..."  onChange={(e)=>{setStudentNumber(e.target.value)}}/>
                </div>
                {isValid ? <p className="warning">Please input your number </p> : ""}
                <div className="buttons">
                  <button className="blob-btn" onClick={()=> butonClick()}>
                     Attendances
                     <span className="blob-btn__inner">
                        <span className="blob-btn__blobs">
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        <span className="blob-btn__blob"></span>
                        </span>
                     </span>
                  </button>
                  </div>
                           </div>
         </main>
      <footer className="cd__credit">Author: Sparc Software Team - Distributed By: Tmtuan</footer>
      

 {isSuccess ?  <div class="modal_wrapper active">
    <div class="shadow close_btn active"  onClick={()=> setIsSuccess(false)}></div>
    
    <div class="modal" >
      <div class="modal_item s_modal active">
        <div class="close close_btn"  onClick={()=> setIsSuccess(false)}>
          <ion-icon name="close"></ion-icon>
        </div>
        <div class="modal_body">
           <div class="s_icon">
          <ion-icon name="checkmark"></ion-icon>
        </div>
        <div class="s_text">
          <h2>Attendance Success</h2>
          <p> {studentNumber} attendance done, Have a good day</p>
        </div>
        </div>
        
      </div>
      
      
    </div>
  </div> : ""}

      
        </>
    )
}


export default Attendance;