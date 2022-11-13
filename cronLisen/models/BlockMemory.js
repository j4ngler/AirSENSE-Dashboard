'use strict';

const data = require('../config/data.config');

class BlockMemory {
    constructor() {
        this.status = 'available';
        this.memory = [];
        this.valuesSetup =[];
    }

    setup(value){
        this.valuesSetup =value;
    }

    add(record) {
        this.memory.push(record);
        console.log('a',this.memory)
        try{
            if(this.isFull())   this.saveAll();
        }
        catch{

        }
    }

    isFull() {
        return this.memory.length === 1;
    }

    isAvailable() {
        return !(this.isFull() || this.status == 'pending');
    }

    clearMemory() {
        this.memory = []
    }

    saveAll() {
        var self = this;
        this.status = 'pending';
        console.log("Save all...............");
        var sensor=[];
        this.memory.forEach(element => {
            var jsonData={data:element.content};
            try{
                jsonData =JSON.parse(element.content);
            }
            catch(ie){

            }
            
            var record  = { topic:element.topic,
                            content:jsonData,
                            time:element.time
                        };
            
                sensor.push(record); 
        });
        // console.log('sensor', sensor);
        if(this.memory.length>0){
            if(sensor.length>0){
                console.log("Save data station", sensor);
                data.insertMany(sensor, function (err, data) {
                    if (err) {
                        console.log("err",err);
                    }
                    else{
                        // console.log('anv')
                        sensor=[];
                        self.status= 'idle';
                        self.clearMemory();
                    }
                });
            }
            
        }
        else
        {
            self.status= 'idle';
            self.clearMemory();
        }
        
    }
}

module.exports = BlockMemory;