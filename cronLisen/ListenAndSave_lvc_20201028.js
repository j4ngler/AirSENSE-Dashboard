var mqtt = require('mqtt')
var events = require('events');
emitter = new events.EventEmitter();
const config = require('config');
var mysql = require('mysql');

var con = mysql.createConnection({
       host:'103.1.238.170',
       user:'root',
	   port:3306,
       password: 'SPARCLab1',
       database: 'admin_python'
   });

var connectStatus = 'idle';
var columnsSql = '(';
var columns=[];
for(var field in config.fields) {
	columns.push(field);
}
columnsSql = '(' + columns.join() +')';
delete columns;

class BlockMemory {
    constructor(name) {
        this.status = true;
        this.memory = [];
		this.name=name;
    }

    add(record) {
        //if (!this.isFull()) {
            this.memory.push(record);
          //  if (this.isFull()) this.saveAll();
       // } else {
         //   //console.log('full memory');
        //    //console.log('memory: ', this.memory);
       // }
    }

    isFull() {
        return this.memory.length === config.maxItemMemory;
    }

    isAvailable() {
        return !(this.isFull() || this.status );
    }
	
	isProcessing() {
		 //console.log("isProcessing",this.status,this.name);
        return this.status;
    }
	setProcessing(setSatus) {
      this.status=setSatus;
    }

    clearMemory() {
        this.memory = []
    }

    saveAll() {
        var self = this;
        this.status = false;
        var fields = [];
		if(this.memory.length<1) return;
		var valS02=0,valPressure=0,valNO2=0,valCO2=0,valCO=0,valSO3=0;
		//console.log("this.memory",this.memory);
		for(var i=0;i<this.memory.length;i++){
			//console.log("this.memory ==>",i,this.memory[i]);
			try{
				var Res_Json=JSON.parse(this.memory[i]);
				//console.log("this.Res_Js",Res_Json);
				valS02=valPressure=valNO2=valCO2=valCO=valSO3=0;
				if(Res_Json.DATA.S02) valS02=Res_Json.DATA.S02;
				if(Res_Json.DATA.Pressure) valPressure=Res_Json.DATA.Pressure;
				if(Res_Json.DATA.NO2) valNO2=Res_Json.DATA.NO2;
				if(Res_Json.DATA.CO2) valCO2=Res_Json.DATA.CO2;
				if(Res_Json.DATA.CO) valCO=Res_Json.DATA.CO;
				if(Res_Json.DATA.S03) valSO3=Res_Json.DATA.S03;
				var values=[parseInt(Res_Json.NodeId,16),Res_Json.DATA.Time,
							Res_Json.DATA.Pm2p5,Res_Json.DATA.Pm10,
							Res_Json.DATA.Pm1,Res_Json.DATA.Tem,
							Res_Json.DATA.Hum,valPressure,valS02,valNO2,valCO2,valCO,valSO3];
				//console.log("this.values",values);
				//console.log("this.values",values.join());
           /* for(field in record) {
                if( record[field] ) {
                    values.push(record[field]);
                } else values.push('NULL');    
            }
            values = '(' + values.join() + ')';*/
            fields.push('(' + values.join() + ')');
				
			}
			catch(err) {
				//console.log(err);
				try{
					var Res_Json=JSON.parse(this.memory[i]+'}');
					//console.log("this.Res_Js 1",Res_Json);
					valS02=valPressure=valNO2=valCO2=valCO=valSO3=0;
					if(Res_Json.DATA.S02) valS02=Res_Json.DATA.S02;
					if(Res_Json.DATA.Pressure) valPressure=Res_Json.DATA.Pressure;
					if(Res_Json.DATA.NO2) valNO2=Res_Json.DATA.NO2;
					if(Res_Json.DATA.CO2) valCO2=Res_Json.DATA.CO2;
					if(Res_Json.DATA.CO) valCO=Res_Json.DATA.CO;
					if(Res_Json.DATA.S03) valSO3=Res_Json.DATA.S03;
					var values=[parseInt(Res_Json.NodeId,16),Res_Json.DATA.Time,
								Res_Json.DATA.Pm2p5,Res_Json.DATA.Pm10,
								Res_Json.DATA.Pm1,Res_Json.DATA.Tem,
								Res_Json.DATA.Hum,valPressure,valS02,valNO2,valCO2,valCO,valSO3];
					fields.push('(' + values.join() + ')');
					
				}
				catch(err1) {
				//console.log(err1);
				
				}
				//console.log("fields ==>",fields);
			}
			//console.log("fields ",fields);
			
        }
        fields = fields.join();
        var sql = "INSERT INTO sparc_sensor_data "+ columnsSql +" VALUES " + fields;
		//console.log("sql ",this.name,sql);
		self.clearMemory();
		con.query(sql, function (err, result) {
			if (err){
				setTimeout(function(){ alert("Hello");
					con.query(sql, function (err, result) {
						//console.log("sql ==> time out",this.name,sql);
						
					});
				}, 500);
				throw err;
			} 
			//console.log("sql ==> not out");
		});
        
    }
}
//////////////////////////////


