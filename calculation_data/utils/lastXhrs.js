const SensorDataModel = require("../schema/data.config");
const {AQIViewHourlyModel} = require("../schema/aqiView.schema");
const moment = require('moment')
const {AVGConcentration} = require("../schema/avgConcentration.schema");

const lastXhrs = async (x) => {
  return SensorDataModel.find({
    time: {
      $gt: Date.now() - x * 60 * 60 * 1000,
    },
  });
};

const nowCast = (arr12Hour)=>{
    let last12 = arr12Hour
    let w = Math.max(...last12)/Math.min(...last12)
    w = w <= 0.5 ? 0.5 : w
    let nowCast = 0;
    if(w>0.5){
        let TS = 0
        let MS = 1;
        last12.forEach((item ,index)=>{
            TS += item*Math.pow(w,11-index)
            MS += Math.pow(w , 11-index)
        })
        nowCast = TS/MS
    }else{
        last12.forEach((item ,index)=>{
            nowCast+= item*Math.pow(0.5,12-index)
        })
    }
    return nowCast
}

const lastAQIHourXhrs = async(locationId , x)=>{
    const startDate = moment().subtract(x , 'hours')
    return  AVGConcentration.find(
        {
            locationId: {
                $eq: locationId,
            },
            time: {
                $gt: startDate.toDate(),
                $lt: new Date(),
                $ne: null,
            },
        }
    )

}

const distinctData = async (x) => {
    return SensorDataModel.find({
        time: {
          $gt: Date.now() - x * 60 * 60 * 1000,
        },
      }).distinct('staion_id')
}

module.exports = {
    lastXhrs,
    lastAQIHourXhrs,
    nowCast,
    distinctData
};

