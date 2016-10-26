var fs = require('fs');
var access = fs.createWriteStream(__dirname + '/node.access.log', { flags: 'a' })
  , error = fs.createWriteStream(__dirname + '/node.error.log', { flags: 'a' });

// redirect stdout / stderr
process.stdout.pipe(access);
process.stderr.pipe(error);

var express = require('express'),
  config = require('./config/config');

var app = express();

require('./config/express')(app, config);

app.listen(config.port, '0.0.0.0', 511, function () {
  console.log('Express server listening on port ' + config.port);
});