var SaveFactory = (function(){
    class Save {
        constructor() {
            this.memFirst = new BlockMemory("record 1");
            this.memSecond = new BlockMemory("record 2");
        }
    
        save(record) {
            if (this.memFirst.isProcessing()) {
				 this.memFirst.add(record);
               
            } else this.memSecond.add(record);
        }
		
		saveAll(){
			this.memSecond.isProcessing();
			if (this.memFirst.isProcessing()) {
				//console.log(" config.clientId ===>memFirst");
                 this.memFirst.saveAll();
				 this.memSecond.setProcessing(true);
				 this.memFirst.setProcessing(false);
            } else{
				//console.log(" config.clientId ===>memSecond");
                 this.memSecond.saveAll();
				 this.memFirst.setProcessing(true);
				 this.memSecond.setProcessing(false);
            }
		}
    }

    var instance;
    return {
        getInstance: function(){
        if (!instance) {
            instance = new Save();
            delete instance.constructor;
        }
        return instance;
        }
    };
})();

var mqttConfig = config.mqtt;
var clients = [];
mqttConfig.map(config => {
	config.clientId+=Math.random().toString(16).substr(2, 8);
	console.log(" config.clientId ===>",config.clientId);
    var client = mqtt.connect('http://mqtt.airsense.vn/', config);
    clients.push(client);
    client.on('connect', function () {
        client.subscribe('#', function (err) {
            if (!err) {
                console.log("Connect mqtt successfully in port:", config.port);
            }
                //console.log(err);
        });
    })
    client.on('disconnect', function () {
        //console.log("disconnect")
    })
});
var save = SaveFactory.getInstance();
var saveInterval = setInterval(function () {
	//save.save('{"DATA":{"CO":0,"Hum":53.79,"Pm1":0,"Pm10":57.16,"Pm2p5":24.53,"Time":1603509240,"Tem":25.5},"NodeId":"DC4F227E57DA"}');
    save.saveAll();        
				//clearInterval(saveInterval);
}, 2000);

clients.map(client => {
    client.on('message', function (topic, message, packet) {
        try{
            console.log(message.toString('utf-8'));
           // message = JSON.parse(message.toString('utf-8'));
			save.save( message.toString('utf-8'));
           // var record = Object.assign({}, config.fields);
            /*for(property in record) {
                if(message[property] != undefined) {
                    record[property] = message[property];
                }
            }
			//console.log(" record ===>",record);
            if(record.station_id!=null && record.station_id != '' ) {
                record.station_id = parseInt(record.station_id, 16);
                //console.log("record: ", record);
                save.save(record);
            }*/
        } catch(e) {
            //console.log("Exception: ",e);
        }
    });
})



