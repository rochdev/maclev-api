'use strict';

var request = require('superagent');
var superagentPromisePlugin = require('superagent-promise-plugin');

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
    return fetch(url)
      .then((response) => {
        let expr = new RegExp(pattern);
        let results = [];
        let match;

        while (match = expr.exec(response)) {
          results.push(match[1]);
        }

        return results;
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
