'use strict';

var es = require('event-stream')
var spawn = require('child_process').spawn;
var cache = require('../cache');

module.exports = {
  run() {
    return new Promise((resolve, reject) => {
      var gem = spawn('gem', ['list', '--remote', '--no-versions']);
      var results = [];

      gem.stdout
        .pipe(es.split())
        .pipe(es.map(function(data, cb) {
          /^[A-Z0-9_-]+$/gmi.test(data) && results.push(data);
          console.log(data);

          cb(null, data);
        }))
        .pipe(es.wait(() => cache.add('ruby_gems', results).then(resolve).catch(reject)));

      gem.stderr
        .pipe(es.wait((err, data) => reject(err || data)));
    });
  }
};
