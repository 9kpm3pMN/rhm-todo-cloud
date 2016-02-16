var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var fh_health = require('fh-health');
var healthChecks = require('./health-checks');
var maxRunTime = process.env.HEALTHCHECK_RUNTIME || 60000;


function healthRoute() {
  var route = new express.Router();

  route.use(cors());
  route.use(bodyParser());

  // set HC runtime or default to 60 secs
  fh_health.setMaxRuntime(maxRunTime);
  fh_health.init();

  route.get('/', function(req, res) {
    fh_health.runTests(function(e, d) {
      res.set('Content-Type', 'application/json');

      if (e) {
        res.status(500).send(e.message);
      } else if (typeof d === 'string') {
        res.status(200).send(d);
      } else {
        res.status(200).json(d);
      }
    });
  });

  return route;
}

module.exports = healthRoute;
