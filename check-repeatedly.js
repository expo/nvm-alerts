#!/usr/bin/env node

var timeconstants = require('timeconstants');

setInterval(function () {
  require('.')().then(function () {
    console.log("Check for new iojs version");
  }, function (err) {
    console.error("*ERR* Failed to check for new iojs version:", err, "\n" + err.stack);
  });
}, timeconstants.minute * 5);
