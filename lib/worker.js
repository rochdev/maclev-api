'use strict';

var requireDir = require('require-dir');
var cache = require('./cache');
var tasks = requireDir('./tasks');
var queue = require('./queue');

module.exports = {
  start() {
    queue.process('refresh cache', function(job, done) {
      tasks[job.data.key].run()
        .then(() => done())
        .catch(done);
    });
  }
};
