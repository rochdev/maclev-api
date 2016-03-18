'use strict';

var db = require('../../db');

module.exports = function(req, res) {
  db.get()
    .pluck('name')
    .from('python_packages')
    .where('name', 'like', `%${req.query.query}%`)
    .limit(30)
    .then((versions) => res.send(versions))
    .catch(() => res.send([]));
};
