var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require('./db.js');

var sampleData = [{
  label: 'Learn Angular',
  complete: false
}, {
  label: 'Deploy to RHMAP',
  complete: true
}, {
  label: 'Rewrite Todo Component',
  complete: false
}];

// seed smaple data on app launch
db.listTasks(function(err, tasks) {
  if (err || tasks.list.length === 0) {
    db.create(sampleData, function(fail, success) {
      if (fail || !success) {
        console.error('Unable to seed sample data');
      } else {
        console.log('Sample data Seeded');
      }
    });
  } else {
    console.log('Sample Data Seeded');
  }
});

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

  // // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // // This can also be added in application.js
  // // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  todo.put('/', function(req, res) {
    console.log(new Date(), 'In todo route DELETE / req.body=', req.body);
    var taskId = req.body && req.body.taskId ? req.body.taskId : undefined;
    var data = req.body && req.body.data ? req.body.data : undefined;

    if (taskId === undefined || !data) {
      res.status(500).send('Error: Updateing todo task');
    } else {
      db.updateTask(taskId, data, function(fail, success) {
        if (success) {
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
        } else {
          res.status(500).send(fail);
        }
      });
    }
  });

  // DELETE REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // This can also be added in application.js
  // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  todo.delete('/', function(req, res) {
    console.log(new Date(), 'In todo route DELETE / req.body=', req.body);
    var taskId = req.body && req.body.taskId ? req.body.taskId : undefined;

    if (taskId === undefined) {
      res.status(500).send('Error: No uid passed');
    } else {
      db.deleteTask(taskId, function(fail, success) {
        if (success) {
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
        } else {
          res.status(500).send(fail);
        }
      });
    }
  });

  return todo;
}

module.exports = todoRoute;
