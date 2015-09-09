# nvm-alerts
Polls nvm for new versions of Node.js

## Development

- `gulp build`: Transform `src` into `build` using Babel. It also generates source maps under the `build` directory.
- `gulp watch`: Continuously watch the `src` directory
- `gulp clean`: Remove the `build` directory
- `npm start`: Run the app

The build files are not committed to Git.

## Deployment

Deployment is managed by pm2. Run `pm2 deploy ecosystem.json production`, which tells the server to pull the latest code, build the app, and run it.
