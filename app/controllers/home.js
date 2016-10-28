var express = require('express'),
  router = express.Router(),
  walkUtil = require('../utils/walk'),
  md5 = require('md5-file'),
  fs = require('fs');

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
      let correctedPath = result.replace('../calderia-mods/', '');
      let length = correctedPath.indexOf('/');
      let modName = correctedPath.substr(0, length);
      let fileObj = {};
      let stats = fs.statSync(result);
      if(myMap.has(modName)) {
        fileObj.path = correctedPath;
        fileObj.md5 = md5.sync(result);
        fileObj.size = stats.size;
        fileObj.mtime = stats.mtime;
        myMap.get(modName).push(fileObj)
      } else {
        let array = [];
        fileObj.path = correctedPath;
        fileObj.md5 = md5.sync(result);
        fileObj.size = stats.size;
        fileObj.mtime = stats.mtime;
        array.push(fileObj);
        myMap.set(modName, array)
      }
      // pathCorrectedResults.push(modName);
    });
    res.send(JSON.stringify(strMapToObj(myMap)))
  });
});
