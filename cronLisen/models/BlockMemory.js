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
        // console.log(record)
        this.memory.push(record);
        try{
            if(this.isFull())   this.saveAll();
        }
        catch{

        }
    }

    isFull() {
        return this.memory.length >= 6;
    }

    isAvailable() {
        return !(this.status == 'pending');
    }

    clearMemory() {
        this.memory = []
    }

    saveAll() {
        let self = this;
        this.status = 'pending';
        // console.log("Save all...............");
        // var sensor=[];
        // this.memory.forEach(element => {
        //     var jsonData={data:element.content};
        //     try{
        //         jsonData =JSON.parse(element.content);
        //     }
        //     catch(ie){

        //     }
            
        //     var record  = { topic:element.topic,
        //                     content:jsonData,
        //                     time:element.time
        //                 };
            
        //         sensor.push(record); 
        // });
        // console.log('sensor', sensor);
        if(this.memory.length>0){
                console.log("Save data station");
                data.insertMany(this.memory, function (err, data) {
                    if (err) {
                        console.log("err",err);
                    }
                    else
                    {
                        self.status= 'idle';
                        self.clearMemory();
                    }
                });
        }
        else
        {
            self.status= 'idle';
            self.clearMemory();
        }
        
    }
}

module.exports = BlockMemory;