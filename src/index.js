let _ = require('lodash-node');
let instapromise = require('instapromise');
let jsonFile = require('@exponent/json-file');
let needle = require('needle');
let path = require('path');
let semver = require('semver');

let r = require('./database/r');
let slack = require('./slack');

const LISTING_URL = 'https://iojs.org/dist/index.tab';
let cache = jsonFile(path.join(__dirname, '_cache.json'));

async function getLatestIojsVersionAsync() {
  let response = await needle.promise.get(LISTING_URL);
  let lines = response.body.split("\n");
  let cols = lines[1].split("\t");
  return semver.parse(cols[0]);
}

async function compareVersionAsync(version) {
  try {
    var cachedVersion = semver.parse(await cache.getAsync('latestVersion'));
  } catch (e) {
    console.error("No cached version available; assuming this version is not new.");
    await cache.writeAsync({
      latestVersion: version.format(),
    });
    return false;
  }
  // console.log("cachedVersion=", cachedVersion, "version=", version);
  return (cachedVersion.compare(version) < 0);
}

async function getAndCompareAsync() {
  let v = await getLatestIojsVersionAsync();
  let isNew = await compareVersionAsync(v);
  if (isNew) {
    await cache.updateAsync('latestVersion', v.format())
  }
  return {
    isNew,
    version: v,
  };
}

async function pollAsync() {
  let {isNew, version} = await getAndCompareAsync();
  if (isNew) {
    console.log("There is a new version of iojs:", version.format());
    await slack.sendNewIojsVersionMessageAsync(version);
  } else {
    console.log("Already on the latest version of iojs:", version.format());
  }
  return {isNew, version};
}

module.exports = pollAsync;

_.assign(pollAsync, {
  getLatestIojsVersionAsync,
  pollAsync,
  cache,
  getAndCompareAsync,
  compareVersionAsync,
});

if (require.main === module) {
  pollAsync().then(() => {
    process.exit(0);
  }, (err) => {
    console.error("Error when polling and comparing versions!");
    process.exit(-1);
  });
}
