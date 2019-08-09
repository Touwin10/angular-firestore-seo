const functions = require('firebase-functions');

const universal = require(`${process.cwd()}/dist/server`).app;
const runtimeOpts = {
  memory: '512MB'
}

const ssr = functions.runWith(runtimeOpts).https.onRequest(universal);

module.exports = {
  ssr
}
