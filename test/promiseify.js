'use strict';

var promiseify = require('../index');
var sinon = require('sinon');

function doSome(a, b, fn) {
  setTimeout(function() {
    fn(null, a, b);
  }, 1000);
}

function doSome1(a, fn) {
  setTimeout(function() {
    fn(null, a);
  }, 1000);
}

describe('promiseify', function() {
  var clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  it('simple method', function(done) {
    var doSomeP = promiseify(doSome1);
    doSomeP('hello').then(function(arg) {
      arg.should.equal('hello');
      done();
    })
    .catch(done);
    clock.tick(1000);
  });

  it('callback 2 arguments', function(done) {
    var doSomeP = promiseify(doSome);
    doSomeP('hello', 'world').then(function(arg) {
      arg.should.eql(['hello', 'world']);
      done();
    })
    .catch(done);
    clock.tick(1000);
  });
});
