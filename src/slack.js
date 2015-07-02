var _ = require('lodash-node');
var instapromise = require('instapromise');
var slackNode = require('slack-node');

var config = require('./config');

async function sendSlackWebhookMessageAsync(opts) {
  var s = new slackNode();
  s.setWebhook(config.slack.webhookUrl);
  var defaults = {
    //channel: '#metadevelopment',
    channel: '#general',
    username: 'exp.host',
    text: 'Test ' + Date.now(),
    icon_emoji: ':new:',
  };
  opts = _.assign(defaults, opts);
  return s.promise.webhook(opts);
};

async function sendNewIojsVersionMessageAsync(version) {
  return await sendSlackWebhookMessageAsync({
    text: "There's a new version of iojs available: " + version.format() + "\nGet it with `nvm`",
  });
};


module.exports = {
  sendSlackWebhookMessageAsync,
  sendNewIojsVersionMessageAsync,
};
