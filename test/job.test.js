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