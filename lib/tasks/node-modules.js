'use strict';

var request = require('superagent');
var JSONStream = require('JSONStream');
var es = require('event-stream');
var cache = require('../cache');

module.exports = {
  run() {
    return cache.updated('node_modules')
      .then((timestamp) => new Promise((resolve, reject) => {
        var modules = [];

        request.get('http://registry.npmjs.org/-/all/since').query({startkey: timestamp})
          .on('end', () => cache.add('node_modules', modules).then(resolve))
          .on('error', reject)
          .pipe(JSONStream.parse([true]))
          .pipe(es.map(function(module) {
            module.name && modules.push(module.name);
          }));
      }));
  }
};
