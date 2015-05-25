# rest-tasks

A queue to manage the execution of tasks on the server via a REST like way.

Example (using express)
-----------------------

```
var commandQueue = new Queue('command-queue');


// Create a new task for the server to complete
app.post('/tasks', function (req, res) {
  var job = commandQueue.add(req.body.data);
  res.send(job);
});

// Get the status of the task
app.get('/tasks/:id', function (req, res) {
  var job = commandQueue.get(id);
  res.send(job);
});

// Cancel the task
app.delete('/tasks/id', function (req, res) {
  var job = commandQueue.get(id);
  job.delete();
  res.send(job);
});

```

