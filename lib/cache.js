'use strict';

var chunk = require('lodash/chunk');
var db = require('./db');

module.exports = {
  add(collection, items) {
    var batch = chunk(items.map((item) => {return {name: item};}), 1000);

    return db.transaction((trx) => {
      return Promise.all([
        trx('updates')
          .update('updated_at', db.fn.now())
          .where('name', collection),

        Promise.all(batch.map((items) => {
          return trx.raw(trx.insert(items).into(collection).toString() + ` on conflict do nothing`);
        }))
      ]);
    });
  },

  updated(key) {
    return db.first()
      .from('updates')
      .where('name', key)
      .then((row) => row.updated_at ? row.updated_at.getTime() : 0);
  }
};
