var express = require('express'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  fh_health = require('fh-health'),
  HC = require('./health-checks'),
  maxRunTime = process.env.HC_RUNTIME || 60000;


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
