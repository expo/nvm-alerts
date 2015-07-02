#!/usr/bin/env node
require('.')().then(function () {
  process.exit(0);
}, function (err) {
  console.error(err.message);
  process.exit(err.code || -1)
});
