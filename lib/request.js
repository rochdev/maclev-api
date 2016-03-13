'use strict';

var request = require('superagent');
var superagentPromisePlugin = require('superagent-promise-plugin');

superagentPromisePlugin.Promise = Promise;

module.exports = {
  get() {
    return request.get.apply(request, arguments).use(superagentPromisePlugin);
  },

  post() {
    return request.get.apply(request, arguments).use(superagentPromisePlugin);
  }
};
