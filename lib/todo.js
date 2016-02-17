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

  return todo;
}

module.exports = todoRoute;
