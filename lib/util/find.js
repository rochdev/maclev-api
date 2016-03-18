'use strict';

var request = require('superagent');
var superagentPromisePlugin = require('superagent-promise-plugin');
var es = require('event-stream');

superagentPromisePlugin.Promise = Promise;

module.exports = {
  json(url, path) {
    return fetch(url)
      .then((response) => {
        if (path) {
          return JSON.parse(response).map((entry) => entry[path]);
        } else {
          return JSON.parse(response);
        }
      });
  },

  regex(url, pattern) {
    return new Promise((resolve, reject) => {
      var results = [];
      var expr = new RegExp(pattern);

      request
        .get(url)
        .on('error', (e) => reject)
        .pipe(es.split())
        .pipe(es.map((line, callback) => {
          var match;

          while (match = expr.exec(line)) {
            results.push(match[1]);
          }

          callback(null, line);
        }))
        .pipe(es.wait(() => resolve(results)));
    });
  }
};

function fetch(url) {
  return request
    .get(url)
    .use(superagentPromisePlugin)
    .end()
    .then((response) => response.text);
}
