var es = require('event-stream');
var geojson = require('weather-alerts-geojson');
var parser = require('weather-alerts-parser');
var request = require('request');
var fs = require('fs');
var through = require('through');
var express = require('express');
var app = express();

 
app.get('/', function (req, res) {
  

var features = [];

var fc = through(function write(data) {
    features.push(data);
    //this.queue(data);
  },
  function end () { //optional 
     console.log(features.length);
     var featureCollection = {
       type: "FeatureCollection",
       features: features
     }
     res.send(JSON.stringify(featureCollection))

  })

var r = request.get('http://alerts.weather.gov/cap/us.php?x=0')
  .pipe(parser.stream())
  .pipe(geojson.stream({'stylize': true}))
  //.pipe(geojson.collect({'sort': false, 'flatten': false}))
  .pipe(fc)

});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

