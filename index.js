'use strict';

/**
 * promiseify
 * @param {function} method function
 * @param {object} ctx optional ctx for method
 */
function promiseify(method, ctx) {

  // check first
  if (typeof method !== 'function') {
    throw new TypeError(String(method) + ' is not a function');
  }

  return function() {

    // runtime args
    var args = [].slice.call(arguments);

    // runtime this
    ctx = ctx || this;

    return new Promise(function(resolve, reject) {

      args.push(function(err) {
        if (err) {
          return reject(err);
        }
        var arg = [].slice.call(arguments);
        if (arg.length === 2) {
          resolve.call(this, arg[1]);
        } else {
          resolve.call(this, arg.slice(1));
        }
      });

      try {
        method.apply(ctx, args);
      } catch (err) {
        reject(err);
      }
    });
  };
}

module.exports = promiseify;