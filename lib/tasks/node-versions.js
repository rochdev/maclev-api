'use strict';

var cache = require('../cache');
var find = require('../util/find');

module.exports = {
  run() {
    return find.regex('https://nodejs.org/dist/', /href="(v\d+\.\d+\.\d+)\/"/g)
      .then((versions) => cache.add('node_versions', versions));
  }
};
