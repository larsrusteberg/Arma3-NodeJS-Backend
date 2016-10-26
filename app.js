var express = require('express'),
  config = require('./config/config');

var app = express();

require('./config/express')(app, config);

app.listen(config.port, '0.0.0.0', function () {
  console.log('Express server listening on port ' + config.port);
});

