'use strict';

var chunk = require('lodash/chunk');
var kebabCase = require('lodash/kebabCase');
var db = require('./db');
var queue = require('./queue');

module.exports = {
  add(collection, items) {
    var batch = chunk(items.map((item) => {return {name: item};}), 1000);

    return db.get().transaction((trx) => {
      return Promise.all([
        trx('updates')
          .update('updated_at', db.get().fn.now())
          .where('name', collection),

        Promise.all(batch.map((items) => {
          return trx.raw(trx.insert(items).into(collection).toString() + ` on conflict do nothing`);
        }))
      ]);
    });
  },

  refresh() {
    this.empty().then((keys) => {
      keys.forEach((key) => {
        queue.get().create('refresh cache', {title: key.replace(/-/g, ' '), key: key}).save();
      });
    });
  },

  empty() {
    return db.get()
      .select()
      .from('updates')
      .then((rows) => rows.filter((row) => !row.updated_at).map((row) => kebabCase(row.name)));
  },

  updated(key) {
    return db.get().first()
      .from('updates')
      .where('name', key)
      .then((row) => row.updated_at ? row.updated_at.getTime() : 0);
  }
};
