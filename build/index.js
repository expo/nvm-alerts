'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var getLatestIojsVersionAsync = _asyncToGenerator(function* () {
  var response = yield needle.promise.get(LISTING_URL);
  var lines = response.body.split('\n');
  var cols = lines[1].split('\t');
  return semver.parse(cols[0]);
});

var compareVersionAsync = _asyncToGenerator(function* (version) {
  try {
    var cachedVersion = semver.parse((yield cache.getAsync('latestVersion')));
  } catch (e) {
    console.error('No cached version available; assuming this version is not new.');
    yield cache.writeAsync({
      latestVersion: version.format()
    });
    return false;
  }
  // console.log("cachedVersion=", cachedVersion, "version=", version);
  return cachedVersion.compare(version) < 0;
});

var getAndCompareAsync = _asyncToGenerator(function* () {
  var v = yield getLatestIojsVersionAsync();
  var isNew = yield compareVersionAsync(v);
  if (isNew) {
    yield cache.updateAsync('latestVersion', v.format());
  }
  return {
    isNew: isNew,
    version: v
  };
});

var pollAsync = _asyncToGenerator(function* () {
  var _ref = yield getAndCompareAsync();

  var isNew = _ref.isNew;
  var version = _ref.version;

  if (isNew) {
    console.log('There is a new version of iojs:', version.format());
    yield slack.sendNewIojsVersionMessageAsync(version);
  } else {
    console.log('Already on the latest version of iojs:', version.format());
  }
  return { isNew: isNew, version: version };
});

var _ = require('lodash-node');
var instapromise = require('instapromise');
var jsonFile = require('@exponent/json-file');
var needle = require('needle');
var path = require('path');
var semver = require('semver');

var r = require('./database/r');
var slack = require('./slack');

const LISTING_URL = 'https://iojs.org/dist/index.tab';
var cache = jsonFile(path.join(__dirname, '_cache.json'));

module.exports = pollAsync;

_.assign(pollAsync, {
  getLatestIojsVersionAsync: getLatestIojsVersionAsync,
  pollAsync: pollAsync,
  cache: cache,
  getAndCompareAsync: getAndCompareAsync,
  compareVersionAsync: compareVersionAsync
});

if (require.main === module) {
  pollAsync().then(function () {
    process.exit(0);
  }, function (err) {
    console.error('Error when polling and comparing versions!');
    process.exit(-1);
  });
}
//# sourceMappingURL=sourcemaps/index.js.map