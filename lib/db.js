'use strict';

var knex = require('knex');
var config = require('../knexfile');
var instance = null;

module.exports = {
  get() {
    return instance;
  },

  init() {
    return instance = knex(config);
  }
};
