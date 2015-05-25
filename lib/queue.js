'use strict';

var util = require('util');
var events = require('events');
var uuid = require('node-uuid');

var Job = require('./job');
// this.emit('completed')
// this.emit('failed')
// this.emit('paused')
// this.emit('resumed')

var Queue = function (name, options) {
  events.EventEmitter.call(this);
  this.name = name;
  this.options = options;
  this.jobs = {};
};

util.inherits(Queue, events.EventEmitter);

Queue.prototype.add = function(data) { // TODO add options
  var id = uuid();
  var job = new Job(id, this, data);
  this.jobs[id] = job;
  this.run();
  return job;
};

Queue.prototype.get = function (id) {
  return this.jobs[id];
};

Queue.prototype.process = function(fn) {
  this.handler = fn;
  this.run();
};

Queue.prototype.purge = function() {
  this.each(function (id, job) {
    if (job.status === 'completed' || job.status === 'failed'){
      delete this.jobs[id];
    }
  });
};

Queue.prototype.delete = function(id) {
  delete this.jobs[id];
};

Queue.prototype.length = function() {
  return Object.keys(this.jobs).length;
};

Queue.prototype.each = function (fn) {
  var jobs = this.jobs;
  var ids = Object.keys(jobs);
  var id;
  for (var i = 0; i < ids.length; i++) {
    id = ids[i];
    fn.call(this, id, jobs[id]);
  }
};

Queue.prototype.run = function() {
  if(!this.handler) return null;
  this.each(function (id, job) {
    if (job.status === 'waiting'){
      job.status = 'active';
      this.emit('started', job);
      this.handler.call(this, job, job.done.bind(job));
    }
  });
};

module.exports = Queue;