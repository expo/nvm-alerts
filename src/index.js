'use strict';

import 'instapromise';
import 'source-map-support/register';

import timeconstants from 'timeconstants';

import slack from './slack';
import versions from './versions';

async function pollVersionAsync() {
  let {isNew, version} = await versions.checkVersionAsync();
  if (isNew) {
    console.log(`There is a new version of iojs:`, version.format());
    await slack.sendNewNodeVersionMessageAsync(version);
  } else {
    console.log(`Already on the latest version of iojs:`, version.format());
  }
  return {isNew, version};
}

if (require.main === module) {
  setInterval(() => {
    pollVersionAsync().catch(error => {
      console.error(error.stack);
      process.exit(1);
    });
  }, 5 * timeconstants.minute);
}
