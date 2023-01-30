// server.js
const compression = require('compression');
const express = require('express');
const path = require('path');

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
app.get('/', (req, res) => {
  const animal = 'elephant';
  // It will repeatedly send the word 'elephant' in a 
  // 'text/html' format file
  res.sendFile(path.join(__dirname, '/index.html'));
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

