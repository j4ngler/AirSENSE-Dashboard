const CommonModel = require("../middlewareDatabase/CommonModel.js");
const squel = require("squel");
const knex = require("../../config/knex.js");
const TABLE_NAME = "time_delete_data";
// const limitStationData = require("../../utils/limitStationData.js");

class deleteDataTime extends CommonModel {


    getStationData(req, res) {
        const dataQuery = squel.select().from('time_delete_data')
            knex.raw(dataQuery.toString())
                .then((data) =>{
                    console.log('check data 1',data[0]);
                    return data;
      
                })
                .catch((err) =>{console.log("erro",err);});
    }

    //get table name
    getTableName() {
        return TABLE_NAME;
    }
    //
    getHasTimestamps() {
        return true;
    }

    getFieldToAdd() {
        return {
            valueSetup: ["station_id", "timestamp", "status"]
        }
    }
    
    getFieldToDelete() {
        return {
            // arrayCopy:["station_id", "timestamp", "status","created_at", "updated_at"],
            // locationSelect:"",
            // valueSelect:"",
            // userUpdate:"",
        };
    }

    getJsonToFind() {
        return [];
    }

    getTimeStamp() {
        // console.log('check db', this.getFieldToAdd("timestamp"))
        return this.getFieldToAdd("timestamp");
    }
    
    getStationId() {
        return this.getFieldToAdd("station_id");
    }
   
}

module.exports = deleteDataTime;