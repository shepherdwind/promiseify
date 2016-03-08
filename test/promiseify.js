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


  it('1 is not a function', function(done) {
    try {
      var doSomeP = promiseify(1);
    } catch(err) {
      err.should.be.an.instanceof(TypeError);
      err.message.should.be.equal('1 is not a function');
      done();
    }
    clock.tick(1000);
  });

  it('should keep context when provided', function(done) {
    var foo = { age: 18 };
    var fn = function(cb) {
      var self = this;
      setTimeout(function() {
        cb(null, self.age + 1);
      }, 1000);
    };

    // provide an context
    promiseify(fn, foo)()
      .then(function(num) {
        num.should.be.equal(foo.age + 1);
        done();
      })
      .catch(done);

    clock.tick(1000);
  });

  it('should get context from runtime `this`', function(done) {
    var foo = { 
      age: 18,
      fn: function(cb) {
        var self = this;
        setTimeout(function() {
          cb(null, self.age + 1);
        }, 1000);
      }
    };

    // promisify an async version
    foo.fnAsync = promiseify(foo.fn);

    // auto context
    foo.fnAsync()
      .then(function(num) {
        num.should.be.equal(foo.age + 1);
        done();
      })
      .catch(done);

    clock.tick(1000);
  });

  it('promiseify.all should work', function(done) {
    var fs = promiseify.all(require('fs'));

    // check
    fs.readFileAsync.should.be.ok;

    // call
    fs.readFileAsync(__filename, 'utf8')
      .then(function(s) {
        s.should.be.match(/promiseify/);
        done();
      })
      .catch(done);
  });
});
