const mongoose = require('mongoose');
const DataSensor = require('./models/schemaMongo/dataSensor');

const DAY = 86400;
const rawDays = 30;
const summaryDays = 365;
const metrics = ['Temperature', 'Humidity', ...Array.from({ length: 8 }, (_, index) => `ADC${index}`)];
const sensorTopic = /^electric-nose\/device\/[^/]+\/sensor$/;
const summaries = () => mongoose.connection.collection('enose_sensor_minutes');
const pending = { enose_rollup_pending: true };
const expiryDate = (seconds, days) => new Date((seconds + days * DAY) * 1000);

function summarize(samples) {
  const values = {};
  let heaterSamples = 0;
  for (const sample of samples) {
    if (sample.enose_heater_active === true) heaterSamples++;
    for (const metric of metrics) {
      const value = sample.content?.[metric];
      if (!Number.isFinite(value) || (metric === 'Humidity' &&
          (sample.enose_heater_active === true || value < 0 || value > 100))) continue;
      const stats = values[metric] ||= { min: value, max: value, sum: 0, count: 0 };
      stats.min = Math.min(stats.min, value);
      stats.max = Math.max(stats.max, value);
      stats.sum += value;
      stats.count++;
    }
  }
  for (const stats of Object.values(values)) stats.avg = stats.sum / stats.count;
  return { values, heater_samples: heaterSamples, sample_count: samples.length };
}

async function prepareIndexes() {
  await Promise.all([
    DataSensor.collection.createIndex({ topic: 1, time: -1 }),
    DataSensor.collection.createIndex({ enose_rollup_pending: 1, time: 1 }, {
      partialFilterExpression: pending
    }),
    DataSensor.collection.createIndex({ enose_expires_at: 1 }, {
      expireAfterSeconds: 0,
      partialFilterExpression: { enose_retention: 'monitoring' }
    }),
    summaries().createIndex({ topic: 1, minute: 1 }),
    summaries().createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 })
  ]);
}

async function processMinute(topic, minute) {
  const samples = await DataSensor.collection.find(
    { topic, time: { $gte: minute, $lt: minute + 60 } },
    { projection: { time: 1, content: 1, enose_rollup_pending: 1, enose_retention: 1, enose_heater_active: 1 } }
  ).toArray();
  const summary = {
    _id: JSON.stringify([topic, minute]),
    topic,
    minute,
    ...summarize(samples),
    expires_at: expiryDate(minute, summaryDays)
  };
  // Only replace with an equally complete or fuller snapshot when workers overlap.
  const update = [{ $replaceWith: {
    $cond: [{ $lte: [{ $ifNull: ['$sample_count', 0] }, summary.sample_count] },
      { $literal: summary }, '$$ROOT']
  } }];
  try {
    await summaries().updateOne({ _id: summary._id }, update, { upsert: true });
  } catch (error) {
    if (error.code !== 11000) throw error;
    await summaries().updateOne({ _id: summary._id }, update);
  }
  const rows = samples.filter(sample => sample.enose_rollup_pending);
  for (let offset = 0; offset < rows.length; offset += 500) {
    await DataSensor.collection.bulkWrite(rows.slice(offset, offset + 500).map(sample => {
      const $set = { enose_rollup_pending: false };
      if (sample.enose_retention === 'monitoring') $set.enose_expires_at = expiryDate(sample.time, rawDays);
      return { updateOne: { filter: { _id: sample._id, ...pending }, update: { $set } } };
    }));
  }
}

function start() {
  async function run() {
    try {
      await indexes;
      // Give inserts already in flight time to finish before summarizing a minute.
      const cutoff = Math.floor(Date.now() / 60000) * 60 - 120;
      for (let count = 0; count < 60; count++) {
        const row = await DataSensor.collection.findOne(
          { ...pending, topic: sensorTopic, time: { $lt: cutoff } },
          { sort: { time: 1 }, projection: { topic: 1, time: 1 } }
        );
        if (!row) break;
        await processMinute(row.topic, Math.floor(row.time / 60) * 60);
      }
    } catch (error) {
      console.error('[E-Nose retention]', error.message);
      indexes = null;
    } finally {
      if (!indexes) indexes = prepareIndexes();
      indexes.catch(() => {});
      setTimeout(run, 60000).unref();
    }
  }
  let indexes = prepareIndexes();
  return run();
}

async function history(deviceCode, metric, from, to) {
  const step = Math.max(60, Math.ceil((to - from) / (1200 * 60)) * 60);
  const key = `$values.${metric}`;
  const rows = await summaries().aggregate([
    { $match: {
      topic: `electric-nose/device/${deviceCode}/sensor`,
      minute: { $gte: Math.floor(from / 60) * 60, $lt: to },
      [`values.${metric}`]: { $exists: true }
    } },
    { $group: {
      _id: { $subtract: ['$minute', { $mod: ['$minute', step] }] },
      min: { $min: `${key}.min` },
      max: { $max: `${key}.max` },
      sum: { $sum: `${key}.sum` },
      count: { $sum: `${key}.count` }
    } },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, time: '$_id', min: 1, max: 1, count: 1, avg: { $divide: ['$sum', '$count'] } } }
  ]).toArray();
  return { step_seconds: step, rows };
}

function inventory(now = Date.now()) {
  const cutoff = Math.floor(now / 1000) - rawDays * DAY;
  return DataSensor.collection.aggregate([
    { $match: { topic: sensorTopic, time: { $lt: cutoff, $type: 'number' } } },
    { $group: {
      _id: '$topic',
      old_samples: { $sum: 1 },
      oldest_time: { $min: '$time' },
      already_marked: { $sum: { $cond: [{ $eq: [{ $type: '$enose_expires_at' }, 'date'] }, 1, 0] } },
      preserved_or_unclassified: { $sum: { $cond: [{ $ne: ['$enose_retention', 'monitoring'] }, 1, 0] } }
    } },
    { $sort: { _id: 1 } }
  ]).toArray();
}

module.exports = { start, history, inventory, metrics, summaryDays };
