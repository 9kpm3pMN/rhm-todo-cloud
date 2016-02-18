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

  todo.get('/', function(req,res) {
	console.log(new Date(), "In todo route GET / req.query=",req.query);
	db.listTasks(function(err,tasksList) {
		if (err) {
			res.status(500).send('Error 3');
		} else if (tasksList && tasksList.count > 0) {
			var returnData = [];
			for (var i = tasksList.list.length -1; i >= 0; i--) {
				returnData.push({
					uid: tasksList.list[i].guid,
					data: tasksList.list[i].fields
				});
			};
			res.status(200).send(returnData);
		} else {
			res.status(200).send('No Data');
		}
	});
  });
  
  todo.post('/', function(req,res) {
	console.log(new Date(), "In todo route POST / req.query=",req.query);
	var task = req.body && req.body.taskToSave ? req.body.taskToSave : undefined;
	
	if (task === undefined) {
		res.status(500).send('Error 7');
	} else {
		db.create(task, function(fail,success){
			if (fail || !success) {
				res.status(500).send(fail);
			} else {
				db.listTasks(function(err,tasksList) {
					if (err) {
						res.status(500).send('Error 3');
					} else if (tasksList && tasksList.count > 0) {
						var returnData = [];
						for (var i = tasksList.list.length -1; i >= 0; i--) {
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
  
todo.delete('/', function(req,res) {
	console.log(new Date(), "In todo route DELETE / req.query=",req.query);
	var task = req.body && req.body.taskId ? req.body.taskId : undefined;
	if (task === undefined) {
		res.status(500).send('Error 9');
	} else {
		db.deleteTask(task, function(fail,success){
			if (fail || !success) {
				res.status(500).send(fail);
			} else {
				db.listTasks(function(err,tasksList) {
					if (err) {
						res.status(500).send('Error 3');
					} else if (tasksList && tasksList.count > 0) {
						var returnData = [];
						for (var i = tasksList.list.length -1; i >= 0; i--) {
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

todo.put('/', function(req,res) {
	console.log(new Date(), "In todo route PUT / req.query=",req.query);
	var task = req.body && req.body.taskToComplete ? req.body.taskToComplete : undefined;
	
	if (task === undefined) {
		res.status(500).send('Error 9');
	} else {
		task.data.complete = true;
		console.log("task= ",task)
		db.updateTask(task.uid, task.data, function(fail,success){
			if (fail || !success) {
				res.status(500).send(fail);
			} else {
				db.listTasks(function(err,tasksList) {
					if (err) {
						res.status(500).send('Error 3');
					} else if (tasksList && tasksList.count > 0) {
						var returnData = [];
						for (var i = tasksList.list.length -1; i >= 0; i--) {
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
