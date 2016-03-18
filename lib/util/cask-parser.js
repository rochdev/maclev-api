'use strict';

var request = require('../request');

module.exports = {
  parse(url) {
    return request
      .get(url).end()
      .then((response) => response.text)
      .then((data) => {
        var match;
        var resultMatcher = /^\s+([A-Z0-9_]+) (?:(?:"([^"]+)")|(?:'([^']+)')|(.+))$/gmi;
        var result = {};

        while((match = resultMatcher.exec(data)) !== null) {
          let key = match[1];
          let value = match[2] || match[3] || match[4];

          result[key] = value;
        }

        result.url = result.url
          .split(`#{version}`).join(result.version)
          .split(`#{version.after_comma}`).join(result.version.split(',')[1])
          .split(`#{version.major_minor}`).join(result.version.split('.').slice(0, 2).join('.'))
          .split(`#{version.sub(%r{-.*}, '')}`).join(result.version.split('-')[0])
          .split(`#{version[%r{^\\w+}]}`).join(result.version.split(/[^\w]/)[0])
          .split(`#{version.gsub('.', '_')}`).join(result.version.split('.').join('_'));

        return result;
      });
  }
};
