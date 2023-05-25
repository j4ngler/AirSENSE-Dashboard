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