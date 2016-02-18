var healthChecks = require('fh-health');
var request = require('request');
var db = require('./db.js');

/**
 * Wrapper around fh-health addTest test API
 * @param  {string}   title  title of test to be performed.
 * @param  {Function} cb Callback containing test logic
 * @return fh-=health normal test reporter
 */
function normalTest(title, cb) {
  return healthChecks.addTest(title, cb);
}

/**
 * Wrapper around fh-health addCritical test API
 * @param  {string}   title  title of test to be performed.
 * @param  {Function} cb Callback containing test logic
 * @return FH-Health Critical Test Reporter
 */
function critTest(title, cb) {
  return healthChecks.addCriticalTest(title, cb);
}

/**
 * health check test response handler
 * @param  {Function} done cb invoked to notify fh-health test complete
 * @param  {string}   fail in event of error, message to be returned
 * @param  {string}   pass in event of error, message to be returned
 * @return Invoked to notify fh-health test complete
 */
function handleResponse(done, fail, pass) {
  if (fail) {
    return done(fail, null);
  } else {
    return done(null, pass);
  }
}

/*
 * Can Mongo do list action
 */

 critTest("MongoDB OK", function(done) {
	db.listTasks(function(err,res) {
		if (err) {
			handleResponse(done,err,null);
		} else {
			handleResponse(done,null,'Mongo OK');
		}
	});
 });