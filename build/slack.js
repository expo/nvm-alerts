'use strict';

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var sendSlackWebhookMessageAsync = _asyncToGenerator(function* (opts) {
  var s = new slackNode();
  s.setWebhook(config.slack.webhookUrl);
  var defaults = {
    channel: '#metadevelopment',
    //channel: '#general',
    username: 'exp.host',
    text: 'Test ' + Date.now(),
    icon_emoji: ':new:'
  };
  opts = _.assign(defaults, opts);
  return s.promise.webhook(opts);
});

var sendNewIojsVersionMessageAsync = _asyncToGenerator(function* (version) {
  return yield sendSlackWebhookMessageAsync({
    text: 'There\'s a new version of iojs available: ' + version.format() + '\nGet it with:\n`nvm install iojs`\n(nvm is available at: https://github.com/creationix/nvm )'
  });
});

var _ = require('lodash-node');
var instapromise = require('instapromise');
var slackNode = require('slack-node');

var config = require('./config');

;

;

module.exports = {
  sendSlackWebhookMessageAsync: sendSlackWebhookMessageAsync,
  sendNewIojsVersionMessageAsync: sendNewIojsVersionMessageAsync
};
//# sourceMappingURL=sourcemaps/slack.js.map