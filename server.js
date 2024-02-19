/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const helmet = require('helmet');
const { createRequestHandler } = require('@remix-run/express');

const BUILD_DIR = path.join(process.cwd(), 'build');

const app = express();

// middleware to generate a per-request nonce for our CSP
// to be added to inline scripts generated by remix
// ref: https://github.com/remix-run/remix/issues/183
// ref: https://github.com/kentcdodds/kentcdodds.com/blob/9c99b6ccfedd54eddfde3a6ad606cf2c0df7b8e2/server/index.ts
app.use((_req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
  next();
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// configure CSP with helmet
app.use(
  helmet({
    useDefaults: true,
    crossOriginEmbedderPolicy: { policy: 'credentialless' },
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'manifest-src': ["'self'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https:'],
        'font-src': ["'self'", 'https:'],
        'frame-ancestors': [
          "'self'",
          'https://docs.verified.inc',
          'http://localhost:*',
        ],
        'base-uri': ["'self'"],
        'img-src': ["'self'", "'self'", 'data:', 'https:'],
        'form-action': ["'self'"],
        'script-src': [
          "'self'",
          // the nonce we generated above
          (_req, res) => `'nonce-${res.locals.cspNonce}'`,
          // LogRocket
          'https://*.lr-in-prod.com',
          'https://*.sentry.io',
        ],
        'worker-src': ["'self'", 'blob:'],
        'connect-src': [
          "'self'",
          // allow content from remix dev server during development
          process.env.NODE_ENV === 'development' ? 'ws://localhost:8002' : '',
          // LogRocket
          'https://*.lr-in-prod.com',
          'https://*.sentry.io',
        ],
      },
    },
    strictTransportSecurity: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    xFrameOptions: 'SAMEORIGIN',
    xContentTypeOptions: 'nosniff',
  })
);

// Remix fingerprints its assets so we can cache forever.
app.use(
  '/build',
  express.static('public/build', { immutable: true, maxAge: '1y' })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }));

app.use(morgan('tiny'));

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}

app.all(
  '*',
  process.env.NODE_ENV === 'development'
    ? (req, res, next) => {
        purgeRequireCache();

        return createRequestHandler({
          build: require(BUILD_DIR),
          mode: process.env.NODE_ENV,
          // pass the nonce in the load context so we can add it to scripts in our app
          getLoadContext: () => ({ cspNonce: res.locals.cspNonce }),
        })(req, res, next);
      }
    : (req, res, next) => {
        return createRequestHandler({
          build: require(BUILD_DIR),
          mode: process.env.NODE_ENV,
          // pass the nonce in the load context so we can add it to scripts in our app
          getLoadContext: () => ({ cspNonce: res.locals.cspNonce }),
        })(req, res, next);
      }
);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});