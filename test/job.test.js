'use strict';

/*jshint expr: true*/
/* global describe, it */

var chai = require('chai');
var expect = chai.expect;
//var sinon = require('sinon');
chai.use(require('sinon-chai'));

//var Job = require('../lib/job');
var Queue = require('../lib/queue');


describe('Job', function () {
  describe('#status', function () {
    it('should be \'waiting\' when created', function () {
      var queue = new Queue('test queue');
      var job1 = queue.add({data: 'job1'});
      expect(job1.status).to.equal('waiting');
    });
    it('should be \'active\' when being processed', function () {
      var queue = new Queue('test queue');
      queue.add({data: 'job1'});
      queue.process(function (job) {
        expect(job.status).to.equal('active');
      });
    });
    it('should be \'failed\' when processing fails', function () {
      var queue = new Queue('test queue');
      var job1 = queue.add({data: 'job1'});
      queue.process(function (job, done) {
        done(new Error());
      });
      expect(job1.status).to.equal('failed');
    });
    it('should be \'completed\' when processing succeeds', function () {
      var queue = new Queue('test queue');
      var job1 = queue.add({data: 'job1'});
      queue.process(function (job, done) {
        done();
      });
      expect(job1.status).to.equal('completed');
    });
  });
  describe('#error', function () {
    it('should be undefined if job completes succesfully', function () {
      var queue = new Queue('test queue');
      var job1 = queue.add({data: 'job1'});
      queue.process(function (job, done) {
        done();
      });
      expect(job1.error).to.be.undefined;
    });
    it('should contain the error if job fails', function () {
      var queue = new Queue('test queue');
      var job1 = queue.add({data: 'job1'});
      var error = new Error();
      queue.process(function (job, done) {
        done(error);
      });
      expect(job1.error).to.equal(error);
    });
  });
  describe('#result', function () {
    it('should be contain the result if job completes succesfully', function () {
      var queue = new Queue('test queue');
      var job1 = queue.add({data: 'job1'});
      var result = 'success';
      queue.process(function (job, done) {
        done(result);
      });
      expect(job1.result).to.equal(result);
    });
    it('should be undefined if job fails', function () {
      var queue = new Queue('test queue');
      var job1 = queue.add({data: 'job1'});
      var error = new Error();
      queue.process(function (job, done) {
        done(error);
      });
      expect(job1.result).to.be.undefined;
    });
  });
  describe('#delete()', function () {
    it('should delete the job from it queue', function () {
      var queue = new Queue('test queue');
      var job1 = queue.add({data: 'job1'});
      expect(queue.length()).to.equal(1);
      job1.delete();
      expect(queue.length()).to.equal(0);
    });
  });
  describe('#toJSON()', function () {
    it('should return an object representing the job suitable for JSONification', function () {
      var queue = new Queue('test queue');
      var data = {data: 'job1'};
      var job1 = queue.add(data);
      var jobJSONserialized = JSON.stringify(job1);
      var jobJSONdeserialized = JSON.parse(jobJSONserialized);

      expect(jobJSONdeserialized).to.have.property('queue').and.equal('test queue');
      expect(jobJSONdeserialized).to.have.property('id').and.equal(job1.id);
      expect(jobJSONdeserialized).to.have.property('data').and.eql(data);
      expect(jobJSONdeserialized).to.have.property('status').and.equal('waiting');
    });
  });
});