const DataSensor = require('../schema/dataSensor.schema');

class BlockMemory {
    constructor() {
        this.count = 0;
        this.latch = 1678873080;
        this.data = [];
        this.convertData = [];
        this.status = 'idle'; // busy || idle
    }

    setCount(number) {
        this.count = number;
    }

    isAvailable() {
        return !(this.status === 'busy');
    }

    clearMemory() {
        this.data = [];
    }

    async getLatch() {
        let temp = this.latch;
        for(let i=0; i<=this.count; ++i) {
            let fromTime = temp;
            let toTime = temp + 60;
            const stationSelect = 'sensor/63313170';
            await this.getDataSensor(fromTime.toString(), toTime.toString(), stationSelect);
            temp = toTime;
        }
        this.updateLatch(this.latch + this.count * 60);
    }

    updateLatch(number) {
        this.latch = number;
    }

    

    async getDataSensor(fromTime, toTime, stationSelect) {
        // const stationSelect = 'sensor/63313170';
        // const fromTime = '1678873080';
        // const toTime = '1676451660';
        const a = '1676340107';
        const b = '1676451660';
        const result = await DataSensor.find(
            {
              content: { $exists: true },
              topic: stationSelect,
              $and: [{ time: { $gte: a } }, { time: { $lt: b } }],
            },
            { _id: 0, __v: 0, topic: 0 }
          )
            .hint({ time: 1 })
            .lean();
        console.log('hi Giang', result);
    }

}

module.exports = BlockMemory;