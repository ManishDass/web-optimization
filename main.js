// server.js
const compression = require('compression');
const express = require('express');
const path = require('path');
var cache = require('cache-control');
const port = process.env.PORT || 3000;

const app = express();


app.use(cache({
  '/index.html': 1000,
  '/none/**/*.html': 1000,
  '/private.html': 'private, max-age=300',
  '/**': 500 // Default to caching all items for 500,
}));

app.use(express.static(__dirname + '/public', {
  maxAge: 86400000,
  setHeaders: function(res, path) {
      res.setHeader("Expires", new Date(Date.now() + 2592000000*30).toUTCString());
    }
}))

const shouldCompress = (req, res) => {
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


app.use('/', express.static('./public'));


app.get('/', (req, res) => {
  const animal = 'elephant';
  // It will repeatedly send the word 'elephant' in a 
  // 'text/html' format file
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});

