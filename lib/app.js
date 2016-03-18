'use strict';

var compression = require('compression');
var cors = require('cors');
var express = require('express');
var db = require('./db');
var worker = require('./worker');
var cache = require('./cache');

module.exports = {
  start(port) {
    var app = express();

    app.use(cors());
    app.use(compression());
    app.get('/download', require('./routes/download'));
    app.get('/search/brew', require('./routes/search/brew'));
    app.get('/search/cask', require('./routes/search/cask'));
    app.get('/search/node', require('./routes/search/node'));
    app.get('/search/npm', require('./routes/search/npm'));
    app.get('/search/ruby', require('./routes/search/ruby'));
    app.get('/search/gems', require('./routes/search/gems'));
    app.get('/search/python', require('./routes/search/python'));
    app.get('/search/pip', require('./routes/search/pip'));
    app.use(express.static('www'));

    db.init().migrate.latest().then(() => {
      app.listen(port);
      worker.start();
      cache.refresh();
    });
  }
};
