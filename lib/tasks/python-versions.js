'use strict';

var cache = require('../cache');
var find = require('../util/find');

module.exports = {
  run() {
    return find.json(`https://api.github.com/repos/yyuu/pyenv/contents/plugins/python-build/share/python-build`)
      .then((versions) => versions.filter((version) => version.size > 0))
      .then((versions) => cache.add('python_versions', versions.map((version) => {return version.name;})));
  }
};
