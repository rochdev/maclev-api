'use strict';

var kue = require('kue');
var instance = null;

module.exports = {
  get() {
    return instance;
  },

  init() {
    instance = kue.createQueue({
      redis: {
        host: 'queue'
      }
    });

    instance.on('error', (err) => console.error(err));

    process.once('SIGTERM', () => {
      instance.shutdown(5000, (err) => {
        err && console.log(err);
        process.exit(+!!err)
      });
    });

    process.once('uncaughtException', (e) => {
      instance.shutdown(5000, (err) => {
        err && console.log(err);
        throw e;
      });
    });

    return instance;
  }
};
