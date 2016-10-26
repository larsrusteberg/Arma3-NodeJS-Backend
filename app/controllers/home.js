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

function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v;
  }
  return obj;
}

router.get('/files', function (req, res, next) {
  walkUtil.walk('../calderia-mods', function(err, results) {
    let myMap = new Map();
    var pathCorrectedResults = [];
    if (err) throw err;
    res.contentType("application/json");
    results.forEach(function (result) {
      var correctedPath = result.replace('../calderia-mods/', '');
      var length = correctedPath.indexOf('/');
      var modName = correctedPath.substr(0, length);
      if(myMap.has(modName)) {
        myMap.get(modName).push(correctedPath)
      } else {
        var array = [];
        array.push(correctedPath);
        myMap.set(modName, array)
      }
      // pathCorrectedResults.push(modName);
    });
    res.send(JSON.stringify(strMapToObj(myMap)))
  });
});
