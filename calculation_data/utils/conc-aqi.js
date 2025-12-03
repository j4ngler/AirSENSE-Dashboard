function Linear(AQIhigh, AQIlow, Conchigh, Conclow, Conc) {
    let linear
    let a
    a = ((Conc - Conclow) / (Conchigh - Conclow)) * (AQIhigh - AQIlow) + AQIlow
    linear = Math.round(a)
    return isNaN(linear) ? null : linear
  }
  
  
  function AQISO2(Conc){
  
  }
  
  function AQIPM25(Conc) {
    if (Conc == null) {
      return null
    }
    let c
    let AQI
    c = (Math.floor(10 * Conc)) / 10
    if (c >= 0 && c < 12.1) {
      AQI = Linear(50, 0, 12, 0, c)
    }
    else if (c >= 12.1 && c < 35.5) {
      AQI = Linear(100, 51, 35.4, 12.1, c)
    }
    else if (c >= 35.5 && c < 55.5) {
      AQI = Linear(150, 101, 55.4, 35.5, c)
    }
    else if (c >= 55.5 && c < 150.5) {
      AQI = Linear(200, 151, 150.4, 55.5, c)
    }
    else if (c >= 150.5 && c < 250.5) {
      AQI = Linear(300, 201, 250.4, 150.5, c)
    }
    else if (c >= 250.5 && c < 350.5) {
      AQI = Linear(400, 301, 350.4, 250.5, c)
    }
    else if (c >= 350.5 && c < 500.5) {
      AQI = Linear(500, 401, 500.4, 350.5, c)
    }
    else {
      AQI = Linear(500, 401, 500.4, 350.5, c) // PM25message: Beyond the AQI.
    }
    return isNaN(AQI) ? null : AQI
  }
  
  function AQIPM10(Conc) {
    if (Conc == null) {
      return null
    }
    let c
    let AQI
    c = Math.floor(Conc)
    if (c >= 0 && c < 55) {
      AQI = Linear(50, 0, 54, 0, c)
    }
    else if (c >= 55 && c < 155) {
      AQI = Linear(100, 51, 154, 55, c)
    }
    else if (c >= 155 && c < 255) {
      AQI = Linear(150, 101, 254, 155, c)
    }
    else if (c >= 255 && c < 355) {
      AQI = Linear(200, 151, 354, 255, c)
    }
    else if (c >= 355 && c < 425) {
      AQI = Linear(300, 201, 424, 355, c)
    }
    else if (c >= 425 && c < 505) {
      AQI = Linear(400, 301, 504, 425, c)
    }
    else if (c >= 505 && c < 605) {
      AQI = Linear(500, 401, 604, 505, c)
    }
    else {
      AQI = Linear(500, 401, 604, 505, c) // PM10message: Beyond the AQI.
    }
    return isNaN(AQI) ? null : AQI
  }
  
  function AQICO(Conc) {
    if (Conc == null) {
      return null
    }
    let c
    let AQI
    c = (Math.floor(10 * Conc)) / 10
    if (c >= 0 && c < 4.5) {
      AQI = Linear(50, 0, 4.4, 0, c)
    }
    else if (c >= 4.5 && c < 9.5) {
      AQI = Linear(100, 51, 9.4, 4.5, c)
    }
    else if (c >= 9.5 && c < 12.5) {
      AQI = Linear(150, 101, 12.4, 9.5, c)
    }
    else if (c >= 12.5 && c < 15.5) {
      AQI = Linear(200, 151, 15.4, 12.5, c)
    }
    else if (c >= 15.5 && c < 30.5) {
      AQI = Linear(300, 201, 30.4, 15.5, c)
    }
    else if (c >= 30.5 && c < 40.5) {
      AQI = Linear(400, 301, 40.4, 30.5, c)
    }
    else if (c >= 40.5 && c < 50.5) {
      AQI = Linear(500, 401, 50.4, 40.5, c)
    }
    else {
      AQI = Linear(500, 401, 50.4, 40.5, c) // COmessage: Beyond the AQI.
    }
    return isNaN(AQI) ? null : AQI
  }
  
  function AQISO21hr(Conc) {
    if (Conc == null) {
      return null
    }
    let c
    let AQI
    c = Math.floor(Conc)
    if (c >= 0 && c < 36) {
      AQI = Linear(50, 0, 35, 0, c)
    }
    else if (c >= 36 && c < 76) {
      AQI = Linear(100, 51, 75, 36, c)
    }
    else if (c >= 76 && c < 186) {
      AQI = Linear(150, 101, 185, 76, c)
    }
    else if (c >= 186 && c <= 304) {
      AQI = Linear(200, 151, 304, 186, c)
    }
    else {
      AQI = AQISO224hr(Conc)
    }
    return isNaN(AQI) ? null : AQI
  }
  
  function AQISO224hr(Conc) {
    if (Conc == null) {
      return null
    }
    let c
    let AQI
    c = Math.floor(Conc)
    if (c >= 0 && c <= 304) {
      AQI = AQISO21hr(Conc)
    }
    else if (c >= 304 && c < 605) {
      AQI = Linear(300, 201, 604, 305, c)
    }
    else if (c >= 605 && c < 805) {
      AQI = Linear(400, 301, 804, 605, c)
    }
    else if (c >= 805 && c <= 1004) {
      AQI = Linear(500, 401, 1004, 805, c)
    }
    else {
      AQI = Linear(500, 401, 1004, 805, c) // SO224hrmessage: Beyond the AQI.
    }
    return isNaN(AQI) ? null : AQI
  }
  
  function AQIO38hr(Conc) {
    if (Conc == null) {
      return null
    }
    let c
    let AQI
    c = (Math.floor(Conc)) / 1000
    if (c >= 0 && c < .055) {
      AQI = Linear(50, 0, 0.054, 0, c)
    }
    else if (c >= .055 && c < .071) {
      AQI = Linear(100, 51, .070, .055, c)
    }
    else if (c >= .071 && c < .086) {
      AQI = Linear(150, 101, .085, .071, c)
    }
    else if (c >= .086 && c < .106) {
      AQI = Linear(200, 151, .105, .086, c)
    }
    else if (c >= .106 && c < .201) {
      AQI = Linear(300, 201, .200, .106, c)
    }
    else {
      AQI = AQIO31hr(Conc)
    }
    return isNaN(AQI) ? null : AQI
  }
  
  
  function AQIO31hr(Conc) {
    if (Conc == null) {
      return null
    }
    let c
    let AQI
    c = (Math.floor(Conc)) / 1000
    if (c >= 0 && c <= .124) {
      AQI = AQIO38hr(Conc)
    }
    else if (c >= .125 && c < .165) {
      AQI = Linear(150, 101, .164, .125, c)
    }
    else if (c >= .165 && c < .205) {
      AQI = Linear(200, 151, .204, .165, c)
    }
    else if (c >= .205 && c < .405) {
      AQI = Linear(300, 201, .404, .205, c)
    }
    else if (c >= .405 && c < .505) {
      AQI = Linear(400, 301, .504, .405, c)
    }
    else {
      AQI = Linear(500, 401, .604, .505, c)
    }
    return isNaN(AQI) ? null : AQI
  }
  
  function AQINO2(Conc) {
    if (Conc == null) {
      return null
    }
    let c
    let AQI
    c = (Math.floor(Conc)) / 1000
    if (c >= 0 && c < .054) {
      AQI = Linear(50, 0, .053, 0, c)
    }
    else if (c >= .054 && c < .101) {
      AQI = Linear(100, 51, .100, .054, c)
    }
    else if (c >= .101 && c < .361) {
      AQI = Linear(150, 101, .360, .101, c)
    }
    else if (c >= .361 && c < .650) {
      AQI = Linear(200, 151, .649, .361, c)
    }
    else if (c >= .650 && c < 1.250) {
      AQI = Linear(300, 201, 1.249, .650, c)
    }
    else if (c >= 1.250 && c < 1.650) {
      AQI = Linear(400, 301, 1.649, 1.250, c)
    }
    else if (c >= 1.650 && c <= 2.049) {
      AQI = Linear(500, 401, 2.049, 1.650, c)
    }
    else {
      AQI = Linear(500, 401, 2.049, 1.650, c) // NO2message: Beyond the AQI.
    }
    return isNaN(AQI) ? null : AQI
  }
  
  function AQICategory(AQI) {
    let AQICategory
    if (AQI == null) {
      AQICategory = null
    }
    else if (AQI <= 50) {
      AQICategory = "Good"
    }
    else if (AQI > 50 && AQI <= 100) {
      AQICategory = "Moderate"
    }
    else if (AQI > 100 && AQI <= 150) {
      AQICategory = "Unhealthy for Sensitive Groups"
    }
    else if (AQI > 150 && AQI <= 200) {
      AQICategory = "Unhealthy"
    }
    else if (AQI > 200 && AQI <= 300) {
      AQICategory = "Very Unhealthy"
    }
    else if (AQI > 300 && AQI <= 400) {
      AQICategory = "Hazardous"
    }
    else if (AQI > 400 && AQI <= 500) {
      AQICategory = "Hazardous"
    }
    else {
      AQICategory = "Beyond the AQI"
    }
    return AQICategory
  }
  
  module.exports = {
    AQIPM25,
    AQIPM10,
    AQICO,
    AQISO21hr,
    AQISO224hr,
    AQIO38hr,
    AQIO31hr,
    AQINO2,
    AQICategory
  }