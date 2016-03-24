'use strict';

var app = require('./lib/app');

// Handle SIGTERM for PID 1
process.on('SIGTERM', function() {
  process.exit();
});

app.start(process.env.PORT || 80);
