'use strict';

var semver = require('semver');
var db = require('../../db');

module.exports = function(req, res) {
  db.get()
    .pluck('name')
    .from('ruby_gems')
    .where('name', 'like', `%${req.query.query}%`)
    .limit(30)
    .then((gems) => res.send(gems))
    .catch(() => res.send([]));
};
