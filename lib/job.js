
'use strict';

var util = require('util');

var Job = function(id, queue, data){
  this.id = id;
  this.queue = queue;
  this.data = data;
  this.status = 'waiting';
};

Job.prototype.progress = function(progress) {
  this.progress = progress;
  this.queue.emit('progress', this);
};

Job.prototype.done = function(result) {
  if (util.isError(result)){
    this.status = 'failed';
    this.queue.emit('failed', this);
  } else {
    this.status = 'completed';
    this.queue.emit('completed', this);
  }
};

Job.prototype.delete = function() {
  this.queue.delete(this.id);
};

Job.prototype.toJSON = function() {
  var clone = {};
  for (var i in this) {
    if (this.hasOwnProperty(i)) {
      clone[i] = this[i];
    }
  }
  clone.queue = this.queue.name;
  return clone;
};

module.exports = Job;