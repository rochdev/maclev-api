'use strict';

var cache = require('../cache');
var find = require('../util/find');

module.exports = {
  run() {
    return find.regex(`https://pypi.python.org/simple/`, /href='([^']+)'/g)
      .then((packages) => cache.add('python_packages', packages));
  }
};
