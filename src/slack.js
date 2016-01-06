'use strict';

import 'instapromise';

import Slack from 'slack-node';

import config from './config';

function sendSlackWebhookMessageAsync(options) {
  let slack = new Slack();
  slack.setWebhook(config.slack.webhookUrl);
  return slack.promise.webhook({
    channel: '#general',
    username: 'exp.host',
    icon_emoji: ':new:',
    ...options,
  });
}

async function sendNewNodeVersionMessageAsync(version) {
  let v = 'v' + version.format();
  return await sendSlackWebhookMessageAsync({
    text: `There's a new version of Node.js available: ${version.format()}\n` +
      `Get it with:\n\`nvm install ${v}; nvm alias default ${v}\`\n` +
      `(nvm is available at: https://github.com/creationix/nvm )
      Changelog: https://github.com/nodejs/node/blob/${v}/CHANGELOG.md`,
  });
}

export default {
  sendSlackWebhookMessageAsync,
  sendNewNodeVersionMessageAsync,
};
