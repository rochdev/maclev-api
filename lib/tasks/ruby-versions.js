'use strict';

var cache = require('../cache');
var find = require('../util/find');

module.exports = {
  run() {
    return find.json(`https://api.github.com/repos/rbenv/ruby-build/contents/share/ruby-build`, 'name')
      .then((versions) => cache.add('ruby_versions', versions));
  }
};
