'use strict';

var kue = require('kue');

var queue = kue.createQueue({
  redis: {
    host: 'queue'
  }
});

queue.on('error', (err) => console.error(err));

process.once('SIGTERM', () => {
  queue.shutdown(5000, (err) => {
    err && console.log(err);
    process.exit(+!!err)
  });
});

process.once('uncaughtException', (e) => {
  queue.shutdown(5000, (err) => {
    err && console.log(err);
    throw e;
  });
});

module.exports = queue;
