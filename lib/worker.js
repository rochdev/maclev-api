'use strict';

var kue = require('kue');
var requireDir = require('require-dir');
var cache = require('./cache');
var tasks = requireDir('./tasks');

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

module.exports = {
  start() {
    queue.process('refresh cache', function(job, done) {
      tasks[job.data.key].run()
        .then(() => done())
        .catch(done);
    });
  }
};
