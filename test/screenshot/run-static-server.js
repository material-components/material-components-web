const express = require('express');
const serveIndex = require('serve-index');

const PathResolver = require('../../scripts/build/path-resolver');

const pathResolver = new PathResolver();

const app = express();
const absolutePath = pathResolver.getAbsolutePath('/test/screenshot');
app.use('/', express.static(absolutePath), serveIndex(absolutePath));
app.listen(8080, () => {
  console.log('!!! LOCAL SERVER RUNNING ON http://localhost:8080/');
});
