var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require('./db.js');

var sampleData = [{
  label: 'Learn Angular',
  complete: false,
  date: new Date()
}, {
  label: 'Deploy to RHMAP',
  complete: true,
  date: new Date()
}, {
  label: 'Rewrite Todo Component',
  complete: false,
  date: new Date()
}];

// seed smaple data on app launch
function seedData() {
  db.listTasks(function(err, tasks) {
    if (err || tasks.list.length === 0) {
      db.create(sampleData, function(fail, success) {
        if (fail || !success) {
          console.error(new Date(), 'Unable to seed sample data');
        } else {
          console.log(new Date(), 'SampleData Seeded');
        }
      });
    } else {
      console.log(new Date(), 'Sample Data Seeded');
    }
  });
}

// invoke
seedData();

function todoRoute() {
  var todo = new express.Router();
  todo.use(cors());
  todo.use(bodyParser());


  // GET REST endpoint - query params may or may not be populated
  todo.get('/', function(req, res) {
    console.log(new Date(), 'In todo route GET / req.query=', req.query);

    db.listTasks(function(err, tasksList) {
      if (err) {
        res.status(500).send('Error getting Todo List');
      } else if (tasksList && tasksList.count > 0) {
        var returnData = [];
        for (var i = tasksList.list.length - 1; i >= 0; i--) {
          returnData.push({
            uid: tasksList.list[i].guid,
            data: tasksList.list[i].fields
          });
        };
        res.status(200).send(returnData);
      } else {
        res.status(200).send('No todo data!!');
      }
    });
  });

  // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // This can also be added in application.js
  // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  todo.post('/', function(req, res) {
    console.log(new Date(), 'In todo route POST / req.body=', req.body);
    var task = req.body && req.body.taskToSave ? req.body.taskToSave : undefined;

    if (task === undefined) {
      res.status(500).send('Error: No data!!');
    } else {
      // add new task
      db.create(task, function(fail, success) {
        if (fail || !success) {
          res.status(500).send(fail);
        } else {
          // get updated todo list
          db.listTasks(function(err, tasksList) {
            if (err) {
              res.status(500).send('Error getting Todo List');
            } else if (tasksList && tasksList.count > 0) {
              var returnData = [];
              for (var i = tasksList.list.length - 1; i >= 0; i--) {
                returnData.push({
                  uid: tasksList.list[i].guid,
                  data: tasksList.list[i].fields
                });
              };
              res.status(200).send(returnData);
            }
          });
        }
      });
    }
  });

  return todo;
}

module.exports = todoRoute;
