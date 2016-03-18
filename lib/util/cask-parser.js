'use strict';

var request = require('../request');

module.exports = {
  parse(url) {
    return request
      .get(url).end()
      .then((response) => response.text)
      .then((data) => {
        var result = {};

        result.version = extractString(data, 'version');
        result.url = extractString(data, 'url');
        result.name = extractString(data, 'name');

        setValue(result, 'app', extractString(data, 'app'));
        setValue(result, 'pkg', extractString(data, 'pkg'));
        setValue(result, 'binary', extractBinary(data));

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

function setValue(result, key, value) {
  value && (result[key] = value);
}

function extractString(data, key) {
  var match;
  var resultMatcher = new RegExp(`^\\s+${key} (?:(?:"([^"]+)")|(?:'([^']+)')|(.+))$`, 'gmi');
  var value;

  while((match = resultMatcher.exec(data)) !== null) {
    value = match[1] || match[2] || match[3];
  }

  return value;
}

function extractBinary(data) {
  var match;
  var resultMatcher = new RegExp(`^\\s+binary '([^']+)', target: '([^']+)'$`, 'gmi');
  var values = {};

  while((match = resultMatcher.exec(data)) !== null) {
    values[match[1]] = match[2];
  }

  return Object.keys(values).length ? values : null;
}
