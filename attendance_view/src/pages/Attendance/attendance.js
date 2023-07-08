import React, { useState,useCallback, useEffect } from "react";
import axios from 'axios';
import { HOST_HTTP_ATTENDANCE } from "../../config/config";
import { getGeolocation, getLocalIPAddress } from "../../utils/commonUtils";
import './style.scss'
const Attendance = () => {
  const [time,setTime] = useState();
   const [date,setDate] = useState();
   const [isValid,setIsValud] = useState(false);
   const [isSuccess,setIsSuccess] = useState(false);
   const [isArrival,setIsArrival] = useState();

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
      getIp()
    }, []);
    const getIp = async () => {
      let ips = await getGeolocation()
      setIp(ips);
    }
    const sendDataToAPI = async (data) => {
         await axios.post('http://127.0.0.1:3003/api/attendance', data)
          .then((res)=> {
            console.log(res.data);
            setIsArrival(res.data.is_arrival);
            setIsSuccess(res.data.success);
          })
          .catch((err) => {console.log(err);});

       
    };
    const isNumber = (str) => {
      return /^\d+$/.test(str);
    };
   const butonClick = useCallback(()=>{
      if(studentNumber == null || !isNumber(studentNumber) || studentNumber.length < 7 || studentNumber.length > 12) {
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
                {isValid ? <p className="warning">Please input your number again</p> : ""}
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
      

 {isSuccess ?  <div className="modal_wrapper active">
    <div className="shadow close_btn active"  onClick={()=> setIsSuccess(false)}></div>
    
    <div className="modal" >
      <div className="modal_item s_modal active">
        <div className="close close_btn"  onClick={()=> setIsSuccess(false)}>
          <ion-icon name="close"></ion-icon>
        </div>
        <div className="modal_body">
           <div className="s_icon">
          <ion-icon name="checkmark"></ion-icon>
        </div>
        <div className="s_text">
          <h2>Attendance Success</h2>
          {isArrival ? <p> {studentNumber} attend successfully, Welcome to Sparc Lab</p> : <p> See you again, {studentNumber}</p>}
        </div>
        </div>
        
      </div>
      
      
    </div>
  </div> : ""}

      
        </>
    )
}


export default Attendance;

// <div className="modal_wrapper active">
// <div className="shadow close_btn active"></div>

// <div className="modal">
  
//   <div className="modal_item e_modal active">
//     <div className="close close_btn">
//       <ion-icon name="close"></ion-icon>
//     </div>
//     <div className="modal_body">
//       <div className="s_icon">
//       <ion-icon name="help"></ion-icon>
//     </div>
//     <div className="s_text">
//       <h2>ERROR</h2>
//       <p>Unfortunately we have an issue with your attendance, try again later.</p>
//     </div>
//     </div>
//   </div>
// </div>
// </div>