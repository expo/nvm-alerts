'use strict';

import path from 'path';
import process from 'process';

const secret = requireSecret();

function requireSecret() {
  // Local configuration takes precedence
  let secret = attemptToRequire('./secret');
  if (secret) {
    return secret;
  }

  // This is a private package used by the production host
  secret = attemptToRequire('@exponent/secret');
  if (secret) {
    return secret;
  }

  console.warn(
    'Create %s with your configuration secrets to set up nvm-alerts',
    path.relative(process.cwd(), path.join(__dirname, 'secret.js'))
  );
  return null;
}

function attemptToRequire(moduleName) {
  try {
    return require(moduleName);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      return null;
    }
    throw e;
  }
}

export default {
  server: {
    port: 3000,
  },
  ...secret,
};
