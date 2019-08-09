
(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xhr2');

import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import { join } from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

const domino = require('domino');
const fs = require('fs');
const template = fs.readFileSync(join(DIST_FOLDER, 'index.html')).toString();
const win = domino.createWindow(template);
global['window'] = win;
global['Node'] = win.Node;
global['navigator'] = win.navigator;
global['Event'] = win.Event;
global['KeyboardEvent'] = win.Event;
global['MouseEvent'] = win.Event;
global['Event']['prototype'] = win.Event.prototype;
global['document'] = win.document;

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Sitemap
const sm = require('sitemap');
var sitemap = sm.createSitemap({
  hostname: 'WEBSITE_URL',
  cacheTime: 600000 * 10,
  urls: [
    { url: '/', changefreq: 'daily', priority: 0.7 }
    // Add more Urls
  ]
});

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});


// Sitemap route
app.get('/sitemap.xml', function (req, res) {
  sitemap.toXML(function (err, xml) {
    if (err) {
      return res.status(500).end();
    }
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });
});


// Start up the Node server
// app.listen(PORT, () => {
//   console.log(`Node Express server listening on http://localhost:${PORT}`);
// });
