'use strict';

//    this.timeout(5000);
/*jshint expr: true*/
/* global describe, it */

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
chai.use(require('sinon-chai'));

var Queue = require('..');

describe('Queue', function () {
  describe('#add()', function () {
    it('should add a job to the queue', function () {
      var queue = new Queue('test queue');
      queue.add({data: 'value'});
      expect(queue.length()).to.equal(1);
    });
    it('should return the job object containing an id and the data', function () {
      var data = {data: 'value'};
      var queue = new Queue('test queue');
      var job = queue.add(data);
      expect(job.id).to.exist;
      expect(job.data).to.eql(data);
    });
  });
  describe('#each()', function () {
    it('should pass all the jobs in the queue to the interator', function() {
      var queue = new Queue('test queue');
      var job1 = queue.add({job:1});
      var job2 = queue.add({job:2});
      var returnedJobs = [];
      queue.each(function (id, job) {
        expect(id).to.exist;
        returnedJobs.push(job);
      });
      expect(returnedJobs.length).to.equal(2);
      expect(returnedJobs).to.include(job1);
      expect(returnedJobs).to.include(job2);
    });
    it('should should set the context to the queue', function () {
      var queue = new Queue('test queue');
      queue.add({job:1});
      var cb = sinon.spy();
      queue.each(cb);
      expect(cb).to.have.been.calledOn(queue);
    });
  });
  describe('#get()', function () {
    it('should return a job given an id', function () {
      var queue = new Queue('test queue');
      var job1 = queue.add({job:1});
      var returnedJob = queue.get(job1.id);
      expect(returnedJob).to.equal(job1);
    });
  });
  describe('#process(fn)', function () {
    it('should call the passed function for each elegible job and with queue as content', function () {
      var queue = new Queue('test queue');
      var job1 = queue.add({job:1});
      var fn = sinon.spy();
      queue.process(fn);
      expect(fn).to.have.been.calledWith(job1);
      expect(fn).to.have.been.calledOn(queue);
    });
    it('should not call the passed function for inelegible jobs', function () {
      var queue = new Queue('test queue');
      var job1 = queue.add({job:1});
      var job2 = queue.add({job:2});
      job1.status = 'completed';
      var fn = sinon.spy();
      queue.process(fn);
      expect(fn).to.have.been.calledOnce;
      expect(fn).to.not.have.been.calledWith(job1);
      expect(fn).to.have.been.calledWith(job2);
    });
    it('should call the passed function on added jobs', function () {
      var queue = new Queue('test queue');
      var fn = sinon.spy();
      queue.process(fn);
      var job1 = queue.add({job:1});
      expect(fn).to.have.been.calledOnce;
      expect(fn).to.have.been.calledWith(job1);
    });
  });
  describe('#on(fn)', function () {
    it('should be called for completed jobs', function () {
      var queue = new Queue('test queue');
      var fn = sinon.spy();
      queue.on('completed', fn);
      var job1 = queue.add({job:1});
      queue.process(function (job, done) {
        done();
      });
      expect(fn).to.have.been.calledOnce;
      expect(fn).to.have.been.calledWith(job1);
    });
    it('should be called for failed jobs', function () {
      var queue = new Queue('test queue');
      var fn = sinon.spy();
      queue.on('failed', fn);
      var job1 = queue.add({job:1});
      queue.process(function (job, done) {
        done(new Error());
      });
      expect(fn).to.have.been.calledOnce;
      expect(fn).to.have.been.calledWith(job1);
    });
    it('should be called for job progress', function () {
      var queue = new Queue('test queue');
      var fn = sinon.spy();
      queue.on('progress', fn);
      var job1 = queue.add({job:1});
      queue.process(function (job) {
        job.progress(1);
      });
      expect(fn).to.have.been.calledOnce;
      expect(fn).to.have.been.calledWith(job1);
    });
    it('should be called for job initiation', function () {
      var queue = new Queue('test queue');
      var fn = sinon.spy();
      queue.on('started', fn);
      var job1 = queue.add({job:1});
      queue.process(function (job) {
        job.progress(1);
      });
      expect(fn).to.have.been.calledOnce;
      expect(fn).to.have.been.calledWith(job1);
    });
  });
  describe('#purge', function () {
    it('should clear completed and failed jobs', function () {
      var data = {data: 'value'};
      var queue = new Queue('test queue');
      queue.add(data);
      queue.purge();
      expect(queue.length()).to.equal(1);
      queue.process(function (job, done) {
        done();
      });
      queue.purge();
      expect(queue.length()).to.equal(0);
    });
  });
});