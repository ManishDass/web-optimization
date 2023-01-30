// server.js
const compression = require('compression');
const express = require('express');
const path = require('path');
const cache = require('cache-headers');
const port = process.env.PORT || 3000;

const pathsConfig = {
  paths: {
      '/**/generic': {
          staleRevalidate: 'ONE_HOUR',
          staleError: 'ONE_HOUR'
      },
      '/default/values': {},
      '/user/route': false,
      '/**': 60
  }
};


const app = express();const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // Will not compress responses, if this header is present
    return false;
  }
  // Resort to standard compression
  return compression.filter(req, res);
};

// Compress all HTTP responses
app.use(compression({
  // filter: Decide if the answer should be compressed or not,
  // depending on the 'shouldCompress' function above
  filter: shouldCompress,
  // threshold: It is the byte threshold for the response 
  // body size before considering compression, the default is 1 kB
  threshold: 0
}));

app.use(cache.setupInitialCacheHeaders(pathsConfig));

app.use('/', express.static('./public'));

app.use(function (req, res, next) {
  res.set('Cache-control', 'public, max-age=300')
})

app.get('/', (req, res) => {
  const animal = 'elephant';
  // It will repeatedly send the word 'elephant' in a 
  // 'text/html' format file
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});

