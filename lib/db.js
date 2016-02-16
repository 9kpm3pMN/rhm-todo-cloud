var collection = 'todo_tasks';
var $fh = require('fh-mbaas-api');

exports.create = function(data, cb) {
  $fh.db({
    "act": "create",
    "type": collection,
    "fields": data
  }, function(err, data) {
    if (err) {
      console.error('$fh.db create error', err);
      cb('$fh.db create error', false);
    } else {
      cb(null, data);
    }
  });
}

exports.updateTask = function(taskId, taskData, cb) {
  $fh.db({
    "act": "update",
    "type": collection,
    "guid": taskId,
    "fields": taskData
  }, function(err, data) {
    if (!err) {
      cb(null, true);
    } else {
      console.error('$fh.db list error', err);
      cb('$fh.db list error', null);
    }
  });
}

exports.listTasks = function(cb) {
  $fh.db({
    'act': 'list',
    'type': collection
  }, function(err, data) {
    if (!err) {
      cb(null, data);
    } else {
      console.error('$fh.db list error', err);
      cb('$fh.db list error', null);
    }
  });
}

exports.deleteTask = function(taskId, cb) {
  $fh.db({
    'act': 'delete',
    'type': collection,
    'guid': taskId
  }, function(err, data) {
    if (err) {
      console.error('$fh.db deleteTask error', err);
      cb('$fh.db deleteTask error', null);
    } else {
      if (Object.keys(data).length === 0) {
        cb('Record not found', null)
      } else {
        cb(null, true);
      }
    }
  });
}
