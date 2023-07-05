const express = require("express");

const sparcLocation = {
    latitude: 21.00426,
    longtitude: 105.84423
}
const distanceCheck = 1000;
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}
class LocationSupport {
    checkDistance( lat2, lon2) {
      console.log(lat2, lon2);
        const earthRadius = 6371; // Bán kính Trái Đất (đơn vị: km)
      
        const dLat = toRadians(lat2 - sparcLocation.latitude);
        const dLon = toRadians(lon2 - sparcLocation.longtitude);
      
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRadians(sparcLocation.latitude)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
        const distance = earthRadius * c * 1000;
        console.log(distance);
        return distanceCheck > distance;
      }
      


}
module.exports = new LocationSupport