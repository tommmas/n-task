# rest-tasks

  [![License][license-img]][license-url]
  [![Build status][travis-img]][travis-url]
  [![Dependencies][david-img]][david-url]

A queue to manage the execution of tasks on the server in a REST like way.

Example (using express)
-----------------------

```javascript
var Queue = require('rest-tasks');

var commandQueue = new Queue('command-queue');

// Setup a function to process jobs
commandQueue.process(function(job, done){
  doSomeTask(job.data);
  done(); // pass error object to signal job failed
});


/* Express routes */

// Create a new task for the server to complete
app.post('/tasks', function (req, res) {
  var job = commandQueue.add(req.body.data);
  res.send(job);
});

// Get the status of the task
app.get('/tasks/:id', function (req, res) {
  var job = commandQueue.get(req.params.id);
  res.send(job);
});

// Cancel the task
app.delete('/tasks/:id', function (req, res) {
  var job = commandQueue.get(req.params..id);
  job.delete();
  res.send(job);
});


/* Events */

commandQueue.on('failed', function (job) {
  console.log('job failed: ', job);
});

commandQueue.on('complete', function (job) {
  console.log('job failed: ', job);
});

```

[travis-img]: https://travis-ci.org/tommmas/rest-tasks.svg?branch=master
[travis-url]: https://travis-ci.org/tommmas/rest-tasks
[license-img]: https://img.shields.io/badge/license-MIT-green.svg
[license-url]: LICENSE
[david-img]: https://david-dm.org/tommmas/rest-tasks.svg
[david-url]: https://david-dm.org/tommmas/rest-tasks