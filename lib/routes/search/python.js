'use strict';

var db = require('../../db');

module.exports = function(req, res) {
  db.pluck('name')
    .from('python_versions')
    .where('name', 'like', `%${req.query.query}%`)
    .then((versions) => res.send(versions))
    .catch(() => res.send([]));
};