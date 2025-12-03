import axios from "axios";

export const getGeolocation = async () => {
    try
    {
      const res = await axios.get('https://geolocation-db.com/json/');
      return res.data.IPv4;
    }
    catch(ie){
      return "0.0.0.0";
    }        
  }

export const convertDate = (time)=>{
  const date = new Date(time);
  return `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`;
}

export function getLocalIPAddress(callback) {
  const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  const pc = new RTCPeerConnection({iceServers: []});

  pc.createDataChannel('');
  pc.createOffer().then(function(offer) {
    return pc.setLocalDescription(offer);
  }).catch(function(error) {
    console.error('Đã xảy ra lỗi:', error);
  });

  pc.onicecandidate = function(event) {
    if (event.candidate) {
      let ipAddress;
      if (event.candidate.address) {
        ipAddress = event.candidate.address;
      } else if (event.candidate.ip) {
        ipAddress = event.candidate.ip;
      } else if (event.candidate.relatedAddress) {
        ipAddress = event.candidate.relatedAddress;
      }
       
      callback(ipAddress);
      pc.onicecandidate = null;
      pc.close();
    }
  };
}
