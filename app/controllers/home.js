var express = require('express'),
  router = express.Router(),
  walkUtil = require('../utils/walk');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.contentType("application/json");
  res.send('{}')
});

router.get('/files', function (req, res, next) {
  walkUtil.walk('../calderia-mods', function(err, results) {
    var pathCorrectedResults = [];
    if (err) throw err;
    res.contentType("application/json");
    results.forEach(function (result) {
      var correctedPath = result.replace('../calderia-mods/', '');
      pathCorrectedResults.push(correctedPath);
    });
    res.send(JSON.stringify(pathCorrectedResults))
  });
});
