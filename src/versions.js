'use strict';

import 'instapromise';

import JsonFile from '@exponent/json-file';

import needle from 'needle';
import path from 'path';
import semver from 'semver';

const LISTING_URL = 'https://nodejs.org/dist/index.tab';

let cache = new JsonFile(path.join(__dirname, '_cache.json'));

async function checkVersionAsync() {
  let latestVersion = await getLatestNodeVersionAsync();
  let isNew = await isNewVersionAsync(latestVersion);
  if (isNew) {
    await cache.updateAsync('latestVersion', latestVersion.format());
  }
  return {
    isNew,
    version: latestVersion,
  };
}

async function isNewVersionAsync(version) {
  try {
    let cachedVersionString = await cache.getAsync('latestVersion');
    var cachedVersion = semver.parse(cachedVersionString);
  } catch (e) {
    console.warn('No cached version available; assuming this version is not new');
    await cache.writeAsync({
      latestVersion: version.format(),
    });
    return false;
  }
  return (cachedVersion.compare(version) < 0);
}

async function getLatestNodeVersionAsync() {
  let response = await needle.promise.get(LISTING_URL);
  let lines = response.body.split('\n');
  let cols = lines[1].split('\t');
  return semver.parse(cols[0]);
}

export default {
  checkVersionAsync,
  isNewVersionAsync,
  getLatestNodeVersionAsync,
};
