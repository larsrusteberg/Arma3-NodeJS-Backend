var express = require('express'),
  router = express.Router(),
  walkUtil = require('../utils/walk'),
  md5 = require('md5-file'),
  fs = require('fs');

var MemcachePlus = require('memcache-plus');
var port = process.env.MEMCACHED_PORT || 11211;
var client = new MemcachePlus();

client.delete('calderia_mods_cache').then(function () {
  console.log('Successfully deleted the cache!')
});

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
    var cacheKey = "calderia_mods_cache";
    client.get(cacheKey).then(function (value) {
      if(value) {
        let response = JSON.parse(value);
        response.cached = true;
        res.contentType("application/json");
        res.send(response)
      } else {
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
        let response = {};
        response.files = strMapToObj(myMap);
        let data = JSON.stringify(response);
        client.set(cacheKey, data, 864000);
        response.cached = false;
        res.send(JSON.stringify(response))
      }
    });
  });
});
