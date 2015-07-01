/*!
 * Chico UI v2.0.0-alpha.2
 * http://chico-ui.com.ar/
 *
 * Copyright (c) 2015, MercadoLibre.com
 * Released under the MIT license.
 * http://chico-ui.com.ar/license
 */

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.1.0
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$toString = {}.toString;
    var lib$es6$promise$asap$$vertxNext;
    function lib$es6$promise$asap$$asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        lib$es6$promise$asap$$scheduleFlush();
      }
    }

    var lib$es6$promise$asap$$default = lib$es6$promise$asap$$asap;

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertex();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$default(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (promise._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$es6$promise$utils$$isArray(input);
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;

      var length  = enumerator.length;
      var promise = enumerator.promise;
      var input   = enumerator._input;

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;

      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
          entry._onerror = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = entry;
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        enumerator._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = value;
        }
      }

      if (enumerator._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise’s eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        if (!lib$es6$promise$utils$$isFunction(resolver)) {
          lib$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
          lib$es6$promise$promise$$needsNew();
        }

        lib$es6$promise$$internal$$initializePromise(this, resolver);
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor(lib$es6$promise$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          lib$es6$promise$asap$$default(function(){
            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


(function () {
    'use strict';

    if (self.fetch) {
        return
    }

    function Headers(headers) {
        this.map = {};

        var self = this;
        if (headers instanceof Headers) {
            headers.forEach(function (name, values) {
                values.forEach(function (value) {
                    self.append(name, value)
                })
            })

        } else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function (name) {
                self.append(name, headers[name])
            })
        }
    }

    Headers.prototype.append = function (name, value) {
        name = name.toLowerCase();
        var list = this.map[name];
        if (!list) {
            list = [];
            this.map[name] = list
        }
        list.push(value)
    };

    Headers.prototype['delete'] = function (name) {
        delete this.map[name.toLowerCase()]
    };

    Headers.prototype.get = function (name) {
        var values = this.map[name.toLowerCase()]
        return values ? values[0] : null
    };

    Headers.prototype.getAll = function (name) {
        return this.map[name.toLowerCase()] || []
    };

    Headers.prototype.has = function (name) {
        return this.map.hasOwnProperty(name.toLowerCase())
    };

    Headers.prototype.set = function (name, value) {
        this.map[name.toLowerCase()] = [value]
    };

    // Instead of iterable for now.
    Headers.prototype.forEach = function (callback) {
        var self = this;
        Object.getOwnPropertyNames(this.map).forEach(function (name) {
            callback(name, self.map[name])
        })
    };

    function consumed(body) {
        if (body.bodyUsed) {
            return Promise.reject(new TypeError('Already read'))
        }
        body.bodyUsed = true
    }

    function fileReaderReady(reader) {
        return new Promise(function (resolve, reject) {
            reader.onload = function () {
                resolve(reader.result)
            };
            reader.onerror = function () {
                reject(reader.error)
            }
        })
    }

    function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        return fileReaderReady(reader)
    }

    function readBlobAsText(blob) {
        var reader = new FileReader();
        reader.readAsText(blob);
        return fileReaderReady(reader)
    }

    var support = {
        blob: 'FileReader' in self && 'Blob' in self && (function () {
            try {
                new Blob();
                return true
            } catch (e) {
                return false
            }
        })(),
        formData: 'FormData' in self
    }

    function Body() {
        this.bodyUsed = false

        if (support.blob) {
            this._initBody = function (body) {
                this._bodyInit = body;
                if (typeof body === 'string') {
                    this._bodyText = body
                } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                    this._bodyBlob = body
                } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                    this._bodyFormData = body
                } else if (!body) {
                    this._bodyText = ''
                } else {
                    throw new Error('unsupported BodyInit type')
                }
            };

            this.blob = function () {
                var rejected = consumed(this);
                if (rejected) {
                    return rejected
                }

                if (this._bodyBlob) {
                    return Promise.resolve(this._bodyBlob)
                } else if (this._bodyFormData) {
                    throw new Error('could not read FormData body as blob')
                } else {
                    return Promise.resolve(new Blob([this._bodyText]))
                }
            };

            this.arrayBuffer = function () {
                return this.blob().then(readBlobAsArrayBuffer)
            };

            this.text = function () {
                var rejected = consumed(this);
                if (rejected) {
                    return rejected
                }

                if (this._bodyBlob) {
                    return readBlobAsText(this._bodyBlob)
                } else if (this._bodyFormData) {
                    throw new Error('could not read FormData body as text')
                } else {
                    return Promise.resolve(this._bodyText)
                }
            }
        } else {
            this._initBody = function (body) {
                this._bodyInit = body;
                if (typeof body === 'string') {
                    this._bodyText = body
                } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                    this._bodyFormData = body
                } else if (!body) {
                    this._bodyText = ''
                } else {
                    throw new Error('unsupported BodyInit type')
                }
            };

            this.text = function () {
                var rejected = consumed(this)
                return rejected ? rejected : Promise.resolve(this._bodyText)
            }
        }

        if (support.formData) {
            this.formData = function () {
                return this.text().then(decode)
            }
        }

        this.json = function () {
            return this.text().then(JSON.parse)
        };

        return this
    }

    // HTTP methods whose capitalization should be normalized
    var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

    function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return (methods.indexOf(upcased) > -1) ? upcased : method
    }

    function Request(url, options) {
        options = options || {};
        this.url = url;

        this.credentials = options.credentials || 'omit';
        this.headers = new Headers(options.headers);
        this.method = normalizeMethod(options.method || 'GET');
        this.mode = options.mode || null;
        this.referrer = null;

        if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
            throw new TypeError('Body not allowed for GET or HEAD requests')
        }
        this._initBody(options.body)
    }

    function decode(body) {
        var form = new FormData();
        body.trim().split('&').forEach(function (bytes) {
            if (bytes) {
                var split = bytes.split('=');
                var name = split.shift().replace(/\+/g, ' ');
                var value = split.join('=').replace(/\+/g, ' ');
                form.append(decodeURIComponent(name), decodeURIComponent(value))
            }
        });
        return form
    }

    function headers(xhr) {
        var head = new Headers();
        var pairs = xhr.getAllResponseHeaders().trim().split('\n');
        pairs.forEach(function (header) {
            var split = header.trim().split(':');
            var key = split.shift().trim();
            var value = split.join(':').trim();
            head.append(key, value)
        });
        return head
    }

    Request.prototype.fetch = function () {
        var self = this;

        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            if (self.credentials === 'cors') {
                xhr.withCredentials = true;
            }

            function responseURL() {
                if ('responseURL' in xhr) {
                    return xhr.responseURL
                }

                // Avoid security warnings on getResponseHeader when not allowed by CORS
                if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
                    return xhr.getResponseHeader('X-Request-URL')
                }

                return;
            }

            // Use onreadystatechange instead of onload because of IE8
            xhr.onreadystatechange = function () {
                //ready?
                if (xhr.readyState !== 4) {
                    return;
                }

                //get status:
                var status = (xhr.status === 1223) ? 204 : xhr.status;
                if (status < 100 || status > 599) {
                    reject(new TypeError('Network request failed'));
                    return;
                }

                var options = {
                    status: status,
                    statusText: xhr.statusText,
                    headers: headers(xhr),
                    url: responseURL()
                };
                var body = 'response' in xhr ? xhr.response : xhr.responseText;
                resolve(new Response(body, options));
            };

            xhr.onerror = function () {
                reject(new TypeError('Network request failed'))
            };

            xhr.open(self.method, self.url, true);
            if ('responseType' in xhr && support.blob) {
                xhr.responseType = 'blob'
            }

            self.headers.forEach(function (name, values) {
                values.forEach(function (value) {
                    xhr.setRequestHeader(name, value)
                })
            });

            xhr.send(typeof self._bodyInit === 'undefined' ? null : self._bodyInit);
        })
    };

    Body.call(Request.prototype);

    function Response(bodyInit, options) {
        if (!options) {
            options = {}
        }

        this._initBody(bodyInit);
        this.type = 'default';
        this.url = null;
        this.status = options.status;
        this.statusText = options.statusText;
        this.headers = options.headers;
        this.url = options.url || '';
    }

    Body.call(Response.prototype);

    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;

    self.fetch = function (url, options) {
        return new Request(url, options).fetch()
    };
    self.fetch.polyfill = true
})();

(function(window) {
    'use strict';

    var POINTER_TYPE_TOUCH = "touch";
    var POINTER_TYPE_PEN = "pen";
    var POINTER_TYPE_MOUSE = "mouse";

    // Due to polyfill IE8 can has document.createEvent but it has no support for
    // custom Mouse Events
    var supportsMouseEvents = !!window.MouseEvent;

    // If the user agent already supports Pointer Events, do nothing
    if (window.PointerEvent) {
        return;
    }

    // The list of standardized pointer events http://www.w3.org/TR/pointerevents/
    var upperCaseEventsNames = ["PointerDown", "PointerUp", "PointerMove", "PointerOver", "PointerOut", "PointerCancel", "PointerEnter", "PointerLeave"];
    var supportedEventsNames = upperCaseEventsNames.map(function(name) {
        return name.toLowerCase();
    });

    var previousTargets = {};

    var checkPreventDefault = function (node) {
        while (node && !node.ch_forcePreventDefault) {
            node = node.parentNode;
        }
        return !!node || window.ch_forcePreventDefault;
    };

    // Touch events
    var generateTouchClonedEvent = function (sourceEvent, newName, canBubble, target, relatedTarget) {
        // Considering touch events are almost like super mouse events
        var evObj;

        if (document.createEvent && supportsMouseEvents) {
            evObj = document.createEvent('MouseEvents');
            // TODO: Replace 'initMouseEvent' with 'new MouseEvent'
            evObj.initMouseEvent(newName, canBubble, true, window, 1, sourceEvent.screenX, sourceEvent.screenY,
                sourceEvent.clientX, sourceEvent.clientY, sourceEvent.ctrlKey, sourceEvent.altKey,
                sourceEvent.shiftKey, sourceEvent.metaKey, sourceEvent.button, relatedTarget || sourceEvent.relatedTarget);
        } else {
            evObj = document.createEventObject();
            evObj.screenX = sourceEvent.screenX;
            evObj.screenY = sourceEvent.screenY;
            evObj.clientX = sourceEvent.clientX;
            evObj.clientY = sourceEvent.clientY;
            evObj.ctrlKey = sourceEvent.ctrlKey;
            evObj.altKey = sourceEvent.altKey;
            evObj.shiftKey = sourceEvent.shiftKey;
            evObj.metaKey = sourceEvent.metaKey;
            evObj.button = sourceEvent.button;
            evObj.relatedTarget = relatedTarget || sourceEvent.relatedTarget;
        }
        // offsets
        if (evObj.offsetX === undefined) {
            if (sourceEvent.offsetX !== undefined) {

                // For Opera which creates readonly properties
                if (Object && Object.defineProperty !== undefined) {
                    Object.defineProperty(evObj, "offsetX", {
                        writable: true
                    });
                    Object.defineProperty(evObj, "offsetY", {
                        writable: true
                    });
                }

                evObj.offsetX = sourceEvent.offsetX;
                evObj.offsetY = sourceEvent.offsetY;
            } else if (Object && Object.defineProperty !== undefined) {
                Object.defineProperty(evObj, "offsetX", {
                    get: function () {
                        if (this.currentTarget && this.currentTarget.offsetLeft) {
                            return sourceEvent.clientX - this.currentTarget.offsetLeft;
                        }
                        return sourceEvent.clientX;
                    }
                });
                Object.defineProperty(evObj, "offsetY", {
                    get: function () {
                        if (this.currentTarget && this.currentTarget.offsetTop) {
                            return sourceEvent.clientY - this.currentTarget.offsetTop;
                        }
                        return sourceEvent.clientY;
                    }
                });
            }
            else if (sourceEvent.layerX !== undefined) {
                evObj.offsetX = sourceEvent.layerX - sourceEvent.currentTarget.offsetLeft;
                evObj.offsetY = sourceEvent.layerY - sourceEvent.currentTarget.offsetTop;
            }
        }

        // adding missing properties

        if (sourceEvent.isPrimary !== undefined)
            evObj.isPrimary = sourceEvent.isPrimary;
        else
            evObj.isPrimary = true;

        if (sourceEvent.pressure)
            evObj.pressure = sourceEvent.pressure;
        else {
            var button = 0;

            if (sourceEvent.which !== undefined)
                button = sourceEvent.which;
            else if (sourceEvent.button !== undefined) {
                button = sourceEvent.button;
            }
            evObj.pressure = (button === 0) ? 0 : 0.5;
        }

        if (sourceEvent.rotation)
            evObj.rotation = sourceEvent.rotation;
        else
            evObj.rotation = 0;

        // Timestamp
        if (sourceEvent.hwTimestamp)
            evObj.hwTimestamp = sourceEvent.hwTimestamp;
        else
            evObj.hwTimestamp = 0;

        // Tilts
        if (sourceEvent.tiltX)
            evObj.tiltX = sourceEvent.tiltX;
        else
            evObj.tiltX = 0;

        if (sourceEvent.tiltY)
            evObj.tiltY = sourceEvent.tiltY;
        else
            evObj.tiltY = 0;

        // Width and Height
        if (sourceEvent.height)
            evObj.height = sourceEvent.height;
        else
            evObj.height = 0;

        if (sourceEvent.width)
            evObj.width = sourceEvent.width;
        else
            evObj.width = 0;

        // preventDefault
        evObj.preventDefault = function () {
            if (sourceEvent.preventDefault !== undefined)
                sourceEvent.preventDefault();
        };

        // stopPropagation
        if (evObj.stopPropagation !== undefined) {
            var current = evObj.stopPropagation;
            evObj.stopPropagation = function () {
                if (sourceEvent.stopPropagation !== undefined)
                    sourceEvent.stopPropagation();
                current.call(this);
            };
        }

        // Pointer values
        evObj.pointerId = sourceEvent.pointerId;
        evObj.pointerType = sourceEvent.pointerType;

        switch (evObj.pointerType) {// Old spec version check
            case 2:
                evObj.pointerType = POINTER_TYPE_TOUCH;
                break;
            case 3:
                evObj.pointerType = POINTER_TYPE_PEN;
                break;
            case 4:
                evObj.pointerType = POINTER_TYPE_MOUSE;
                break;
        }

        // Fire event
        if (target)
            target.dispatchEvent(evObj);
        else if (sourceEvent.target && supportsMouseEvents) {
            sourceEvent.target.dispatchEvent(evObj);
        } else {
            sourceEvent.srcElement.fireEvent("on" + getMouseEquivalentEventName(newName), evObj); // We must fallback to mouse event for very old browsers
        }
    };

    var generateMouseProxy = function (evt, eventName, canBubble, target, relatedTarget) {
        evt.pointerId = 1;
        evt.pointerType = POINTER_TYPE_MOUSE;
        generateTouchClonedEvent(evt, eventName, canBubble, target, relatedTarget);
    };

    var generateTouchEventProxy = function (name, touchPoint, target, eventObject, canBubble, relatedTarget) {
        var touchPointId = touchPoint.identifier + 2; // Just to not override mouse id

        touchPoint.pointerId = touchPointId;
        touchPoint.pointerType = POINTER_TYPE_TOUCH;
        touchPoint.currentTarget = target;

        if (eventObject.preventDefault !== undefined) {
            touchPoint.preventDefault = function () {
                eventObject.preventDefault();
            };
        }

        generateTouchClonedEvent(touchPoint, name, canBubble, target, relatedTarget);
    };

    var checkEventRegistration = function (node, eventName) {
        return node.__chGlobalRegisteredEvents && node.__chGlobalRegisteredEvents[eventName];
    };
    var findEventRegisteredNode = function (node, eventName) {
        while (node && !checkEventRegistration(node, eventName))
            node = node.parentNode;
        if (node)
            return node;
        else if (checkEventRegistration(window, eventName))
            return window;
    };

    var generateTouchEventProxyIfRegistered = function (eventName, touchPoint, target, eventObject, canBubble, relatedTarget) { // Check if user registered this event
        if (findEventRegisteredNode(target, eventName)) {
            generateTouchEventProxy(eventName, touchPoint, target, eventObject, canBubble, relatedTarget);
        }
    };

    var getMouseEquivalentEventName = function (eventName) {
        return eventName.toLowerCase().replace("pointer", "mouse");
    };

    var getPrefixEventName = function (prefix, eventName) {
        var upperCaseIndex = supportedEventsNames.indexOf(eventName);
        var newEventName = prefix + upperCaseEventsNames[upperCaseIndex];

        return newEventName;
    };

    var registerOrUnregisterEvent = function (item, name, func, enable) {
        if (item.__chRegisteredEvents === undefined) {
            item.__chRegisteredEvents = [];
        }

        if (enable) {
            if (item.__chRegisteredEvents[name] !== undefined) {
                item.__chRegisteredEvents[name]++;
                return;
            }

            item.__chRegisteredEvents[name] = 1;
            item.addEventListener(name, func, false);
        } else {

            if (item.__chRegisteredEvents.indexOf(name) !== -1) {
                item.__chRegisteredEvents[name]--;

                if (item.__chRegisteredEvents[name] !== 0) {
                    return;
                }
            }
            item.removeEventListener(name, func);
            item.__chRegisteredEvents[name] = 0;
        }
    };

    var setTouchAware = function (item, eventName, enable) {
        // Leaving tokens
        if (!item.__chGlobalRegisteredEvents) {
            item.__chGlobalRegisteredEvents = [];
        }
        if (enable) {
            if (item.__chGlobalRegisteredEvents[eventName] !== undefined) {
                item.__chGlobalRegisteredEvents[eventName]++;
                return;
            }
            item.__chGlobalRegisteredEvents[eventName] = 1;
        } else {
            if (item.__chGlobalRegisteredEvents[eventName] !== undefined) {
                item.__chGlobalRegisteredEvents[eventName]--;
                if (item.__chGlobalRegisteredEvents[eventName] < 0) {
                    item.__chGlobalRegisteredEvents[eventName] = 0;
                }
            }
        }

        var nameGenerator;
        var eventGenerator;
        if (window.MSPointerEvent) {
            nameGenerator = function (name) { return getPrefixEventName("MS", name); };
            eventGenerator = generateTouchClonedEvent;
        }
        else {
            nameGenerator = getMouseEquivalentEventName;
            eventGenerator = generateMouseProxy;
        }
        switch (eventName) {
            case "pointerenter":
            case "pointerleave":
                var targetEvent = nameGenerator(eventName);
                if (item['on' + targetEvent.toLowerCase()] !== undefined) {
                    registerOrUnregisterEvent(item, targetEvent, function (evt) { eventGenerator(evt, eventName); }, enable);
                }
                break;
        }
    };

    // Intercept addEventListener calls by changing the prototype
    var interceptAddEventListener = function (root) {
        var current = root.prototype ? root.prototype.addEventListener : root.addEventListener;

        var customAddEventListener = function (name, func, capture) {
            // Branch when a PointerXXX is used
            if (supportedEventsNames.indexOf(name) !== -1) {
                setTouchAware(this, name, true);
            }

            if (current === undefined) {
                this.attachEvent("on" + getMouseEquivalentEventName(name), func);
            } else {
                current.call(this, name, func, capture);
            }
        };

        if (root.prototype) {
            root.prototype.addEventListener = customAddEventListener;
        } else {
            root.addEventListener = customAddEventListener;
        }
    };

    // Intercept removeEventListener calls by changing the prototype
    var interceptRemoveEventListener = function (root) {
        var current = root.prototype ? root.prototype.removeEventListener : root.removeEventListener;

        var customRemoveEventListener = function (name, func, capture) {
            // Release when a PointerXXX is used
            if (supportedEventsNames.indexOf(name) !== -1) {
                setTouchAware(this, name, false);
            }

            if (current === undefined) {
                this.detachEvent(getMouseEquivalentEventName(name), func);
            } else {
                current.call(this, name, func, capture);
            }
        };
        if (root.prototype) {
            root.prototype.removeEventListener = customRemoveEventListener;
        } else {
            root.removeEventListener = customRemoveEventListener;
        }
    };

    // Hooks
    interceptAddEventListener(window);
    interceptAddEventListener(window.HTMLElement || window.Element);
    interceptAddEventListener(document);
    interceptAddEventListener(HTMLBodyElement);
    interceptAddEventListener(HTMLDivElement);
    interceptAddEventListener(HTMLImageElement);
    interceptAddEventListener(HTMLUListElement);
    interceptAddEventListener(HTMLAnchorElement);
    interceptAddEventListener(HTMLLIElement);
    interceptAddEventListener(HTMLTableElement);
    if (window.HTMLSpanElement) {
        interceptAddEventListener(HTMLSpanElement);
    }
    if (window.HTMLCanvasElement) {
        interceptAddEventListener(HTMLCanvasElement);
    }
    if (window.SVGElement) {
        interceptAddEventListener(SVGElement);
    }

    interceptRemoveEventListener(window);
    interceptRemoveEventListener(window.HTMLElement || window.Element);
    interceptRemoveEventListener(document);
    interceptRemoveEventListener(HTMLBodyElement);
    interceptRemoveEventListener(HTMLDivElement);
    interceptRemoveEventListener(HTMLImageElement);
    interceptRemoveEventListener(HTMLUListElement);
    interceptRemoveEventListener(HTMLAnchorElement);
    interceptRemoveEventListener(HTMLLIElement);
    interceptRemoveEventListener(HTMLTableElement);
    if (window.HTMLSpanElement) {
        interceptRemoveEventListener(HTMLSpanElement);
    }
    if (window.HTMLCanvasElement) {
        interceptRemoveEventListener(HTMLCanvasElement);
    }
    if (window.SVGElement) {
        interceptRemoveEventListener(SVGElement);
    }

    // Prevent mouse event from being dispatched after Touch Events action
    var touching = false;
    var touchTimer = -1;

    function setTouchTimer() {
        touching = true;
        clearTimeout(touchTimer);
        touchTimer = setTimeout(function () {
            touching = false;
        }, 700);
        // 1. Mobile browsers dispatch mouse events 300ms after touchend
        // 2. Chrome for Android dispatch mousedown for long-touch about 650ms
        // Result: Blocking Mouse Events for 700ms.
    }

    function getFirstCommonNode(x, y) {
        while (x) {
            if (x.contains(y))
                return x;
            x = x.parentNode;
        }
        return null;
    }

    //generateProxy receives a node to dispatch the event
    function dispatchPointerEnter(currentTarget, relatedTarget, generateProxy) {
        var commonParent = getFirstCommonNode(currentTarget, relatedTarget);
        var node = currentTarget;
        var nodelist = [];
        while (node && node !== commonParent) {//target range: this to the direct child of parent relatedTarget
            if (checkEventRegistration(node, "pointerenter")) //check if any parent node has pointerenter
                nodelist.push(node);
            node = node.parentNode;
        }
        while (nodelist.length > 0)
            generateProxy(nodelist.pop());
    }

    //generateProxy receives a node to dispatch the event
    function dispatchPointerLeave(currentTarget, relatedTarget, generateProxy) {
        var commonParent = getFirstCommonNode(currentTarget, relatedTarget);
        var node = currentTarget;
        while (node && node !== commonParent) {//target range: this to the direct child of parent relatedTarget
            if (checkEventRegistration(node, "pointerleave"))//check if any parent node has pointerleave
                generateProxy(node);
            node = node.parentNode;
        }
    }

    // Handling events on window to prevent unwanted super-bubbling
    // All mouse events are affected by touch fallback
    function applySimpleEventTunnels(nameGenerator, eventGenerator) {
        ["pointerdown", "pointermove", "pointerup", "pointerover", "pointerout"].forEach(function (eventName) {
            window.addEventListener(nameGenerator(eventName), function (evt) {
                if (!touching && findEventRegisteredNode(evt.target, eventName))
                    eventGenerator(evt, eventName, true);
            });
        });
        if (window['on' + nameGenerator("pointerenter").toLowerCase()] === undefined)
            window.addEventListener(nameGenerator("pointerover"), function (evt) {
                if (touching)
                    return;
                var foundNode = findEventRegisteredNode(evt.target, "pointerenter");
                if (!foundNode || foundNode === window)
                    return;
                else if (!foundNode.contains(evt.relatedTarget)) {
                    dispatchPointerEnter(foundNode, evt.relatedTarget, function (targetNode) {
                        eventGenerator(evt, "pointerenter", false, targetNode, evt.relatedTarget);
                    });
                }
            });
        if (window['on' + nameGenerator("pointerleave").toLowerCase()] === undefined)
            window.addEventListener(nameGenerator("pointerout"), function (evt) {
                if (touching)
                    return;
                var foundNode = findEventRegisteredNode(evt.target, "pointerleave");
                if (!foundNode || foundNode === window)
                    return;
                else if (!foundNode.contains(evt.relatedTarget)) {
                    dispatchPointerLeave(foundNode, evt.relatedTarget, function (targetNode) {
                        eventGenerator(evt, "pointerleave", false, targetNode, evt.relatedTarget);
                    });
                }
            });
    }

    (function () {
        if (window.MSPointerEvent) {
            //IE 10
            applySimpleEventTunnels(
                function (name) { return getPrefixEventName("MS", name); },
                generateTouchClonedEvent);
        }
        else {
            applySimpleEventTunnels(getMouseEquivalentEventName, generateMouseProxy);

            // Handling move on window to detect pointerleave/out/over
            if (window.ontouchstart !== undefined) {
                window.addEventListener('touchstart', function (eventObject) {
                    for (var i = 0; i < eventObject.changedTouches.length; ++i) {
                        var touchPoint = eventObject.changedTouches[i];
                        previousTargets[touchPoint.identifier] = touchPoint.target;

                        generateTouchEventProxyIfRegistered("pointerover", touchPoint, touchPoint.target, eventObject, true);

                        //pointerenter should not be bubbled
                        dispatchPointerEnter(touchPoint.target, null, function (targetNode) {
                            generateTouchEventProxy("pointerenter", touchPoint, targetNode, eventObject, false);
                        });

                        generateTouchEventProxyIfRegistered("pointerdown", touchPoint, touchPoint.target, eventObject, true);
                    }
                    setTouchTimer();
                });

                window.addEventListener('touchend', function (eventObject) {
                    for (var i = 0; i < eventObject.changedTouches.length; ++i) {
                        var touchPoint = eventObject.changedTouches[i];
                        var currentTarget = previousTargets[touchPoint.identifier];

                        generateTouchEventProxyIfRegistered("pointerup", touchPoint, currentTarget, eventObject, true);
                        generateTouchEventProxyIfRegistered("pointerout", touchPoint, currentTarget, eventObject, true);

                        //pointerleave should not be bubbled
                        dispatchPointerLeave(currentTarget, null, function (targetNode) {
                            generateTouchEventProxy("pointerleave", touchPoint, targetNode, eventObject, false);
                        });
                    }
                    setTouchTimer();
                });

                window.addEventListener('touchmove', function (eventObject) {
                    for (var i = 0; i < eventObject.changedTouches.length; ++i) {
                        var touchPoint = eventObject.changedTouches[i];
                        var newTarget = document.elementFromPoint(touchPoint.clientX, touchPoint.clientY);
                        var currentTarget = previousTargets[touchPoint.identifier];

                        // If force preventDefault
                        if (currentTarget && checkPreventDefault(currentTarget) === true)
                            eventObject.preventDefault();

                        generateTouchEventProxyIfRegistered("pointermove", touchPoint, currentTarget, eventObject, true);

                        if (currentTarget === newTarget) {
                            continue; // We can skip this as the pointer is effectively over the current target
                        }

                        if (currentTarget) {
                            // Raise out
                            generateTouchEventProxyIfRegistered("pointerout", touchPoint, currentTarget, eventObject, true, newTarget);

                            // Raise leave
                            if (!currentTarget.contains(newTarget)) { // Leave must be called if the new target is not a child of the current
                                dispatchPointerLeave(currentTarget, newTarget, function (targetNode) {
                                    generateTouchEventProxy("pointerleave", touchPoint, targetNode, eventObject, false, newTarget);
                                });
                            }
                        }

                        if (newTarget) {
                            // Raise over
                            generateTouchEventProxyIfRegistered("pointerover", touchPoint, newTarget, eventObject, true, currentTarget);

                            // Raise enter
                            if (!newTarget.contains(currentTarget)) { // Leave must be called if the new target is not the parent of the current
                                dispatchPointerEnter(newTarget, currentTarget, function (targetNode) {
                                    generateTouchEventProxy("pointerenter", touchPoint, targetNode, eventObject, false, currentTarget);
                                })
                            }
                        }
                        previousTargets[touchPoint.identifier] = newTarget;
                    }
                    setTouchTimer();
                });

                window.addEventListener('touchcancel', function (eventObject) {
                    for (var i = 0; i < eventObject.changedTouches.length; ++i) {
                        var touchPoint = eventObject.changedTouches[i];

                        generateTouchEventProxyIfRegistered("pointercancel", touchPoint, previousTargets[touchPoint.identifier], eventObject, true);
                    }
                });
            }
        }
    })();

    // Extension to navigator
    if (navigator.pointerEnabled === undefined) {

        // Indicates if the browser will fire pointer events for pointing input
        navigator.pointerEnabled = true;

        // IE
        if (navigator.msPointerEnabled) {
            navigator.maxTouchPoints = navigator.msMaxTouchPoints;
        }
    }
})(window);

/**
 * Normalizes touch/touch+click events into a 'pointertap' event that is not
 * part of standard.
 * Uses pointerEvents polyfill or native PointerEvents when supported.
 *
 * @example
 * // Use pointertap as fastclick on touch enabled devices
 * document.querySelector('.btn').addEventListener(ch.pointertap, function(e) {
 *   console.log('tap');
 * });
 */
(function () {
    'use strict';

    // IE8 has no support for custom Mouse Events, fallback to onclick
    if (!window.MouseEvent) {
        return;
    }

    var POINTER_TYPE_TOUCH = "touch";
    var POINTER_TYPE_PEN = "pen";
    var POINTER_TYPE_MOUSE = "mouse";

    var isScrolling = false;
    var scrollTimeout = false;
    var sDistX = 0;
    var sDistY = 0;
    var activePointer;

    window.addEventListener('scroll', function () {
        if (!isScrolling) {
            sDistX = window.pageXOffset;
            sDistY = window.pageYOffset;
        }
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
            isScrolling = false;
            sDistX = 0;
            sDistY = 0;
        }, 100);
    });

    window.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointerup', pointerUp);
    window.addEventListener('pointerleave', pointerLeave);

    window.addEventListener('pointermove', function (e) {});

    /**
     * Handles the 'pointerdown' event from pointerEvents polyfill or native PointerEvents when supported.
     *
     * @private
     * @param {MouseEvent|PointerEvent} e Event.
     */
    function pointerDown(e) {
        // don't register an activePointer if more than one touch is active.
        var singleFinger = e.pointerType === POINTER_TYPE_MOUSE ||
            e.pointerType === POINTER_TYPE_PEN ||
            (e.pointerType === POINTER_TYPE_TOUCH && e.isPrimary);

        if (!isScrolling && singleFinger) {
            activePointer = {
                id: e.pointerId,
                clientX: e.clientX,
                clientY: e.clientY,
                x: (e.x || e.pageX),
                y: (e.y || e.pageY),
                type: e.pointerType
            }
        }
    }

    /**
     * Handles the 'pointerleave' event from pointerEvents polyfill or native PointerEvents when supported.
     *
     * @private
     * @param {MouseEvent|PointerEvent} e Event.
     */
    function pointerLeave(e) {
        activePointer = null;
    }

    /**
     * Handles the 'pointerup' event from pointerEvents polyfill or native PointerEvents when supported.
     *
     * @private
     * @param {MouseEvent|PointerEvent} e Event.
     */
    function pointerUp(e) {
        // Does our event is the same as the activePointer set by pointerdown?
        if (activePointer && activePointer.id === e.pointerId) {
            // Have we moved too much?
            if (Math.abs(activePointer.x - (e.x || e.pageX)) < 5 &&
                Math.abs(activePointer.y - (e.y || e.pageY)) < 5) {
                // Have we scrolled too much?
                if (!isScrolling ||
                    (Math.abs(sDistX - window.pageXOffset) < 5 &&
                    Math.abs(sDistY - window.pageYOffset) < 5)) {
                    makePointertapEvent(e);
                }
            }
        }
        activePointer = null;
    }

    /**
     * Creates the pointertap event that is not part of standard.
     *
     * @private
     * @param {MouseEvent|PointerEvent} sourceEvent An event to use as a base for pointertap.
     */
    function makePointertapEvent(sourceEvent) {
        var evt = document.createEvent('MouseEvents');
        var newTarget = document.elementFromPoint(sourceEvent.clientX, sourceEvent.clientY);

        // TODO: Replace 'initMouseEvent' with 'new MouseEvent'
        evt.initMouseEvent('pointertap', true, true, window, 1, sourceEvent.screenX, sourceEvent.screenY,
            sourceEvent.clientX, sourceEvent.clientY, sourceEvent.ctrlKey, sourceEvent.altKey,
            sourceEvent.shiftKey, sourceEvent.metaKey, sourceEvent.button, newTarget);

        evt.maskedEvent = sourceEvent;
        newTarget.dispatchEvent(evt);

        return evt;
    }
})();


(function (window) {
	'use strict';

var ch = function(selector, context) {
            if (!context) {
                context = document;
            } else if (typeof context === 'string') {
                context = document.querySelector(context);
            }
            // Since NodeList is an array-like object but Array.isArray is always falsy
            // we should detect the NodeList
            // Please replace NodeList detection with `context instanceof NodeList && context.length > 0`
            //   when IE8 support will be dropped
            // Please replace Object.prototype.hasOwnProperty.call with `context.hasOwnProperty` when IE8
            //   support will be dropped
            if (typeof context === 'object' &&
                /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(context)) &&
                Object.prototype.hasOwnProperty.call(context, 'length') && context.length > 0 && context[0].nodeType > 0) {
                context = context[0];
            }

            if (context === null || !context.nodeType) {
                context = document;
            }

            return context.querySelectorAll(selector);
        },

        /**
         * Reference to the window.
         * @private
         * @type {Object}
         */
        window = window,

        /**
         * Reference to the navigator object.
         * @private
         * @type {Object}
         */
        navigator = window.navigator,

        /**
         * Reference to the userAgent.
         * @private
         * @type {String}
         */
        userAgent = navigator.userAgent,

        /**
         * Reference to the HTMLDocument.
         * @private
         * @type {Object}
         */
        document = window.document,

        /**
         * Reference to the HTMLBodyElement.
         * @private
         * @type {HTMLBodyElement}
         */
        body = document.body,

        /**
         * Reference to the HTMLElement.
         * @private
         * @type {HTMLhtmlElement}
         */
        html = document.documentElement,

        /**
         * Reference to the Object Contructor.
         * @private
         * @constructor
         */
        Object = window.Object,

        /**
         * Reference to the Array Contructor.
         * @private
         * @constructor
         */
        Array = window.Array;

ch.util = {

        /**
         * Returns true if an object is an array, false if it is not.
         *
         * @memberof ch.util
         * @method
         * @param {Object} obj The object to be checked.
         * @returns {Boolean}
         * @example
         * ch.util.isArray([1, 2, 3]); // true
         */
        'isArray': (function () {
            if (typeof Array.isArray === 'function') {
                return Array.isArray;
            }

            return function (obj) {
                if (obj === undefined) {
                    throw new Error('"ch.util.isArray(obj)": It must receive a parameter.');
                }

                return (Object.prototype.toString.call(obj) === '[object Array]');
            };
        }()),

        /**
         * Checks if the url given is right to load content.
         *
         * @memberof ch.util
         * @param {String} url The url to be checked.
         * @returns {Boolean}
         * @example
         * ch.util.isUrl('www.chico-ui.com.ar'); // true
         */
        'isUrl': function (url) {
            if (url === undefined || typeof url !== 'string') {
                return false;
            }

            /*
            # RegExp

            https://github.com/mercadolibre/chico/issues/579#issuecomment-5206670

            ```javascript
            1   1.1                        1.2   1.3  1.4       1.5       1.6                   2                      3               4                    5
            /^(((https|http|ftp|file):\/\/)|www\.|\.\/|(\.\.\/)+|(\/{1,2})|(\d{1,3}\.){3}\d{1,3})(((\w+|-)(\.?)(\/?))+)(\:\d{1,5}){0,1}(((\w+|-)(\.?)(\/?))+)((\?)(\w+=(\w?)+(&?))+)?$/
            ```

            ## Description
            1. Checks for the start of the URL
                1. if starts with a protocols followed by :// Example: file://chico
                2. if start with www followed by . (dot) Example: www.chico
                3. if starts with ./
                4. if starts with ../ and can repeat one or more times
                5. if start with double slash // Example: //chico.server
                6. if start with an ip address
            2. Checks the domain
              letters, dash followed by a dot or by a slash. All this group can repeat one or more times
            3. Ports
             Zero or one time
            4. Idem to point two
            5. QueryString pairs

            ## Allowed URLs
            1. http://www.mercadolibre.com
            2. http://mercadolibre.com/
            3. http://mercadolibre.com:8080?hola=
            4. http://mercadolibre.com/pepe
            5. http://localhost:2020
            6. http://192.168.1.1
            7. http://192.168.1.1:9090
            8. www.mercadolibre.com
            9. /mercadolibre
            10. /mercadolibre/mercado
            11. /tooltip?siteId=MLA&categId=1744&buyingMode=buy_it_now&listingTypeId=bronze
            12. ./pepe
            13. ../../mercado/
            14. www.mercadolibre.com?siteId=MLA&categId=1744&buyingMode=buy_it_now&listingTypeId=bronze
            15. www.mercado-libre.com
            16. http://ui.ml.com:8080/ajax.html

            ## Forbiden URLs
            1. http://
            2. http://www&
            3. http://hola=
            4. /../../mercado/
            5. /mercado/../pepe
            6. mercadolibre.com
            7. mercado/mercado
            8. localhost:8080/mercadolibre
            9. pepe/../pepe.html
            10. /pepe/../pepe.html
            11. 192.168.1.1
            12. localhost:8080/pepe
            13. localhost:80-80
            14. www.mercadolibre.com?siteId=MLA&categId=1744&buyi ngMode=buy_it_now&listingTypeId=bronze
            15. `<asd src="www.mercadolibre.com">`
            16. Mercadolibre.................
            17. /laksjdlkasjd../
            18. /..pepe..
            19. /pepe..
            20. pepe:/
            21. /:pepe
            22. dadadas.pepe
            23. qdasdasda
            24. http://ui.ml.com:8080:8080/ajax.html
            */
            return ((/^(((https|http|ftp|file):\/\/)|www\.|\.\/|(\.\.\/)+|(\/{1,2})|(\d{1,3}\.){3}\d{1,3})(((\w+|-)(\.?)(\/?))+)(\:\d{1,5}){0,1}(((\w+|-)(\.?)(\/?)(#?))+)((\?)(\w+=(\w?)+(&?))+)?(\w+#\w+)?$/).test(url));
        },

        /**
         * Detects an Internet Explorer and returns the version if so.
         *
         * @memberof ch.util
         * @see From <a href="https://github.com/ded/bowser/blob/master/bowser.js">bowser</a>
         * @returns {Boolean|Number}
         */
        'isMsie': function() {
            return (/(msie|trident)/i).test(navigator.userAgent) ?
                navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
        },

        /**
         * Adds CSS rules to disable text selection highlighting.
         *
         * @memberof ch.util
         * @param {HTMLElement} HTMLElement to disable text selection highlighting.
         * @example
         * ch.util.avoidTextSelection(document.querySelector('.menu nav'), document.querySelector('.menu ol'));
         */
        'avoidTextSelection': function () {
            var args = arguments,
                len = arguments.length,
                i = 0;

            if (arguments.length < 1) {
                throw new Error('"ch.util.avoidTextSelection(HTMLElement);": At least one Element is required.');
            }

            for (i; i < len; i += 1) {

                if (ch.util.classList(html).contains('lt-ie10')) {
                    args[i].setAttribute('unselectable', 'on');

                } else {
                    ch.util.classList(args[i]).add('ch-user-no-select');
                }

            }
        },

        /**
         * Gives the final used values of all the CSS properties of an element.
         *
         * @memberof ch.util
         * @param {HTMLElement} el The HTMLElement for which to get the computed style.
         * @param {string} prop The name of the CSS property to test.
         * @returns {CSSStyleDeclaration}
         * @link http://www.quirksmode.org/dom/getstyles.html
         * @example
         * ch.util.getStyles(HTMLElement, 'color'); // true
         */
        'getStyles': function (el, prop) {

            if (el === undefined || !(el.nodeType === 1)) {
                throw new Error('"ch.util.getStyles(el, prop)": The "el" parameter is required and must be a HTMLElement.');
            }

            if (prop === undefined || typeof prop !== 'string') {
                throw new Error('"ch.util.getStyles(el, prop)": The "prop" parameter is required and must be a string.');
            }

            if (window.getComputedStyle) {
                return window.getComputedStyle(el, "").getPropertyValue(prop);
            // IE
            } else {
                // Turn style name into camel notation
                prop = prop.replace(/\-(\w)/g, function (str, $1) { return $1.toUpperCase(); });
                return el.currentStyle[prop];
            }
        },

        /**
         * Returns a shallow-copied clone of the object.
         *
         * @memberof ch.util
         * @param {Object} obj The object to copy.
         * @returns {Object}
         * @example
         * ch.util.clone(object);
         */
        'clone': function (obj) {
            if (obj === undefined || typeof obj !== 'object') {
                throw new Error('"ch.util.clone(obj)": The "obj" parameter is required and must be a object.');
            }

            var copy = {},
                prop;

            for (prop in obj) {
                if (obj[prop] !== undefined) {
                    copy[prop] = obj[prop];
                }
            }

            return copy;
        },

        /**
         * Inherits the prototype methods from one constructor into another. The parent will be accessible through the obj.super property.
         *
         * @memberof ch.util
         * @param {Function} obj The object that have new members.
         * @param {Function} superConstructor The construsctor Class.
         * @returns {Object}
         * @exampleDescription
         * @example
         * ch.util.inherit(obj, parent);
         */
        'inherits': function (obj, superConstructor) {

            if (obj === undefined || typeof obj !== 'function') {
                throw new Error('"ch.util.inherits(obj, superConstructor)": The "obj" parameter is required and must be a constructor function.');
            }

            if (superConstructor === undefined || typeof superConstructor !== 'function') {
                throw new Error('"ch.util.inherits(obj, superConstructor)": The "superConstructor" parameter is required and must be a constructor function.');
            }

            var child = obj.prototype || {};
            obj.prototype = ch.util.extend(child, superConstructor.prototype);

            return superConstructor.prototype;
        },

        /**
         * Prevent default actions of a given event.
         *
         * @memberof ch.util
         * @param {Event} event The event ot be prevented.
         * @returns {Object}
         * @example
         * ch.util.prevent(event);
         */
        prevent: function (event) {
            if (typeof event === 'object' && event.preventDefault) {
                event.preventDefault();
            } else {
                return false;
            }
        },

        /**
         * Get the current vertical and horizontal positions of the scroll bar.
         *
         * @memberof ch.util
         * @returns {Object}
         * @example
         * ch.util.getScroll();
         */
        'getScroll': function () {
            return {
                'left': window.pageXOffset || document.documentElement.scrollLeft || 0,
                'top': window.pageYOffset || document.documentElement.scrollTop || 0
            };
        },

        /**
         * Get the current outer dimensions of an element.
         *
         * @memberof ch.util
         * @param {HTMLElement} el A given HTMLElement.
         * @returns {Object}
         * @example
         * ch.util.getOuterDimensions(el);
         */
        'getOuterDimensions': function (el) {
            var obj = el.getBoundingClientRect();

            return {
                'width': (obj.right - obj.left),
                'height': (obj.bottom - obj.top)
            };
        },

        /**
         * Get the current offset of an element.
         *
         * @memberof ch.util
         * @param {HTMLElement} el A given HTMLElement.
         * @returns {Object}
         * @example
         * ch.util.getOffset(el);
         */
        'getOffset': function (el) {

            var rect = el.getBoundingClientRect(),
                fixedParent = ch.util.getPositionedParent(el, 'fixed'),
                scroll = ch.util.getScroll(),
                offset = {
                    'left': rect.left,
                    'top': rect.top
                };

            if (ch.util.getStyles(el, 'position') !== 'fixed' && fixedParent === null) {
                offset.left += scroll.left;
                offset.top += scroll.top;
            }

            return offset;
        },

        /**
         * Get the current parentNode with the given position.
         *
         * @memberof ch.util
         * @param {HTMLElement} el A given HTMLElement.
         * @param {String} position A given position (static, relative, fixed or absolute).
         * @returns {HTMLElement}
         * @example
         * ch.util.getPositionedParent(el, 'fixed');
         */
        'getPositionedParent': function (el, position) {
            var currentParent = el.offsetParent,
                parent;

            while (parent === undefined) {

                if (currentParent === null) {
                    parent = null;
                    break;
                }

                if (ch.util.getStyles(currentParent, 'position') !== position) {
                    currentParent = currentParent.offsetParent;
                } else {
                    parent = currentParent;
                }

            };

            return parent;
        },

        /**
         * Reference to the vendor prefix of the current browser.
         *
         * @constant
         * @memberof ch.util
         * @type {String}
         * @link http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser
         * @example
         * ch.util.VENDOR_PREFIX === 'webkit';
         */
        'VENDOR_PREFIX': (function () {

            var regex = /^(Webkit|Khtml|Moz|ms|O)(?=[A-Z])/,
                styleDeclaration = document.getElementsByTagName('script')[0].style,
                prop;

            for (prop in styleDeclaration) {
                if (regex.test(prop)) {
                    return prop.match(regex)[0].toLowerCase();
                }
            }

            // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
            // However (prop in style) returns the correct value, so we'll have to test for
            // the precence of a specific property
            if ('WebkitOpacity' in styleDeclaration) { return 'webkit'; }
            if ('KhtmlOpacity' in styleDeclaration) { return 'khtml'; }

            return '';
        }()),

        /**
         * zIndex values.
         * @type {Number}
         * @example
         * ch.util.zIndex += 1;
         */
        'zIndex': 1000,

        /**
         * Add or remove class
         *
         * @name classList
         * @memberof ch.util
         * @param {HTMLElement} el A given HTMLElement.
         * @see Based on: <a href="http://youmightnotneedjquery.com/" target="_blank">http://youmightnotneedjquery.com/</a>
         * @example
         * ch.util.classList(document.body).add('ch-example');
         */
        'classList': function (el) {
            var isClassList = el.classList;

            return {
                'add': function add(className) {
                    if (isClassList) {
                        el.classList.add(className);
                    } else {
                        el.setAttribute('class', el.getAttribute('class') + ' ' + className);
                    }
                },
                'remove': function remove(className) {
                    if (isClassList) {
                        el.classList.remove(className)
                    } else {
                        el.setAttribute('class', el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '));
                    }
                },
                'contains': function contains(className) {
                    var exist;
                    if (isClassList) {
                        exist = el.classList.contains(className);
                    } else {
                        exist = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
                    }
                    return exist;
                }
            }
        },

        /**
         * Extends an object with other object
         *
         * @name extend
         * @memberof ch.util
         * @method
         * @param {Object} target The destination of the other objects
         * @param {Object} obj1 The objects to be merged
         * @param {Object} objn The objects to be merged
         * @see Based on: <a href="https://github.com/jquery" target="_blank">https://github.com/jquery/</a>
         * @example
         * ch.util.extend(target, obj1, objn);
         */
        'extend': function() {
            var options,
                name,
                src,
                copy,
                copyIsArray,
                clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;

                // Skip the boolean and the target
                target = arguments[i] || {};
                i++;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && !typeof target === 'function') {
                target = {};
            }

            // Nothing to extend, return original object
            if (length <= i) {
                return target;
            }

            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) != null) {
                    // Extend the base object
                    for ( name in options ) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if ( target === copy ) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (ch.util.isPlainObject(copy) || (copyIsArray = ch.util.isArray(copy)) ) ) {

                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && ch.util.isArray(src) ? src : [];

                            } else {
                                clone = src && ch.util.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = ch.util.extend( deep, clone, copy );

                        // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        },

        'isPlainObject': function(obj) {
            // Not plain objects:
            // - Any object or value whose internal [[Class]] property is not "[object Object]"
            // - DOM nodes
            // - window
            if (typeof obj !== "object" || obj.nodeType || (obj != null && obj === obj.window)) {
                return false;
            }

            if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }

            // If the function hasn't returned already, we're confident that
            // |obj| is a plain object, created by {} or constructed with new Object
            return true;
        },

        // review this method :S
        'parentElement': function(el, tagname) {
            var parent = el.parentNode,
                tag = tagname ? tagname.toUpperCase() : tagname;

            if (parent === null) { return parent; }

            // IE8 and earlier don't define the node type constants, 1 === document.ELEMENT_NODE
            if (parent.nodeType !== 1) {
                return this.parentElement(parent, tag);
            }

            if (tagname !== undefined && parent.tagName === tag) {
                return parent;
            } else if (tagname !== undefined && parent.tagName !== tag) {
                return this.parentElement(parent, tag);
            } else if (tagname === undefined) {
                return parent;
            }

        },

        /**
         * IE8 safe method to get the next element sibling
         *
         * @memberof ch.util
         * @param {HTMLElement} el A given HTMLElement.
         * @returns {HTMLElement}
         * @example
         * ch.util.nextElementSibling(el);
         */
        'nextElementSibling': function(element) {
            function next(el) {
                do {
                    el = el.nextSibling;
                } while (el && el.nodeType !== 1);

                return el;
            }

            return element.nextElementSibling || next(element);
        },

        /**
         * JSONP handler based on Promises
         *
         * @memberof ch.util
         * @method
         * @param {String} url
         * @param {Object} [options] Optional options.
         * @param {String} [options.callback] Callback prefix. Default: "__jsonp"
         * @param {String} [options.param] QS parameter. Default: "callback"
         * @param {Number} [options.timeout] How long after the request until a timeout error
         *   will occur. Default: 15000
         *
         * @returns {Object} Returns a response promise and a cancel handler.
         *
         * @example
         * var req = ch.util.loadJSONP('http://suggestgz.mlapps.com/sites/MLA/autosuggest?q=smartphone&v=1');
         * req.promise
         *   .then(function(results){
         *     console.log(results)
         *   })
         *   .catch(function(err){
         *     console.error(err);
         *   });
         * if (something) {
         *   req.cancel();
         * }
         */
        loadJSONP: (function() {
            var noop = function() {},
                // document.head is not available in IE<9
                head = document.getElementsByTagName('head')[0],
                jsonpCount = 0;

            return function (url, options) {
                var script,
                    timer,
                    cleanup,
                    promise,
                    cancel;

                options = ch.util.extend({
                    prefix: '__jsonp',
                    param: 'callback',
                    timeout : 15000
                }, options);

                // Generate a unique id for the request.
                var id = options.prefix + (jsonpCount++);

                cleanup = function() {
                    // Remove the script tag.
                    if (script && script.parentNode) {
                        script.parentNode.removeChild(script);
                    }

                    window[id] = noop;

                    if (timer) {
                        clearTimeout(timer);
                    }
                };

                promise = new Promise(function(resolve, reject) {
                    if (options.timeout) {
                        timer = setTimeout(function() {
                            cleanup();
                            reject(new Error('Timeout'));
                        }, options.timeout);
                    }

                    window[id] = function(data) {
                        cleanup();
                        resolve(data);
                    };

                    // Add querystring component
                    url += (~url.indexOf('?') ? '&' : '?') + options.param + '=' + encodeURIComponent(id);
                    url = url.replace('?&', '?');

                    // Create script element
                    script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = url;
                    script.onerror = function(e) {
                        cleanup();
                        reject(new Error(e.message || 'Script Error'));
                    };
                    head.appendChild(script);

                    // TODO: move cancel fn definition outside of promise
                    cancel = function() {
                        if (window[id]) {
                            cleanup();
                            reject(new Error('Canceled'));
                        }
                    };
                });

                return {
                    promise: promise,
                    cancel: cancel
                };
            }
        })()
    };
ch.support = {

        /**
         * Verify that CSS Transitions are supported (or any of its browser-specific implementations).
         *
         * @static
         * @type {Boolean|Object}
         * @example
         * if (ch.support.transition) {
         *     // Some code here!
         * }
         */
        'transition': transitionEnd(),

        /**
         * Verify that CSS Animations are supported (or any of its browser-specific implementations).
         *
         * @static
         * @type {Boolean|Object}
         * @example
         * if (ch.support.animation) {
         *     // Some code here!
         * }
         */
        'animation': animationEnd(),

        /**
         * Checks is the User Agent supports touch events.
         * @type {Boolean}
         * @example
         * if (ch.support.touch) {
         *     // Some code here!
         * }
         */
        'touch': 'ontouchend' in document,

        /**
         * Checks is the User Agent supports custom events.
         * @type {Boolean}
         * @example
         * if (ch.support.customEvent) {
         *     // Some code here!
         * }
         */
        'customEvent': (function() {
            // TODO: find better solution for CustomEvent check
            try {
                // IE8 has no support for CustomEvent, in IE gte 9 it cannot be
                // instantiated but exist
                new CustomEvent(name, data);
                return true;
            } catch (e) {
                return false;
            }
        })()
    };

    /**
     * Checks for the CSS Transitions support (http://www.modernizr.com/)
     *
     * @function
     * @private
     */
    function transitionEnd() {
        var el = document.createElement('ch');

        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        };

        for (var name in transEndEventNames) {
            if (transEndEventNames.hasOwnProperty(name) && el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }

        return false;
    }

    /**
     * Checks for the CSS Animations support
     *
     * @function
     * @private
     */
    function animationEnd() {
        var el = document.createElement('ch');

        var animEndEventNames = {
            WebkitAnimation : 'webkitAnimationEnd',
            MozAnimation    : 'animationend',
            OAnimation      : 'oAnimationEnd oanimationend',
            animation       : 'animationend'
        };

        for (var name in animEndEventNames) {
            if (animEndEventNames.hasOwnProperty(name) && el.style[name] !== undefined) {
                return { end: animEndEventNames[name] }
            }
        }

        return false;
    }

ch.onlayoutchange = 'layoutchange';

/**
 * Equivalent to 'resize'.
 * @constant
 * @memberof ch
 * @type {String}
 */
ch.onresize = 'resize';

/**
 * Equivalent to 'scroll'.
 * @constant
 * @memberof ch
 * @type {String}
 */
ch.onscroll = 'scroll';

/**
 * Equivalent to 'pointerdown' or 'mousedown', depending on browser capabilities.
 *
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerdown | Pointer Events W3C Recommendation
 */
ch.onpointerdown = window.MouseEvent ? 'pointerdown' : 'mousedown';

/**
 * Equivalent to 'pointerup' or 'mouseup', depending on browser capabilities.
 *
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerup | Pointer Events W3C Recommendation
 */
ch.onpointerup = window.MouseEvent ? 'pointerup' : 'mouseup';

/**
 * Equivalent to 'pointermove' or 'mousemove', depending on browser capabilities.
 *
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointermove | Pointer Events W3C Recommendation
 */
ch.onpointermove = window.MouseEvent ? 'pointermove' : 'mousemove';

/**
 * Equivalent to 'pointertap' or 'click', depending on browser capabilities.
 *
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#list-of-pointer-events | Pointer Events W3C Recommendation
 */
ch.onpointertap = (ch.support.touch && window.MouseEvent) ? 'pointertap' : 'click';

/**
 * Equivalent to 'pointerenter' or 'mouseenter', depending on browser capabilities.
 *
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerenter | Pointer Events W3C Recommendation
 */
ch.onpointerenter = window.MouseEvent ? 'pointerenter' : 'mouseenter';

/**
 * Equivalent to 'pointerleave' or 'mouseleave', depending on browser capabilities.
 *
 * @constant
 * @memberof ch
 * @type {String}
 * @link http://www.w3.org/TR/pointerevents/#dfn-pointerleave | Pointer Events W3C Recommendation
 */
ch.onpointerleave = window.MouseEvent ? 'pointerleave' : 'mouseleave';

/**
 * The DOM input event that is fired when the value of an <input> or <textarea>
 * element is changed. Equivalent to 'input' or 'keydown', depending on browser
 * capabilities.
 *
 * @constant
 * @memberof ch
 * @type {String}
 */
ch.onkeyinput = ('oninput' in document.createElement('input')) ? 'input' : 'keydown';

/**
 * Event utility
 *
 * @constant
 * @memberof ch
 * @type {Object}
 */
ch.Event = (function () {
    var isStandard = document.addEventListener ? true : false,
        addHandler = isStandard ? 'addEventListener' : 'attachEvent',
        removeHandler = isStandard ? 'removeEventListener' : 'detachEvent',
        dispatch = isStandard ? 'dispatchEvent' : 'fireEvent',
        _custom = {};

    function evtUtility(evt) {
        return isStandard ? evt : ('on' + evt);
    }

    return {
        /**
         * Crossbrowser implementation of {HTMLElement}.addEventListener.
         *
         * @memberof ch.Event
         * @type {Function}
         * @param {HTMLElement} el An HTMLElement to add listener to
         * @param {String} evt Event name
         * @param {Function} fn Event handler function
         * @param {Boolean} bubbles Whether or not to be propagated to outer elements.
         * @example
         * ch.Event.addListener(document, 'click', function(){}, false);
         */
        'addListener': function addListener(el, evt, fn, bubbles) {
            el[addHandler](evtUtility(evt), fn, bubbles || false);
        },
        /**
         * Attach a handler to an event for the {HTMLElement} that executes only
         * once.
         *
         * @memberof ch.Event
         * @type {Function}
         * @param {HTMLElement} el An HTMLElement to add listener to
         * @param {String} evt Event name
         * @param {Function} fn Event handler function
         * @param {Boolean} bubbles Whether or not to be propagated to outer elements.
         * @example
         * ch.Event.addListenerOne(document, 'click', function(){}, false);
         */
        'addListenerOne': function addListener(el, evt, fn, bubbles) {

            function oneRemove() {
                el[removeHandler](evtUtility(evt), fn);
            }

            // must remove the event after executes one time
            el[addHandler](evtUtility(evt), fn, bubbles || false);
            // TODO: Review this method, looks like has wrong behavior when listener should be removed
            el[addHandler](evtUtility(evt), function () {
                oneRemove()
            }, bubbles || false);
        },
        /**
         * Crossbrowser implementation of {HTMLElement}.removeEventListener.
         *
         * @memberof ch.Event
         * @type {Function}
         * @param {HTMLElement} el An HTMLElement to remove listener from
         * @param {String} evt Event name
         * @param {Function} fn Event handler function to remove
         * @example
         * ch.Event.removeListener(document, 'click', fn);
         */
        'removeListener': function removeListener(el, evt, fn) {
            el[removeHandler](evtUtility(evt), fn);
        },
        /**
         * Crossbrowser implementation of {HTMLElement}.removeEventListener.
         *
         * @memberof ch.Event
         * @type {Function}
         * @param {HTMLElement} el An HTMLElement to dispatch event to
         * @param {String|Event} evt Event name or event object
         * @example
         * ch.Event.dispatchEvent(document, 'click');
         */
        'dispatchEvent': function dispatchEvent(el, e) {
            var event = e;

            if (typeof e === 'string') {
                event = document.createEvent('Event');
                event.initEvent(e, true, true);
            }
            el[dispatch](event);
        },
        /**
         * Dispatches the custom event that is not the part of standard DOM Event
         *
         * @memberof ch.Event
         * @type {Function}
         * @param {HTMLElement} el An HTMLElement to dispatch event to
         * @param {String} name Custom event name
         * @param {Object} params Optional event params that should be passed to an event
         * @example
         * ch.Event.dispatchCustomEvent(document, ch.onlayoutchange, {
         *   bubbles: true,
         *   cancelable: false,
         *   detail: {
         *     x: 123
         *   }
         * });
         */
        'dispatchCustomEvent': function dispatchCustomEvent(el, name, params) {
            if (!_custom[name]) {
                var data = ch.util.extend({
                        bubbles: false,
                        cancelable: false,
                        detail: undefined
                    }, params),
                    eventName = window.CustomEvent ? 'CustomEvent' : 'Event';

                if (ch.support.customEvent) {
                    _custom[name] = new CustomEvent(name, data);
                } else {
                    _custom[name] = document.createEvent(eventName);
                    _custom[name]['init' + eventName](name, data.bubbles, data.cancelable, data.detail);
                }
            }

            el[dispatch](_custom[name]);
        }
    }
}());

ch.onkeytab = 'tab';

    /**
     * Enter key event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeyenter = 'enter';

    /**
     * Esc key event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeyesc = 'esc';

    /**
     * Left arrow key event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeyleftarrow = 'left_arrow';

    /**
     * Up arrow key event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeyuparrow = 'up_arrow';

    /**
     * Rigth arrow key event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeyrightarrow = 'right_arrow';

    /**
     * Down arrow key event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeydownarrow = 'down_arrow';

    /**
     * Backspace key event.
     * @constant
     * @memberof ch
     * @type {String}
     */
    ch.onkeybackspace = 'backspace';
ch.factory = function (Klass) {
        /**
         * Identification of the constructor, in lowercases.
         * @type {String}
         */
        var name = Klass.prototype.name;

        // Uses the function.name property (non-standard) on the newest browsers OR
        // uppercases the first letter from the identification name of the constructor
        ch[(name.charAt(0).toUpperCase() + name.substr(1))] = Klass;
    };

    // Remove the no-js classname from html tag
    ch.util.classList(html).remove('no-js');

	ch.version = '2.0.0-alpha.2';
	window.ch = ch;
}(this));
(function (ch) {
    'use strict';

    /**
     * Event Emitter Class for the browser.
     * @memberof ch
     * @constructor
     * @returns {Object} Returns a new instance of EventEmitter.
     * @example
     * // Create a new instance of EventEmitter.
     * var emitter = new ch.EventEmitter();
     * @example
     * // Inheriting from EventEmitter.
     * ch.util.inherits(Component, ch.EventEmitter);
     */
    function EventEmitter() {}

    /**
     * Adds a listener to the collection for a specified event.
     * @memberof! ch.EventEmitter.prototype
     * @function
     * @param {String} event The event name to subscribe.
     * @param {Function} listener Listener function.
     * @param {Boolean} once Indicate if a listener function will be called only one time.
     * @returns {component}
     * @example
     * // Will add an event listener to 'ready' event.
     * component.on('ready', listener);
     */
    EventEmitter.prototype.on = function (event, listener, once) {

        if (event === undefined) {
            throw new Error('ch.EventEmitter - "on(event, listener)": It should receive an event.');
        }

        if (listener === undefined) {
            throw new Error('ch.EventEmitter - "on(event, listener)": It should receive a listener function.');
        }

        this._eventsCollection = this._eventsCollection || {};

        listener.once = once || false;

        if (this._eventsCollection[event] === undefined) {
            this._eventsCollection[event] = [];
        }

        this._eventsCollection[event].push(listener);

        return this;
    };

    /**
     * Adds a listener to the collection for a specified event to will execute only once.
     * @memberof! ch.EventEmitter.prototype
     * @function
     * @param {String} event Event name.
     * @param {Function} listener Listener function.
     * @returns {component}
     * @example
     * // Will add an event handler to 'contentLoad' event once.
     * component.once('contentLoad', listener);
     */
    EventEmitter.prototype.once = function (event, listener) {

        this.on(event, listener, true);

        return this;
    };

    /**
     * Removes a listener from the collection for a specified event.
     * @memberof! ch.EventEmitter.prototype
     * @function
     * @param {String} event Event name.
     * @param {Function} listener Listener function.
     * @returns {component}
     * @example
     * // Will remove event listener to 'ready' event.
     * component.off('ready', listener);
     */
    EventEmitter.prototype.off = function (event, listener) {

        if (event === undefined) {
            throw new Error('EventEmitter - "off(event, listener)": It should receive an event.');
        }

        if (listener === undefined) {
            throw new Error('EventEmitter - "off(event, listener)": It should receive a listener function.');
        }

        var listeners = this._eventsCollection[event],
            i = 0,
            len;

        if (listeners !== undefined) {
            len = listeners.length;
            for (i; i < len; i += 1) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }

        return this;
    };

    /**
     * Returns all listeners from the collection for a specified event.
     * @memberof! ch.EventEmitter.prototype
     * @function
     * @param {String} event The event name.
     * @returns {Array}
     * @example
     * // Returns listeners from 'ready' event.
     * component.getListeners('ready');
     */
    EventEmitter.prototype.getListeners = function (event) {
        if (event === undefined) {
            throw new Error('ch.EventEmitter - "getListeners(event)": It should receive an event.');
        }

        return this._eventsCollection[event];
    };

    /**
     * Execute each item in the listener collection in order with the specified data.
     * @memberof! ch.EventEmitter.prototype
     * @function
     * @param {String} event The name of the event you want to emit.
     * @param {...Object} var_args Data to pass to the listeners.
     * @returns {component}
     * @example
     * // Will emit the 'ready' event with 'param1' and 'param2' as arguments.
     * component.emit('ready', 'param1', 'param2');
     */
    EventEmitter.prototype.emit = function () {

        var args = Array.prototype.slice.call(arguments, 0), // converted to array
            event = args.shift(), // Store and remove events from args
            listeners,
            i = 0,
            len;

        if (event === undefined) {
            throw new Error('ch.EventEmitter - "emit(event)": It should receive an event.');
        }

        if (typeof event === 'string') {
            event = {'type': event};
        }

        if (!event.target) {
            event.target = this;
        }

        if (this._eventsCollection !== undefined && this._eventsCollection[event.type] !== undefined) {
            listeners = this._eventsCollection[event.type];
            len = listeners.length;

            for (i; i < len; i += 1) {
                listeners[i].apply(this, args);

                if (listeners[i].once) {
                    this.off(event.type, listeners[i]);
                    len -= 1;
                    i -= 1;
                }
            }
        }

        return this;
    };

    // Expose EventEmitter
    ch.EventEmitter = EventEmitter;

}(this.ch));
(function (ch, fetch) {
    'use strict';

    /**
     * Add a function to manage components content.
     * @memberOf ch
     * @mixin
     * @returns {Function}
     */
    function Content() {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            defaults = {
                'method': this._options.method,
                'params': this._options.params,
                'cache': this._options.cache,
                'async': this._options.async,
                'waiting': this._options.waiting
            };

        /**
         * Set async content into component's container and emits the current event.
         * @private
         */
        function setAsyncContent(event) {

            that._content.innerHTML = event.response;

            /**
             * Event emitted when the content change.
             * @event ch.Content#contentchange
             * @private
             */
            that.emit('_contentchange');

            /**
             * Event emitted if the content is loaded successfully.
             * @event ch.Content#contentdone
             * @ignore
             */

            /**
             * Event emitted when the content is loading.
             * @event ch.Content#contentwaiting
             * @example
             * // Subscribe to "contentwaiting" event.
             * component.on('contentwaiting', function (event) {
             *     // Some code here!
             * });
             */

            /**
             * Event emitted if the content isn't loaded successfully.
             * @event ch.Content#contenterror
             * @example
             * // Subscribe to "contenterror" event.
             * component.on('contenterror', function (event) {
             *     // Some code here!
             * });
             */

            that.emit('content' + event.status, event);
        }

        /**
         * Set content into component's container and emits the contentdone event.
         * @private
         */
        function setContent(content) {

            if (content.nodeType !== undefined) {
                that._content.innerHTML = '';
                that._content.appendChild(content);
            } else {
                that._content.innerHTML = content;
            }


            that._options.cache = true;

            /**
             * Event emitted when the content change.
             * @event ch.Content#contentchange
             * @private
             */
            that.emit('_contentchange');

            /**
             * Event emitted if the content is loaded successfully.
             * @event ch.Content#contentdone
             * @example
             * // Subscribe to "contentdone" event.
             * component.on('contentdone', function (event) {
             *     // Some code here!
             * });
             */
            that.emit('contentdone');
        }

        /**
         * Get async content with given URL.
         * @private
         */
        function getAsyncContent(url, options) {
            var requestCfg;
            // Initial options to be merged with the user's options
            options = ch.util.extend({
                'method': 'GET',
                'params': '',
                'waiting': '<div class="ch-loading-large"></div>'
            }, options || defaults);

            // Set loading
            setAsyncContent({
                'status': 'waiting',
                'response': options.waiting
            });

            requestCfg = {
                method: options.method,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                cache: 'default'
            };

            if (options.cache !== undefined) {
                that._options.cache = options.cache;
            }

            if (options.cache === false && ['GET', 'HEAD'].indexOf(options.method.toUpperCase()) === 0) {
                requestCfg.cache = 'no-cache';
            }

            if (options.params) {
                url += (url.indexOf('?') !== -1 || options.params[0] === '?' ? '' : '?') + options.params;
            }

            // Make a request
            fetch(url, requestCfg)
                .then(function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        return response.text();
                    } else {
                        return this.reject(new Error(response.statusText));
                    }
                })
                .then(function(body) {
                    // Send the result data to the client
                    setAsyncContent({
                        'status': 'done',
                        'response': body
                    });
                })
                ['catch'](function(err) {
                    // Send a defined error message
                    setAsyncContent({
                        'status': 'error',
                        'response': '<p>Error on ajax call.</p>',

                        // Grab all the parameters into a JSON to send to the client
                        'data': err
                    });
                });
        }

        /**
         * Allows to manage the components content.
         * @function
         * @memberof! ch.Content#
         * @param {(String | HTMLElement)} content The content that will be used by a component.
         * @param {Object} [options] A custom options to be used with content loaded by ajax.
         * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
         * @param {String} [options.params] Params like query string to be sent to the server.
         * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true. false value will work only with HEAD and GET requests
         * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
         * @example
         * // Update content with some string.
         * component.content('Some new content here!');
         * @example
         * // Update content that will be loaded by ajax with custom options.
         * component.content('http://chico-ui.com.ar/ajax', {
         *     'cache': false,
         *     'params': 'x-request=true'
         * });
         */
        this.content = function (content, options) {
            var parent;

            // Returns the last updated content.
            if (content === undefined) {
                return that._content.innerHTML;
            }

            that._options.content = content;

            if (that._options.cache === undefined) {
                that._options.cache = true;
            }

            if (typeof content === 'string') {
                // Case 1: AJAX call
                if (ch.util.isUrl(content)) {
                    getAsyncContent(content, options);
                // Case 2: Plain text
                } else {
                    setContent(content);
                }
            // Case 3: HTML Element
            } else if (content.nodeType !== undefined) {

                ch.util.classList(content).remove('ch-hide');
                parent = ch.util.parentElement(content);

                setContent(content);

                if (!that._options.cache) {
                    parent.removeChild(content);
                }

            }

            return that;
        };

        // Loads content once. If the cache is disabled the content loads in each show.
        this.once('_show', function () {

            that.content(that._options.content);

            that.on('show', function () {
                if (!that._options.cache) {
                    that.content(that._options.content);
                }
            });
        });
    }

    ch.Content = Content;

}(this.ch, this.fetch));

(function (ch) {
    'use strict';

    var toggleEffects = {
        'slideDown': 'slideUp',
        'slideUp': 'slideDown',
        'fadeIn': 'fadeOut',
        'fadeOut': 'fadeIn'
    };

    /**
     * The Collapsible class gives to components the ability to shown or hidden its container.
     * @memberOf ch
     * @mixin
     * @returns {Function} Returns a private function.
     */
    function Collapsible() {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            triggerClass = 'ch-' + this.name + '-trigger-on',
            fx = this._options.fx,
            useEffects = (ch.support.transition && fx !== 'none' && fx !== false),
            pt, pb;

        function showCallback(e) {
            if (useEffects) {
                ch.util.classList(that.container).remove('ch-fx-' + fx);

                // TODO: Use original height when it is defined
                if (/^slide/.test(fx)) {
                    that.container.style.height = '';
                }
            }
            ch.util.classList(that.container).remove('ch-hide');
            that.container.setAttribute('aria-hidden', 'false');

            if (e) {
                e.target.removeEventListener(e.type, showCallback);
            }

            /**
             * Event emitted when the component is shown.
             * @event ch.Collapsible#show
             * @example
             * // Subscribe to "show" event.
             * collapsible.on('show', function () {
             *     // Some code here!
             * });
             */
            that.emit('show');
        }

        function hideCallback(e) {
            if (useEffects) {
                ch.util.classList(that.container).remove('ch-fx-' + toggleEffects[fx]);
                that.container.style.display = '';
                if (/^slide/.test(fx)) {
                    that.container.style.height = '';
                }
            }
            ch.util.classList(that.container).add('ch-hide');
            that.container.setAttribute('aria-hidden', 'true');

            if (e) {
                e.target.removeEventListener(e.type, hideCallback);
            }

            /**
             * Event emitted when the component is hidden.
             * @event ch.Collapsible#hide
             * @example
             * // Subscribe to "hide" event.
             * collapsible.on('hide', function () {
             *     // Some code here!
             * });
             */
            that.emit('hide');
        }

        this._shown = false;

        /**
         * Shows the component container.
         * @function
         * @private
         */
        this._show = function () {

            that._shown = true;

            if (that.trigger !== undefined) {
                ch.util.classList(that.trigger).add(triggerClass);
            }

            /**
             * Event emitted before the component is shown.
             * @event ch.Collapsible#beforeshow
             * @example
             * // Subscribe to "beforeshow" event.
             * collapsible.on('beforeshow', function () {
             *     // Some code here!
             * });
             */
            that.emit('beforeshow');

            // Animate or not
            if (useEffects) {
                var _h = 0;

                // Be sure to remove an opposite class that probably exist and
                // transitionend listener for an opposite transition, aka $.fn.stop(true, true)
                ch.Event.removeListener(that.container, ch.support.transition.end, hideCallback);
                ch.util.classList(that.container).remove('ch-fx-' + toggleEffects[fx]);

                ch.Event.addListener(that.container, ch.support.transition.end, showCallback);

                // Reveal an element before the transition
                that.container.style.display = 'block';

                // Set margin and padding to 0 to prevent content jumping at the transition end
                if (/^slide/.test(fx)) {
                    // Cache the original paddings for the first time
                    if (!pt || !pb) {
                        pt = ch.util.getStyles(that.container, 'padding-top');
                        pb = ch.util.getStyles(that.container, 'padding-bottom');

                        that.container.style.marginTop = that.container.style.marginBottom =
                            that.container.style.paddingTop = that.container.style.paddingBottom ='0px';
                    }

                    that.container.style.opacity = '0.01';
                    _h = that.container.offsetHeight;
                    that.container.style.opacity = '';
                    that.container.style.height = '0px';
                }

                // Transition cannot be applied at the same time when changing the display property
                setTimeout(function() {
                    if (/^slide/.test(fx)) {
                        that.container.style.height = _h + 'px';
                    }
                    that.container.style.paddingTop = pt;
                    that.container.style.paddingBottom = pb;
                    ch.util.classList(that.container).add('ch-fx-' + fx);
                }, 0);
            } else {
                showCallback();
            }

            that.emit('_show');

            return that;
        };

        /**
         * Hides the component container.
         * @function
         * @private
         */
        this._hide = function () {

            that._shown = false;

            if (that.trigger !== undefined) {
                ch.util.classList(that.trigger).remove(triggerClass);
            }

            /**
             * Event emitted before the component is hidden.
             * @event ch.Collapsible#beforehide
             * @example
             * // Subscribe to "beforehide" event.
             * collapsible.on('beforehide', function () {
             *     // Some code here!
             * });
             */
            that.emit('beforehide');

            // Animate or not
            if (useEffects) {
                // Be sure to remove an opposite class that probably exist and
                // transitionend listener for an opposite transition, aka $.fn.stop(true, true)
                ch.Event.removeListener(that.container, ch.support.transition.end, showCallback);
                ch.util.classList(that.container).remove('ch-fx-' + fx);

                ch.Event.addListener(that.container, ch.support.transition.end, hideCallback);
                // Set margin and padding to 0 to prevent content jumping at the transition end
                if (/^slide/.test(fx)) {
                    that.container.style.height = ch.util.getStyles(that.container, 'height');
                    // Uses nextTick to trigger the height change
                    setTimeout(function() {
                        that.container.style.height = '0px';
                        that.container.style.paddingTop = that.container.style.paddingBottom ='0px';
                        ch.util.classList(that.container).add('ch-fx-' + toggleEffects[fx]);
                    }, 0);
                } else {
                    setTimeout(function() {
                        ch.util.classList(that.container).add('ch-fx-' + toggleEffects[fx]);
                    }, 0);
                }
            } else {
                hideCallback();
            }

            return that;
        };

        /**
         * Shows or hides the component.
         * @function
         * @private
         */
        this._toggle = function () {

            if (that._shown) {
                that.hide();
            } else {
                that.show();
            }

            return that;
        };

        this.on('disable', this.hide);
    }

    ch.Collapsible = Collapsible;

}(this.ch));
(function (window, ch) {
    'use strict';

    var resized = false,
        scrolled = false,
        requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        }());

    function update() {

        var eve = (resized ? ch.onresize : ch.onscroll);

        // Refresh viewport
        this.refresh();

        // Change status
        resized = false;
        scrolled = false;

        /**
         * Event emitted when the dimensions of the viewport changes.
         * @event ch.viewport#resize
         * @example
         * ch.viewport.on('resize', function () {
         *     // Some code here!
         * });
         */

        /**
         * Event emitted when the viewport is scrolled.
         * @event ch.viewport#scroll
         * @example
         * ch.viewport.on('scroll', function () {
         *     // Some code here!
         * });
         */

        // Emits the current event
        this.emit(eve);
    }

    /**
     * The Viewport is a component to ease viewport management. You can get the dimensions of the viewport and beyond, which can be quite helpful to perform some checks with JavaScript.
     * @memberof ch
     * @constructor
     * @augments ch.EventEmitter
     * @requires ch.util
     * @returns {viewport} Returns a new instance of Viewport.
     */
    function Viewport() {
        this._init();
    }

    ch.util.inherits(Viewport, ch.EventEmitter);

    /**
     * Initialize a new instance of Viewport.
     * @memberof! ch.Viewport.prototype
     * @function
     * @private
     * @returns {viewport}
     */
    Viewport.prototype._init = function () {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * Element representing the visible area.
         * @memberof! ch.viewport#element
         * @type {Object}
         */
        this.el = window;

        this.refresh();


        function viewportResize() {
            // No changing, exit
            if (!resized) {
                resized = true;

                /**
                 * requestAnimationFrame
                 */
                requestAnimFrame(function updateResize() {
                    update.call(that);
                });
            }
        };

        function viewportScroll() {
            // No changing, exit
            if (!scrolled) {
                scrolled = true;

                /**
                 * requestAnimationFrame
                 */
                requestAnimFrame(function updateScroll() {
                    update.call(that);
                });
            }
        };

        window.addEventListener(ch.onscroll, viewportScroll, false);
        window.addEventListener(ch.onresize, viewportResize, false);
    };

    /**
     * Calculates/updates the client rects of viewport (in pixels).
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {viewport}
     * @example
     * // Update the client rects of the viewport.
     * ch.viewport.calculateClientRect();
     */
    Viewport.prototype.calculateClientRect = function () {
        /**
         * The current top client rect of the viewport (in pixels).
         * @public
         * @name ch.Viewport#top
         * @type {Number}
         * @example
         * // Checks if the top client rect of the viewport is equal to 0.
         * (ch.viewport.top === 0) ? 'Yes': 'No';
         */

         /**
         * The current left client rect of the viewport (in pixels).
         * @public
         * @name ch.Viewport#left
         * @type {Number}
         * @example
         * // Checks if the left client rect of the viewport is equal to 0.
         * (ch.viewport.left === 0) ? 'Yes': 'No';
         */
        this.top = this.left = 0;

        /**
         * The current bottom client rect of the viewport (in pixels).
         * @public
         * @name ch.Viewport#bottom
         * @type {Number}
         * @example
         * // Checks if the bottom client rect of the viewport is equal to a number.
         * (ch.viewport.bottom === 900) ? 'Yes': 'No';
         */
        this.bottom = Math.max(this.el.innerHeight || 0, document.documentElement.clientHeight);

        /**
         * The current right client rect of the viewport (in pixels).
         * @public
         * @name ch.Viewport#right
         * @type {Number}
         * @example
         * // Checks if the right client rect of the viewport is equal to a number.
         * (ch.viewport.bottom === 1200) ? 'Yes': 'No';
         */
        this.right = Math.max(this.el.innerWidth || 0, document.documentElement.clientWidth);

        return this;
    };

    /**
     * Calculates/updates the dimensions (width and height) of the viewport (in pixels).
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {viewport}
     * @example
     * // Update the dimensions values of the viewport.
     * ch.viewport.calculateDimensions();
     */
    Viewport.prototype.calculateDimensions = function () {
        this.calculateClientRect();

        /**
         * The current height of the viewport (in pixels).
         * @public
         * @name ch.Viewport#height
         * @type Number
         * @example
         * // Checks if the height of the viewport is equal to a number.
         * (ch.viewport.height === 700) ? 'Yes': 'No';
         */
        this.height = this.bottom;

        /**
         * The current width of the viewport (in pixels).
         * @public
         * @name ch.Viewport#width
         * @type Number
         * @example
         * // Checks if the height of the viewport is equal to a number.
         * (ch.viewport.width === 1200) ? 'Yes': 'No';
         */
        this.width = this.right;

        return this;
    };

    /**
     * Calculates/updates the viewport position.
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {viewport}
     * @example
     * // Update the offest values of the viewport.
     * ch.viewport.calculateOffset();
     */
    Viewport.prototype.calculateOffset = function () {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var scroll = ch.util.getScroll();

        /**
         * The offset top of the viewport.
         * @memberof! ch.Viewport#offsetTop
         * @type {Number}
         * @example
         * // Checks if the offset top of the viewport is equal to a number.
         * (ch.viewport.offsetTop === 200) ? 'Yes': 'No';
         */
        this.offsetTop = scroll.top;

        /**
         * The offset left of the viewport.
         * @memberof! ch.Viewport#offsetLeft
         * @type {Number}
         * @example
         * // Checks if the offset left of the viewport is equal to a number.
         * (ch.viewport.offsetLeft === 200) ? 'Yes': 'No';
         */
        this.offsetLeft = scroll.left;

        /**
         * The offset right of the viewport.
         * @memberof! ch.Viewport#offsetRight
         * @type {Number}
         * @example
         * // Checks if the offset right of the viewport is equal to a number.
         * (ch.viewport.offsetRight === 200) ? 'Yes': 'No';
         */
        this.offsetRight = this.left + this.width;

        /**
         * The offset bottom of the viewport.
         * @memberof! ch.Viewport#offsetBottom
         * @type {Number}
         * @example
         * // Checks if the offset bottom of the viewport is equal to a number.
         * (ch.viewport.offsetBottom === 200) ? 'Yes': 'No';
         */
        this.offsetBottom = this.offsetTop + this.height;

        return this;
    };

    /**
     * Rertuns/updates the viewport orientation: landscape or portrait.
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {viewport}
     * @example
     * // Update the dimensions values of the viewport.
     * ch.viewport.calculateDimensions();
     */
    Viewport.prototype.calculateOrientation = function () {
        /** The viewport orientation: landscape or portrait.
         * @memberof! ch.Viewport#orientation
         * @type {String}
         * @example
         * // Checks if the orientation is "landscape".
         * (ch.viewport.orientation === 'landscape') ? 'Yes': 'No';
         */
        this.orientation = (Math.abs(this.el.orientation) === 90) ? 'landscape' : 'portrait';

        return this;
    };

    /**
     * Calculates if an element is completely located in the viewport.
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {Boolean}
     * @params {HTMLElement} el A given HMTLElement.
     * @example
     * // Checks if an element is in the viewport.
     * ch.viewport.inViewport(HTMLElement) ? 'Yes': 'No';
     */
    Viewport.prototype.inViewport = function (el) {
        var r = el.getBoundingClientRect();

        return (r.top > 0) && (r.right < this.width) && (r.bottom < this.height) && (r.left > 0);
    };

    /**
     * Calculates if an element is visible in the viewport.
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {Boolean}
     * @params {HTMLElement} el A given HTMLElement.
     * @example
     * // Checks if an element is visible.
     * ch.viewport.isVisisble(HTMLElement) ? 'Yes': 'No';
     */
    Viewport.prototype.isVisible = function (el) {
        var r = el.getBoundingClientRect();

        return (r.height >= this.offsetTop);
    };

    /**
     * Upadtes the viewport dimension, viewport positions and orietation.
     * @memberof! ch.Viewport.prototype
     * @function
     * @returns {viewport}
     * @example
     * // Refreshs the viewport.
     * ch.viewport.refresh();
     */
    Viewport.prototype.refresh = function () {
        this.calculateDimensions();
        this.calculateOffset();
        this.calculateOrientation();

        return this;
    };

    // Creates an instance of the Viewport into ch namespace.
    ch.viewport = new Viewport();

}(this, this.ch));
(function (window, ch) {
    'use strict';

    /**
     * The Positioner lets you position elements on the screen and changes its positions.
     * @memberof ch
     * @constructor
     * @param {Object} options Configuration object.
     * @param {String} options.target A HTMLElement that reference to the element to be positioned.
     * @param {String} [options.reference] A HTMLElement that it's a reference to position and size of element that will be considered to carry out the position. If it isn't defined through configuration, it will be the ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {String} [options.align] The align options where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] Thethe type of positioning used. You must use: "absolute" or "fixed". Default: "fixed".
     * @requires ch.util
     * @requires ch.Viewport
     * @returns {positioner} Returns a new instance of Positioner.
     * @example
     * // Instance the Positioner It requires a little configuration.
     * // The default behavior place an element center into the Viewport.
     * var positioned = new ch.Positioner({
     *     'target': document.querySelector('.target'),
     *     'reference': document.querySelector('.reference'),
     *     'side': 'top',
     *     'align': 'left',
     *     'offsetX': 20,
     *     'offsetY': 10
     * });
     * @example
     * // offsetX: The Positioner could be configurated with an offsetX.
     * // This example show an element displaced horizontally by 10px of defined position.
     * var positioned = new ch.Positioner({
     *     'target': document.querySelector('.target'),
     *     'reference': document.querySelector('.reference'),
     *     'side': 'top',
     *     'align': 'left',
     *     'offsetX': 10
     * });
     * @example
     * // offsetY: The Positioner could be configurated with an offsetY.
     * // This example show an element displaced vertically by 10px of defined position.
     * var positioned = new ch.Positioner({
     *     'target': document.querySelector('.target'),
     *     'reference': document.querySelector('.reference'),
     *     'side': 'top',
     *     'align': 'left',
     *     'offsetY': 10
     * });
     * @example
     * // positioned: The positioner could be configured to work with fixed or absolute position value.
     * var positioned = new ch.Positioner({
     *     'target': document.querySelector('.target'),
     *     'reference': document.querySelector('.reference'),
     *     'position': 'fixed'
     * });
     */
    function Positioner(options) {

        if (options === undefined) {
            throw new window.Error('ch.Positioner: Expected options defined.');
        }

        // Creates its private options
        this._options = ch.util.clone(this._defaults);

        // Init
        this._configure(options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Positioner.prototype
     * @type {String}
     */
    Positioner.prototype.name = 'positioner';

    /**
     * Returns a reference to the Constructor function that created the instance's prototype.
     * @memberof! ch.Positioner.prototype
     * @function
     * @private
     */
    Positioner.prototype._constructor = Positioner;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Positioner.prototype._defaults = {
        'offsetX': 0,
        'offsetY': 0,
        'side': 'center',
        'align': 'center',
        'reference': ch.viewport,
        'position': 'fixed'
    };

    /**
     * Configures the positioner instance with a given options.
     * @memberof! ch.Positioner.prototype
     * @function
     * @private
     * @returns {positioner}
     * @params {Object} options A configuration object.
     */
    Positioner.prototype._configure = function (options) {

        // Merge user options with its options
        ch.util.extend(this._options, options);

        this._options.offsetX = parseInt(this._options.offsetX, 10);
        this._options.offsetY = parseInt(this._options.offsetY, 10);

        /**
         * Reference to the element to be positioned.
         * @type {HTMLElement}
         */
        this.target = options.target || this.target;


        /**
         * It's a reference to position and size of element that will be considered to carry out the position.
         * @type {HTMLElement}
         */
        this.reference = options.reference || this.reference;
        this._reference = this._options.reference;

        this.target.style.position = this._options.position;

        return this;
    };

    /**
     * Updates the current position with a given options
     * @memberof! ch.Positioner.prototype
     * @function
     * @returns {positioner}
     * @params {Object} options A configuration object.
     * @example
     * // Updates the current position.
     * positioned.refresh();
     * @example
     * // Updates the current position with new offsetX and offsetY.
     * positioned.refresh({
     *     'offestX': 100,
     *     'offestY': 10
     * });
     */
    Positioner.prototype.refresh = function (options) {

        if (options !== undefined) {
            this._configure(options);
        }

        if (this._reference !== ch.viewport) {
            this._calculateReference();
        }

        this._calculateTarget();

        // the object that stores the top, left reference to set to the target
        this._setPoint();

        return this;
    };

    /**
     * Calculates the reference (element or ch.viewport) of the position.
     * @memberof! ch.Positioner.prototype
     * @function
     * @private
     * @returns {positioner}
     */
    Positioner.prototype._calculateReference = function () {

        var reference = this.reference,
            offset;

        reference.setAttribute('data-side', this._options.side);
        reference.setAttribute('data-align', this._options.align);

        this._reference = ch.util.getOuterDimensions(reference);

        if (reference.offsetParent === this.target.offsetParent) {
            this._reference.left = reference.offsetLeft;
            this._reference.top = reference.offsetTop;

        } else {
            offset = ch.util.getOffset(reference);
            this._reference.left = offset.left;
            this._reference.top = offset.top;
        }

        return this;
    };

    /**
     * Calculates the positioned element.
     * @memberof! ch.Positioner.prototype
     * @function
     * @private
     * @returns {positioner}
     */
    Positioner.prototype._calculateTarget = function () {

        var target = this.target;
        target.setAttribute('data-side', this._options.side);
        target.setAttribute('data-align', this._options.align);

        this._target = ch.util.getOuterDimensions(target);

        return this;
    };

    /**
     * Calculates the points.
     * @memberof! ch.Positioner.prototype
     * @function
     * @private
     * @returns {positioner}
     */
    Positioner.prototype._setPoint = function () {
        var side = this._options.side,
            orientation = (side === 'top' || side === 'bottom') ? 'horizontal' : ((side === 'right' || side === 'left') ? 'vertical' : 'center'),
            coors,
            orientationMap;

        // take the side and calculate the alignment and make the CSSpoint
        if (orientation === 'center') {
            // calculates the coordinates related to the center side to locate the target
            coors = {
                'top': (this._reference.top + (this._reference.height / 2 - this._target.height / 2)),
                'left': (this._reference.left + (this._reference.width / 2 - this._target.width / 2))
            };

        } else if (orientation === 'horizontal') {
            // calculates the coordinates related to the top or bottom side to locate the target
            orientationMap = {
                'left': this._reference.left,
                'center': (this._reference.left + (this._reference.width / 2 - this._target.width / 2)),
                'right': (this._reference.left + this._reference.width - this._target.width),
                'top': this._reference.top - this._target.height,
                'bottom': (this._reference.top + this._reference.height)
            };

            coors = {
                'top': orientationMap[side],
                'left': orientationMap[this._options.align]
            };

        } else {
            // calculates the coordinates related to the right or left side to locate the target
            orientationMap = {
                'top': this._reference.top,
                'center': (this._reference.top + (this._reference.height / 2 - this._target.height / 2)),
                'bottom': (this._reference.top + this._reference.height - this._target.height),
                'right': (this._reference.left + this._reference.width),
                'left': (this._reference.left - this._target.width)
            };

            coors = {
                'top': orientationMap[this._options.align],
                'left': orientationMap[side]
            };
        }

        coors.top += this._options.offsetY;
        coors.left += this._options.offsetX;

        this.target.style.top = coors.top + 'px';
        this.target.style.left = coors.left + 'px';

        return this;
    };

    ch.Positioner = Positioner;

}(this, this.ch));
(function (window, ch) {
    'use strict';

    var document = window.document,
        codeMap = {
            '8': ch.onkeybackspace,
            '9': ch.onkeytab,
            '13': ch.onkeyenter,
            '27': ch.onkeyesc,
            '37': ch.onkeyleftarrow,
            '38': ch.onkeyuparrow,
            '39': ch.onkeyrightarrow,
            '40': ch.onkeydownarrow
        },

        /**
         * Shortcuts
         * @memberof ch
         * @namespace
         */
        shortcuts = {

            '_active': null,

            '_queue': [],

            '_collection': {},

            /**
             * Add a callback to a shortcut with given name.
             * @param {(ch.onkeybackspace | ch.onkeytab | ch.onkeyenter | ch.onkeyesc | ch.onkeyleftarrow | ch.onkeyuparrow | ch.onkeyrightarrow | ch.onkeydownarrow)} shortcut Shortcut to subscribe.
             * @param {String} name A name to add in the collection.
             * @param {Function} callback A given function.
             * @returns {Object} Retuns the ch.shortcuts.
             * @example
             * // Add a callback to ESC key with "component" name.
             * ch.shortcuts.add(ch.onkeyesc, 'component', component.hide);
             */
            'add': function (shortcut, name, callback) {

                if (this._collection[name] === undefined) {
                    this._collection[name] = {};
                }

                if (this._collection[name][shortcut] === undefined) {
                    this._collection[name][shortcut] = [];
                }

                this._collection[name][shortcut].push(callback);

                return this;

            },

            /**
             * Removes a callback from a shortcut with given name.
             * @param {String} name A name to remove from the collection.
             * @param {(ch.onkeybackspace | ch.onkeytab | ch.onkeyenter | ch.onkeyesc | ch.onkeyleftarrow | ch.onkeyuparrow | ch.onkeyrightarrow | ch.onkeydownarrow)} [shortcut] Shortcut to unsubscribe.
             * @param {Function} callback A given function.
             * @returns {Object} Retuns the ch.shortcuts.
             * @example
             * // Remove a callback from ESC key with "component" name.
             * ch.shortcuts.remove(ch.onkeyesc, 'component', component.hide);
             */
            'remove': function (name, shortcut, callback) {
                var evt,
                    evtCollection,
                    evtCollectionLenght;

                if (name === undefined) {
                    throw new Error('Shortcuts - "remove(name, shortcut, callback)": "name" parameter must be defined.');
                }

                if (shortcut === undefined) {
                    delete this._collection[name];
                    return this;
                }

                if (callback === undefined) {
                    delete this._collection[name][shortcut];
                    return this;
                }

                evtCollection = this._collection[name][shortcut];

                evtCollectionLenght = evtCollection.length;

                for (evt = 0; evt < evtCollectionLenght; evt += 1) {

                    if (evtCollection[evt] === callback) {
                        evtCollection.splice(evt, 1);
                    }
                }

                return this;

            },

            /**
             * Turn on shortcuts associated to a given name.
             * @param {String} name A given name from the collection.
             * @returns {Object} Retuns the ch.shortcuts.
             * @example
             * // Turn on shortcuts associated to "component" name.
             * ch.shortcuts.on('component');
             */
            'on': function (name) {
                var queueLength = this._queue.length,
                    item = queueLength - 1;

                // check if the instance exist and move the order, adds it at the las position and removes the current
                for (item; item >= 0; item -= 1) {
                    if (this._queue[item] === name) {
                        this._queue.splice(item, 1);
                    }
                }

                this._queue.push(name);
                this._active = name;

                return this;
            },

            /**
             * Turn off shortcuts associated to a given name.
             * @param {String} name A given name from the collection.
             * @returns {Object} Retuns the ch.shortcuts.
             * @example
             * // Turn off shortcuts associated to "component" name.
             * ch.shortcuts.off('component');
             */
            'off': function (name) {
                var queueLength = this._queue.length,
                    item = queueLength - 1;

                for (item; item >= 0; item -= 1) {
                    if (this._queue[item] === name) {
                        // removes the instance that I'm setting off
                        this._queue.splice(item, 1);

                        // the queue is full
                        if (this._queue.length > 0) {
                            this._active = this._queue[this._queue.length - 1];
                        } else {
                        // the queue no has elements
                            this._active = null;
                        }
                    }
                }

                return this;
            }
        },
        shortcutsEmitter = function (event) {
            var keyCode = event.keyCode.toString(),
                shortcut = codeMap[keyCode],
                callbacks,
                callbacksLenght,
                i = 0;

            if (shortcut !== undefined && shortcuts._active !== null) {
                callbacks = shortcuts._collection[shortcuts._active][shortcut];

                event.shortcut = shortcut;


                if (callbacks !== undefined) {

                    callbacksLenght = callbacks.length;

                    for (i = 0; i < callbacksLenght; i += 1) {
                        callbacks[i](event);
                    }

                }

            }
        };

    ch.Event.addListener(document, 'keydown', shortcutsEmitter);

    ch.shortcuts = shortcuts;

}(this, this.ch));

(function (window, ch) {
    'use strict';

    /**
     * Executes a callback function when the images of a query selection loads.
     * @memberof! ch
     * @param {HTMLImageElement} image An image or a collection of images.
     * @param {Function} [callback] The handler the component will fire after the images loads.
     * @example
     * new ch.onImagesLoads(HTMLImageElement, function () {
     *     console.log('The size of the loaded image is ' + this.width);
     * });
     */
    function onImagesLoads(image, callback) {
        var images;

        if (ch.util.isArray(image)) {
            images = image;
        } else {
            images = [image];
        }

        images.forEach(function (image, i) {

            ch.Event.addListenerOne(image, 'load', function () {
                var len = images.length;

                window.setTimeout(function () {
                    if (--len <= 0) { callback.call(image); }
                }, 200);
            }, false);

            if (image.complete || image.complete === undefined) {
                var src = image.src;
                // Data uri fix bug in web-kit browsers
                image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
                image.src = src;
            }

        });

    }

    ch.onImagesLoads = onImagesLoads;

}(this, this.ch));
(function (window, ch) {
    'use strict';

    var util = ch.util,
        uid = 0;

    /**
     * Base class for all components.
     *
     * @memberof ch
     * @constructor
     * @augments ch.EventEmitter
     * @param {HTMLElement} [el] It must be a HTMLElement.
     * @param {Object} [options] Configuration options.
     * @returns {component} Returns a new instance of Component.
     * @example
     * // Create a new Component.
     * var component = new ch.Component();
     * var component = new ch.Component('.my-component', {'option': 'value'});
     * var component = new ch.Component('.my-component');
     * var component = new ch.Component({'option': 'value'});
     */
    function Component(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Expandable is created.
             * @memberof! ch.Expandable.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Component#ready
         * @example
         * // Subscribe to "ready" event.
         * component.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    ch.util.inherits(Component, ch.EventEmitter);

    /**
     * The name of a component.
     * @memberof! ch.Component.prototype
     * @type {String}
     */
    Component.prototype.name = 'component';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Component.prototype
     * @function
     */
    Component.prototype.constructor = Component;

    /**
     * Initialize a new instance of Component and merge custom options with defaults options.
     * @memberof! ch.Component.prototype
     * @function
     * @private
     * @returns {component}
     */
    Component.prototype._init = function (el, options) {

        // Clones defaults or creates a defaults object
        var defaults = (this._defaults) ? util.clone(this._defaults) : {};

        if (el === null) {
            throw new Error('The "el" parameter is not present in the DOM');
        }

        /**
         * A unique id to identify the instance of a component.
         * @type {Number}
         */
        this.uid = (uid += 1);

        // el is HTMLElement
        // IE8 and earlier don't define the node type constants, 1 === document.ELEMENT_NODE
        if (el !== undefined && el.nodeType !== undefined && el.nodeType === 1) {

            this._el = el;

            // set the uid to the element to help search for the instance in the collection instances
            this._el.setAttribute('data-uid', this.uid);

            // we extend defaults with options parameter
            this._options = ch.util.extend(defaults, options);

        // el is an object configuration
        } else if (el === undefined || el.nodeType === undefined && typeof el === 'object') {

            // creates a empty element becouse the user not set a DOM elment to use, but we requires one
            // this._el = document.createElement('div');

            // we extend defaults with the object that is in el parameter object
            this._options = ch.util.extend(defaults, el);
        }

        /**
         * Indicates if a component is enabled.
         * @type {Boolean}
         * @private
         */
        this._enabled = true;

        /**
         * Stores all instances created
         * @type {Object}
         * @public
         */
        ch.instances = ch.instances || {};
        ch.instances[this.uid] = this;
    };


    /**
     * Adds functionality or abilities from other classes.
     * @memberof! ch.Component.prototype
     * @function
     * @returns {component}
     * @params {...String} var_args The name of the abilities to will be used.
     * @example
     * // You can require some abilitiest to use in your component.
     * // For example you should require the collpasible abitliy.
     * var component = new Component(element, options);
     * component.require('Collapsible');
     */
    Component.prototype.require = function () {

        var arg,
            i = 0,
            len = arguments.length;

        for (i; i < len; i += 1) {
            arg = arguments[i];

            if (this[arg.toLowerCase()] === undefined) {
                ch[arg].call(this);
            }
        }

        return this;
    };

    /**
     * Enables an instance of Component.
     * @memberof! ch.Component.prototype
     * @function
     * @returns {component}
     * @example
     * // Enabling an instance of Component.
     * component.enable();
     */
    Component.prototype.enable = function () {
        this._enabled = true;

        /**
         * Emits when a component is enabled.
         * @event ch.Component#enable
         * @example
         * // Subscribe to "enable" event.
         * component.on('enable', function () {
         *     // Some code here!
         * });
         */
        this.emit('enable');

        return this;
    };

    /**
     * Disables an instance of Component.
     * @memberof! ch.Component.prototype
     * @function
     * @returns {component}
     * @example
     * // Disabling an instance of Component.
     * component.disable();
     */
    Component.prototype.disable = function () {
        this._enabled = false;

        /**
         * Emits when a component is disable.
         * @event ch.Component#disable
         * @example
         * // Subscribe to "disable" event.
         * component.on('disable', function () {
         *     // Some code here!
         * });
         */
        this.emit('disable');

        return this;
    };

    /**
     * Destroys an instance of Component and remove its data from asociated element.
     * @memberof! ch.Component.prototype
     * @function
     * @example
     * // Destroy a component
     * component.destroy();
     * // Empty the component reference
     * component = undefined;
     */
    Component.prototype.destroy = function () {

        this.disable();

        if (this._el !== undefined) {
            delete ch.instances[this._el.getAttribute('data-uid')];
            this._el.removeAttribute('data-uid');
        }

        /**
         * Emits when a component is destroyed.
         * @event ch.Component#destroy
         * @exampleDescription
         * @example
         * // Subscribe to "destroy" event.
         * component.on('destroy', function () {
         *     // Some code here!
         * });
         */
        this.emit('destroy');

        return;
    };

    ch.Component = Component;

}(this, this.ch));
(function (window, ch) {
    'use strict';

    /**
     * Form is a controller of DOM's HTMLFormElement.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Validations
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Form.
     * @param {Object} [options] Options to customize an instance.
     * @param {Object} [options.messages] A collections of validations messages.
     * @param {String} [options.messages.required] A validation message.
     * @param {String} [options.messages.string] A validation message.
     * @param {String} [options.messages.url] A validation message.
     * @param {String} [options.messages.email] A validation message.
     * @param {String} [options.messages.maxLength] A validation message.
     * @param {String} [options.messages.minLength] A validation message.
     * @param {String} [options.messages.custom] A validation message.
     * @param {String} [options.messages.number] A validation message.
     * @param {String} [options.messages.min] A validation message.
     * @param {String} [options.messages.max] A validation message.
     * @returns {form} Returns a new instance of Form.
     * @example
     * // Create a new Form.
     * var form = new ch.Form(el, [options]);
     * @example
     * // Create a new Form with custom messages.
     * var form = new ch.Form({
     *     'messages': {
     *          'required': 'Some message!',
     *          'email': 'Another message!'
     *     }
     * });
     */
    function Form(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        that._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Form is created.
             * @memberof! ch.Form.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * It emits an event when the form is ready to use.
         * @event ch.Form#ready
         * @example
         * // Subscribe to "ready" event.
         * form.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Form, ch.Component);

    /**
     * The name of the component.
     * @memberof! ch.Form.prototype
     * @type {String}
     */
    Form.prototype.name = 'form';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Form.prototype
     * @function
     */
    Form.prototype.constructor = Form;

    /**
     * Initialize a new instance of Form and merge custom options with defaults options.
     * @memberof! ch.Form.prototype
     * @function
     * @private
     * @returns {form}
     */
    Form.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * A collection of active errors.
         * @type {Array}
         */
        this.errors = [];

        /**
         * Collection of defined messages.
         * @type {Object}
         * @private
         */
        this._messages = this._options.messages || {};

        /**
         * A collection of validations instances.
         * @type {Array}
         */
        this.validations = [];

        /**
         * The form container.
         * @type {HTMLElement}
         */
        this.container = this._el;
            // Add classname
        ch.util.classList(this.container).add('ch-form');
            // Disable HTML5 browser-native validations
        this.container.setAttribute('novalidate', 'novalidate');
            // Bind the submit
        ch.Event.addListener(this.container, 'submit', function (event) {
            // Runs validations
            that.validate(event);
        });

        // Bind the reset
        if (this.container.querySelector('input[type="reset"]')) {
            ch.Event.addListener(this.container.querySelector('input[type="reset"]'), ch.onpointertap, function (event) {
                ch.util.prevent(event);
                that.reset();
            });
        }


        // Clean validations
        this.on('disable', this.clear);

        return this;
    };

    /**
     * Executes all validations.
     * @memberof! ch.Form.prototype
     * @function
     * @returns {form}
     */
    Form.prototype.validate = function (event) {

        if (!this._enabled) {
            return this;
        }

        /**
         * It emits an event when the form will be validated.
         * @event ch.Form#beforevalidate
         * @example
         * // Subscribe to "beforevalidate" event.
         * component.on('beforevalidate', function () {
         *     // Some code here!
         * });
         */
        this.emit('beforevalidate');

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            i = 0,
            j = that.validations.length,
            validation,
            firstError,
            firstErrorVisible,
            triggerError;

        this.errors.length = 0;

        // Run validations
        for (i; i < j; i += 1) {
            validation = that.validations[i];

            // Validate
            validation.validate();

            // Store validations with errors
            if (validation.isShown()) {
                that.errors.push(validation);
            }
        }

        // Is there's an error
        if (that.errors.length > 0) {
            firstError = that.errors[0];
            firstErrorVisible = firstError.trigger;

            // Find the closest visible parent if current element is hidden
            while (ch.util.getStyles(firstErrorVisible, 'display') === 'none' && firstErrorVisible !== document.documentElement) {
                firstErrorVisible = firstErrorVisible.parentElement;
            }

            firstErrorVisible.scrollIntoView();

            // Issue UI-332: On validation must focus the first field with errors.
            // Doc: http://wiki.ml.com/display/ux/Mensajes+de+error
            triggerError = firstError.trigger;

            if (triggerError.tagName === 'DIV') {
                firstError.trigger.querySelector('input:first-child').focus();
            }

            if (triggerError.type !== 'hidden' || triggerError.tagName === 'SELECT') {
                triggerError.focus();
            }

            ch.util.prevent(event);

            /**
             * It emits an event when a form has got errors.
             * @event ch.Form#error
             * @example
             * // Subscribe to "error" event.
             * form.on('error', function (errors) {
             *     console.log(errors.length);
             * });
             */
            this.emit('error', this.errors);

        } else {

            /**
             * It emits an event when a form hasn't got errors.
             * @event ch.Form#success
             * @example
             * // Subscribe to "success" event.
             * form.on("submit",function () {
             *     // Some code here!
             * });
             * @example
             * // Subscribe to "success" event and prevent the submit event.
             * form.on("submit",function (event) {
             *     event.preventDefault();
             *     // Some code here!
             * });
             */
            this.emit('success', event);
        }

        return this;
    };

    /**
     * Checks if the form has got errors but it doesn't show bubbles.
     * @memberof! ch.Form.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Checks if a form has errors and do something.
     * if (form.hasError()) {
     *     // Some code here!
     * };
     */
    Form.prototype.hasError = function () {

        if (!this._enabled) {
            return false;
        }

        this.errors.length = 0;

        var i = 0,
            j = this.validations.length,
            validation;

        // Run hasError
        for (i; i < j; i += 1) {

            validation = this.validations[i];

            if (validation.hasError()) {
                this.errors.push(validation);
            }

        }

        if (this.errors.length > 0) {
            return true;
        }

        return false;
    };

    /**
     * Clear all active errors.
     * @memberof! ch.Form.prototype
     * @function
     * @returns {form}
     * @example
     * // Clear active errors.
     * form.clear();
     */
    Form.prototype.clear = function () {
        var i = 0,
            j = this.validations.length;

        for (i; i < j; i += 1) {
            this.validations[i].clear();
        }

        /**
         * It emits an event when the form is cleaned.
         * @event ch.Form#clear
         * @example
         * // Subscribe to "clear" event.
         * form.on('clear', function () {
         *     // Some code here!
         * });
         */
        this.emit('clear');

        return this;
    };

    /**
     * Clear all active errors and executes the reset() native mehtod.
     * @memberof! ch.Form.prototype
     * @function
     * @returns {form}
     * @example
     * // Resets form fields and clears active errors.
     * form.reset();
     */
    Form.prototype.reset = function () {

        // Clears all shown validations
        this.clear();

        // Executes the native reset() method
        this._el.reset();

        /**
         * It emits an event when a form resets its fields.
         * @event ch.Form#reset
         * @example
         * // Subscribe to "reset" event.
         * form.on('reset', function () {
         *     // Some code here!
         * });
         */
        this.emit('reset');

        return this;
    };

    /**
     * Destroys a Form instance.
     * @memberof! ch.Form.prototype
     * @function
     * @example
     * // Destroy a form
     * form.destroy();
     * // Empty the form reference
     * form = undefined;
     */
    Form.prototype.destroy = function () {

        // this.$container.off('.form')
        this.container.removeAttribute('novalidate');

        this.validations.forEach(function (e, i) {
            e.destroy();
        });

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Form);

}(this, this.ch));
(function (ch) {
    'use strict';

    // Private Members
    var conditions = {
        'string': {
            'fn': function (value) {
                // the following regular expression has the utf code for the lating characters
                // the ranges are A,EI,O,U,a,ei,o,u,ç,Ç please for reference see http://www.fileformat.info/info/charset/UTF-8/list.htm
                return (/^([a-zA-Z\u00C0-\u00C4\u00C8-\u00CF\u00D2-\u00D6\u00D9-\u00DC\u00E0-\u00E4\u00E8-\u00EF\u00F2-\u00F6\u00E9-\u00FC\u00C7\u00E7\s]*)$/i).test(value);
            },
            'message': 'Use only letters.'
        },
        'email': {
            'fn': function (value) {
                return (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i).test(value);
            },
            'message': 'Use a valid e-mail such as name@example.com.'
        },
        'url': {
            'fn': function (value) {
                return (/^((https?|ftp|file):\/\/|((www|ftp)\.)|(\/|.*\/)*)[a-z0-9-]+((\.|\/)[a-z0-9-]+)+([/?].*)?$/i).test(value);
            },
            'message': 'It must be a valid URL.'
        },
        'minLength': {
            'fn': function (a, b) { return a.length >= b; },
            'message': 'Enter at least {#num#} characters.'
        },
        'maxLength': {
            'fn': function (a, b) { return a.length <= b; },
            'message': 'The maximum amount of characters is {#num#}.'
        },
        'number': {
            'fn': function (value) {
                return (/^(-?[0-9]+)$/i).test(value);
            },
            'message': 'Use only numbers.'
        },
        'max': {
            'fn': function (a, b) { return a <= b; },
            'message': 'The amount must be smaller than {#num#}.'
        },
        'min': {
            'fn': function (a, b) { return a >= b; },
            'message': 'The amount must be higher than {#num#}.'
        },
        'required': {
            'fn': function (value) {

                var tag = ch.util.classList(this.trigger).contains('ch-form-options') ? 'OPTIONS' : this._el.tagName,
                    validated;

                switch (tag) {
                case 'OPTIONS':
                    validated = this.trigger.querySelectorAll('input:checked').length !== 0;
                    break;

                case 'SELECT':
                    validated = (value !== '-1' && value !== '');
                    break;

                // INPUTS and TEXTAREAS
                default:
                    validated = value.replace(/^\s+|\s+$/g, '').length !== 0;
                    break;
                }

                return validated;
            },
            'message': 'Fill in this information.'
        },
        'custom': {
            // I don't have pre-conditions, comes within conf.fn argument
            'message': 'Error'
        }
    };

    /**
     * Condition utility.
     * @memberof ch
     * @constructor
     * @requires ch.Validation
     * @param {Array} [condition] A conditions to validate.
     * @param {String} [condition.name] The name of the condition.
     * @param {String} [condition.message] The given error message to the condition.
     * @param {String} [condition.fn] The method to validate a given condition.
     * @returns {condition} Returns a new instance of Condition.
     * @example
     * // Create a new condition object with patt.
     * var condition = ch.Condition({
     *     'name': 'string',
     *     'patt': /^([a-zA-Z\u00C0-\u00C4\u00C8-\u00CF\u00D2-\u00D6\u00D9-\u00DC\u00E0-\u00E4\u00E8-\u00EF\u00F2-\u00F6\u00E9-\u00FC\u00C7\u00E7\s]*)$/,
     *     'message': 'Some message here!'
     * });
     * @example
     * //Create a new condition object with expr.
     * var condition = ch.Condition({
     *     'name': 'maxLength',
     *     'patt': function(a,b) { return a.length <= b },
     *     'message': 'Some message here!',
     *     'value': 4
     * });
     * @example
     * // Create a new condition object with func.
     * var condition = ch.Condition({
     *     'name': 'custom',
     *     'patt': function (value) {
     *         if (value === 'ChicoUI') {
     *
     *             // Some code here!
     *
     *             return true;
     *         };
     *
     *         return false;
     *     },
     *     'message': 'Your message here!'
     * });
     */
    function Condition(condition) {

        ch.util.extend(this, conditions[condition.name], condition);

        // replaces the condition default message in the following conditions max, min, minLenght, maxLenght
        if (this.name === 'min' || this.name === 'max' || this.name === 'minLength' || this.name === 'maxLength') {
            this.message = this.message.replace('{#num#}', this.num);
        }

        this._enabled = true;

        return this;
    }

    /**
     * The name of the component.
     * @memberof! ch.Condition.prototype
     * @type {String}
     */
    Condition.prototype.name = 'condition';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Condition.prototype
     * @function
     */
    Condition.prototype.constructor = Condition;

    /**
     * Enables an instance of condition.
     * @memberof! ch.Condition.prototype
     * @function
     * @returns {condition}
     * @example
     * // Enabling an instance of Condition.
     * condition.enable();
     * @example
     * // Enabling a condition.
     * condition.enable();
     */
    Condition.prototype.enable = function () {
        this._enabled = true;

        return this;
    };

    /**
     * Disables an instance of a condition.
     * @memberof! ch.Condition.prototype
     * @function
     * @returns {condition}
     * @example
     * // Disabling an instance of Condition.
     * condition.disable();
     * @example
     * // Disabling a condition.
     * condition.disable();
     */
    Condition.prototype.disable = function () {
        this._enabled = false;

        return this;
    };

    /**
     * Enables an instance of condition.
     * @memberof! ch.Condition.prototype
     * @function
     * @param {(String | Number)} value A given value.
     * @param {condition} validation A given validation to execute.
     * @returns {Boolean} Returns a boolean indicating whether the condition fails or not.
     * @example
     * // Testing a condition.
     * condition.test('foobar', validationA);
     */
    Condition.prototype.test = function (value, validation) {

        if (!this._enabled) {
            return true;
        }

        return this.fn.call(validation, value, this.num);
    };

    ch.Condition = Condition;

}(this.ch));
(function (window, ch) {
    'use strict';

    /**
     * Validation is an engine to validate HTML forms elements.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Condition
     * @requires ch.Form
     * @requires ch.Bubble
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Validation.
     * @param {Object} [options] Options to customize an instance.
     * @param {Array} [options.conditions] A collection of conditions to validate.
     * @param {String} [options.conditions.name] The name of the condition.
     * @param {String} [options.conditions.message] The given error message to the condition.
     * @param {String} [options.conditions.fn] The method to validate a given condition.
     * @param {HTMLElement} [options.reference] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 10.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Default: "absolute".
     * @returns {validation} Returns a new instance of Validation.
     * @example
     * // Create a new Validation.
     * var validation = new ch.Validation(document.querySelector('.name-field'), [options]);
     * @example
     * // Create a validation with with custom options.
     * var validation = new ch.Validation({
     *     'conditions': [
     *         {
     *             'name': 'required',
     *             'message': 'Please, fill in this information.'
     *         },
     *         {
     *             'name': 'custom-email',
     *             'fn': function (value) { return value === "customail@custom.com"; },
     *             'message': 'Use a valid e-mail such as name@custom.com.'
     *         }
     *     ],
     *     'offsetX': 0,
     *     'offsetY': 10,
     *     'side': 'bottom',
     *     'align': 'left'
     * });
     */
    function Validation(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Validation is created.
             * @memberof! ch.Validation.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Validation#ready
         * @example
         * // Subscribe to "ready" event.
         * validation.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Validation, ch.Component),
        // Creates methods enable and disable into the prototype.
        methods = ['enable', 'disable'],
        len = methods.length;

    function createMethods(method) {
        Validation.prototype[method] = function (condition) {
            var key;

            // Specific condition
            if (condition !== undefined && this.conditions[condition] !== undefined) {

                this.conditions[condition][method]();

            } else {

                // all conditions
                for (key in this.conditions) {
                    if (this.conditions[key] !== undefined) {
                        this.conditions[key][method]();
                    }
                }

                parent[method].call(this);
            }

            return this;
        };
    }

    /**
     * The name of the component.
     * @memberof! ch.Validation.prototype
     * @type {String}
     */
    Validation.prototype.name = 'validation';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Validation.prototype
     * @function
     */
    Validation.prototype.constructor = Validation;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Validation.prototype._defaults = {
        'offsetX': 10
    };

    /**
     * Initialize a new instance of Validation and merge custom options with defaults options.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    Validation.prototype._init = function (el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        parent._init.call(this, el, options);

        /**
         * The validation trigger.
         * @type {HTMLElement}
         */
        this.trigger = this._el;

        /**
         * The validation container.
         * @type {HTMLElement}
         */
        this._configureContainer();

        /**
         * The collection of conditions.
         * @type {Object}
         */
        this.conditions = {};

        // Merge conditions
        this._mergeConditions(options.conditions);

        /**
         * Flag that let you know if there's a validation going on.
         * @type {Boolean}
         * @private
         */
        this._shown = false;

        /**
         * The current error. If the validations has not error is "null".
         * @type {Object}
         */
        this.error = null;

        this
            // Clean the validation if is shown;
            .on('disable', this.clear);

        /**
         * Reference to a Form instance. If there isn't any, the Validation instance will create one.
         * @type {form}
         */
        this.form = (ch.instances[ch.util.parentElement(that.trigger, 'form').getAttribute('data-uid')] || new ch.Form(ch.util.parentElement(that.trigger, 'form')));

        this.form.validations.push(this);

        /**
         * Set a validation event to add listeners.
         * @private
         */
        this._validationEvent = (ch.util.classList(this.trigger).contains('ch-form-options') || this._el.tagName === 'SELECT' || (this._el.tagName === 'INPUT' && this._el.type === 'range')) ? 'change' : 'blur';

        return this;
    };

    /**
     * Merges the collection of conditions with a given conditions.
     * @function
     * @private
     */
    Validation.prototype._mergeConditions = function (conditions) {
        var i = 0,
            j = conditions.length;

        for (i; i < j; i += 1) {
            this.conditions[conditions[i].name] = new ch.Condition(conditions[i]);
        }

        return this;
    };

    /**
     * Validates the value of $el.
     * @memberof! ch.Validation.prototype
     * @function
     * @returns {validation}
     */
    Validation.prototype.validate = function () {

        if (this.hasError()) {
            this._error();
        } else {
            this._success();
        }

        return this;
    };

    /**
     * If the validation has got an error executes this function.
     * @private
     */
    Validation.prototype._error = function () {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            previousValue;

        // It must happen only once.
        ch.Event.addListener(this.trigger, this._validationEvent, function () {

            if (previousValue !== this.value || that._validationEvent === 'change' && that.isShown()) {
                previousValue = this.value;
                that.validate();
            }

            if (that.conditions.required === undefined && this.value === '') {
                that.clear();
            }

        });

        // Lazy Loading pattern
        this._error = function () {

            if (!that._previousError.condition || !that._shown) {
                if (that._el.nodeName === 'INPUT' || that._el.nodeName === 'TEXTAREA') {
                    ch.util.classList(that.trigger).add('ch-validation-error');
                }

                that._showErrorMessage(that.error.message || 'Error');
            }

            if (that.error.condition !== that._previousError.condition) {
                that._showErrorMessage(that.error.message || that.form._messages[that.error.condition] || 'Error');
            }

            that._shown = true;

            /**
             * It emits an event when a validation hasn't got an error.
             * @event ch.Validation#error
             * @example
             * // Subscribe to "error" event.
             * validation.on('error', function (errors) {
             *     console.log(errors.length);
             * });
             */
            that.emit('error', that.error);

            return that;
        };

        this._error();

        return this;
    };

    /**
     * If the validation hasn't got an error executes this function.
     * @private
     */
    Validation.prototype._success = function () {

        // Status OK (with previous error) this._previousError
        if (this._shown || !this._enabled) {
            // Public status OK
            this._shown = false;
        }

        this.trigger.removeAttribute('aria-label');
        ch.util.classList(this.trigger).remove('ch-validation-error')


        this._hideErrorMessage();

        /**
         * It emits an event when a validation hasn't got an error.
         * @event ch.Validation#success
         * @example
         * // Subscribe to "success" event.
         * validation.on("submit",function () {
         *     // Some code here!
         * });
         */
        this.emit('success');

        return this;
    };

    /**
     * Checks if the validation has got errors but it doesn't show bubbles.
     * @memberof! ch.Validation.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Checks if a validation has errors and do something.
     * if (validation.hasError()) {
     *     // Some code here!
     * };
     */
    Validation.prototype.hasError = function () {

        // Pre-validation: Don't validate disabled
        if (this.trigger.getAttribute('disabled') || !this._enabled) {
            return false;
        }

        var condition,
            required = this.conditions.required,
            value = this._el.value;

        // Avoid fields that aren't required when they are empty or de-activated
        if (!required && value === '' && this._shown === false) {
            // Has got an error? Nop
            return false;
        }

        /**
         * Stores the previous error object
         * @private
         */
        this._previousError = ch.util.clone(this.error);

        // for each condition
        for (condition in this.conditions) {

            if (this.conditions[condition] !== undefined && !this.conditions[condition].test(value, this)) {
                // Update the error object
                this.error = {
                    'condition': condition,
                    'message': this.conditions[condition].message
                };

                // Has got an error? Yeah
                return true;
            }

        }

        // Update the error object
        this.error = null;

        // Has got an error? No
        return false;
    };

    /**
     * Clear active error.
     * @memberof! ch.Validation.prototype
     * @function
     * @returns {validation}
     * @example
     * // Clear active error.
     * validation.clear();
     */
    Validation.prototype.clear = function () {

        this.trigger.removeAttribute('aria-label');
        ch.util.classList(this.trigger).remove('ch-validation-error');

        this.error = null;

        this._hideErrorMessage();

        this._shown = false;

        /**
         * It emits an event when a validation is cleaned.
         * @event ch.Validation#clear
         * @example
         * // Subscribe to "clear" event.
         * validation.on('clear', function () {
         *     // Some code here!
         * });
         */
        this.emit('clear');

        return this;
    };

    /**
     * Indicates if the validation is shown.
     * @memberof! ch.Validation.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Execute a function if the validation is shown.
     * if (validation.isShown()) {
     *     fn();
     * }
     */
    Validation.prototype.isShown = function () {
        return this._shown;
    };

    /**
     * Sets or gets messages to specifics conditions.
     * @memberof! ch.Validation.prototype
     * @function
     * @returns {(validation | String)}
     * @example
     * // Gets a message from a condition
     * validation.message('required');
     * @example
     * // Sets a new message
     * validation.message('required', 'New message for required validation');
     */
    Validation.prototype.message = function (condition, message) {

        if (condition === undefined) {
            throw new Error('validation.message(condition, message): Please, a condition parameter is required.');
        }

        // Get a new message from a condition
        if (message === undefined) {
            return this.conditions[condition].message;
        }

        // Sets a new message
        this.conditions[condition].message = message;

        if (this.isShown() && this.error.condition === condition) {
            this._showErrorMessage(message);
        }

        return this;
    };

    /**
     * Enables an instance of validation or a specific condition.
     * @memberof! ch.Validation.prototype
     * @name enable
     * @function
     * @param {String} [condition] - A given number of fold to enable.
     * @returns {validation} Returns an instance of Validation.
     * @example
     * // Enabling an instance of Validation.
     * validation.enable();
     * @example
     * // Enabling the "max" condition.
     * validation.enable('max');
     */

    /**
     * Disables an instance of a validation or a specific condition.
     * @memberof! ch.Validation.prototype
     * @name disable
     * @function
     * @param {String} [condition] - A given number of fold to disable.
     * @returns {validation} Returns an instance of Validation.
     * @example
     * // Disabling an instance of Validation.
     * validation.disable();
     * @example
     * // Disabling the "email" condition.
     * validation.disable('email');
     */
    while (len) {
        createMethods(methods[len -= 1]);
    }

    /**
     * Destroys a Validation instance.
     * @memberof! ch.Validation.prototype
     * @function
     * @example
     * // Destroying an instance of Validation.
     * validation.destroy();
     */
    Validation.prototype.destroy = function () {

        // this.$trigger.off('.validation')
        this.trigger.removeAttribute('data-side data-align');

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Validation);

}(this, this.ch));
(function (ch) {
    'use strict';

    /**
     * Creates a bubble to show the validation message.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    ch.Validation.prototype._configureContainer = function () {

        var that = this;

        /**
         * Is the little sign that popover showing the validation message. It's a Popover component, so you can change it's content, width or height and change its visibility state.
         * @type {Bubble}
         * @see ch.Bubble
         */
        this.bubble = this._container = new ch.Bubble({
            'reference': that._options.reference || (function () {
                var reference,
                    trigger = that.trigger,
                    h4,
                    span;
                // CHECKBOX, RADIO
                // TODO: when old forms be deprecated we must only support ch-form-options class
                if (ch.util.classList(trigger).contains('ch-form-options')) {
                // Helper reference from will be fired
                    if (trigger.querySelectorAll('h4').length > 0) {
                        // Wrap content with inline element
                        h4 = trigger.querySelector('h4'); // Find h4
                        span = document.createElement('span');
                        span.insertAdjacentHTML('beforeend', h4.innerHTML);
                        h4.innerHTML = '';
                        h4.insertBefore(span, h4.firstChild);
                        reference = h4.children[0]; // Inline element in h4 like helper reference
                    // Legend
                    } else if (trigger.previousElementSibling && trigger.previousElementSibling.tagName === 'LEGEND') {
                        reference = trigger.previousElementSibling; // Legend like helper reference
                    } else {
                        reference = trigger.querySelector('label');
                    }
                // INPUT, SELECT, TEXTAREA
                } else {
                    reference = trigger;
                }

                return reference;
            }()),
            'align': that._options.align,
            'side': that._options.side,
            'offsetY': that._options.offsetY,
            'offsetX': that._options.offsetX
            // 'position': that._options.position
        });

    };

    /**
     * Shows the validation message.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    ch.Validation.prototype._showErrorMessage = function (message) {
        this.bubble.content(message).show();
        this.trigger.setAttribute('aria-label', 'ch-' + this.bubble.name + '-' + this.bubble.uid);

        return this;
    };

    /**
     * Hides the validation message.
     * @memberof! ch.Validation.prototype
     * @function
     * @private
     * @returns {validation}
     */
    ch.Validation.prototype._hideErrorMessage = function () {
        this.bubble.hide();
        this.trigger.removeAttribute('aria-label');

        return this;
    };

    /**
     * Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
     * @memberof! ch.Validation.prototype
     * @function
     * @returns {validation}
     * @example
     * // Change validaton bubble's position.
     * validation.refreshPosition({
     *     offsetY: -10,
     *     side: 'top',
     *     align: 'left'
     * });
     */
    ch.Validation.prototype.refreshPosition = function (options) {

        if (options === undefined) {
            return this.bubble._position;
        }

        this.bubble.refreshPosition(options);

        return this;
    };

}(this.ch));
(function (window, ch) {
    'use strict';

    function normalizeOptions(options) {
        if (typeof options === 'string' || options instanceof HTMLElement) {
            options = {
                'content': options
            };
        }
        return options;
    }

    /**
     * Expandable lets you show or hide content. Expandable needs a pair: a title and a container related to title.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @mixes ch.Collapsible
     * @mixes ch.Content
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Expandable.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "none".
     * @param {Boolean} [options.toggle] Customize toggle behavior. Default: true.
     * @param {HTMLElement} [options.container] The container where the expanbdale puts its content. Default: the next sibling of el parameter.
     * @param {(String | HTMLElement)} [options.content] The content to be shown into the expandable container.
     * @returns {expandable} Returns a new instance of Expandable.
     * @example
     * // Create a new Expandable.
     * var expandable = new ch.Expandable([el], [options]);
     * @example
     * // Create a new Expandable with custom options.
     * var expandable = new ch.Expandable({
     *     'container': document.querySelector('.my-container'),
     *     'toggle': false,
     *     'fx': 'slideDown',
     *     'content': 'http://ui.ml.com:3040/ajax'
     * });
     * @example
     * // Create a new Expandable using the shorthand way (content as parameter).
     * var expandable = new ch.Expandable('http://ui.ml.com:3040/ajax');
     */
    function Expandable(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Expandable is created.
             * @memberof! ch.Expandable.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Expandable#ready
         * @example
         * // Subscribe to "ready" event.
         * expandable.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var document = window.document,
        parent = ch.util.inherits(Expandable, ch.Component);

    /**
     * The name of the component.
     * @memberof! ch.Expandable.prototype
     * @type {String}
     */
    Expandable.prototype.name = 'expandable';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Expandable.prototype
     * @function
     */
    Expandable.prototype.constructor = Expandable;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Expandable.prototype._defaults = {
        '_classNameTrigger': 'ch-expandable-trigger',
        '_classNameIcon': 'ch-expandable-ico',
        '_classNameContainer': 'ch-expandable-container',
        'fx': false,
        'toggle': true
    };

    /**
     * Initialize a new instance of Expandable and merge custom options with defaults options.
     * @memberof! ch.Expandable.prototype
     * @function
     * @private
     * @returns {expandable}
     */
    Expandable.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

        // Requires abilities
        this.require('Collapsible', 'Content');

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * The expandable trigger.
         * @type {HTMLElement}
         * @example
         * // Gets the expandable trigger.
         * expandable.trigger;
         */
        this.trigger = this._el;
        ch.util.classList(this.trigger).add(this._options._classNameTrigger);
        ch.util.classList(this.trigger).add(this._options._classNameIcon);
        ch.Event.addListener(this.trigger, ch.onpointertap, function (event) {
            if (ch.pointerCanceled) {
                return;
            }

            ch.util.prevent(event);

            if (that._options.toggle) {
                that._toggle();
            } else {
                that.show();
            }
        });

        /**
         * The expandable container.
         * @type {HTMLElement}
         * @example
         * // Gets the expandable container.
         * expandable.container;
         */
        this.container = this._content = (this._options.container ?
            this._options.container : ch.util.nextElementSibling(this._el));
        ch.util.classList(this.container).add(this._options._classNameContainer);
        ch.util.classList(this.container).add('ch-hide');
        if (ch.support.transition && this._options.fx !== 'none' && this._options.fx !== false) {
            ch.util.classList(this.container).add('ch-fx');
        }
        this.container.setAttribute('aria-expanded', 'false');

        /**
         * Default behavior
         */
        if (this.container.getAttribute('id') === '') {
            this.container.setAttribute('id', 'ch-expandable-' + this.uid);
        }

        this.trigger.setAttribute('aria-controls', this.container.getAttribute('id'));

        this
            .on('show', function () {
                ch.Event.dispatchCustomEvent(window.document, ch.onlayoutchange);
            })
            .on('hide', function () {
                ch.Event.dispatchCustomEvent(window.document, ch.onlayoutchange);
            });

        ch.util.avoidTextSelection(this.trigger);

        return this;
    };

    /**
     * Shows expandable's content.
     * @memberof! ch.Expandable.prototype
     * @function
     * @param {(String | HTMLElement)} [content] The content that will be used by expandable.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {expandable}
     * @example
     * // Shows a basic expandable.
     * component.show();
     * @example
     * // Shows an expandable with new content.
     * component.show('Some new content here!');
     * @example
     * // Shows an expandable with a new content that will be loaded by ajax and some custom options.
     * component.show('http://chico-ui.com.ar/ajax', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Expandable.prototype.show = function (content, options) {

        if (!this._enabled) {
            return this;
        }

        this._show();

        // Update ARIA
        this.container.setAttribute('aria-expanded', 'true');

        // Set new content
        if (content !== undefined) {
            this.content(content, options);
        }

        return this;
    };

    /**
     * Hides component's container.
     * @memberof! ch.Expandable.prototype
     * @function
     * @returns {expandable}
     * @example
     * // Close an expandable.
     * expandable.hide();
     */
    Expandable.prototype.hide = function () {

        if (!this._enabled) {
            return this;
        }

        this._hide();

        this.container.setAttribute('aria-expanded', 'false');

        return this;
    };


    /**
     * Returns a Boolean specifying if the component's core behavior is shown. That means it will return 'true' if the component is on, and it will return false otherwise.
     * @memberof! ch.Expandable.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Execute a function if the component is shown.
     * if (expandable.isShown()) {
     *     fn();
     * }
     */
    Expandable.prototype.isShown = function () {
        return this._shown;
    };

    /**
     * Destroys an Expandable instance.
     * @memberof! ch.Expandable.prototype
     * @function
     * @example
     * // Destroy an expandable
     * expandable.destroy();
     * // Empty the expandable reference
     * expandable = undefined;
     */
    Expandable.prototype.destroy = function () {

        //this.$trigger.off('.expandable')
        ch.util.classList(this.trigger).remove('ch-expandable-trigger');
        ch.util.classList(this.trigger).remove('ch-expandable-ico');
        ch.util.classList(this.trigger).remove('ch-user-no-select');
        this.trigger.removeAttribute('aria-controls');

        ch.util.classList(this.container).remove('ch-expandable-container');
        ch.util.classList(this.container).remove('ch-hide');
        this.container.removeAttribute('aria-expanded');
        this.container.removeAttribute('aria-hidden');

        ch.Event.dispatchCustomEvent(window.document, ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Expandable, normalizeOptions);

}(this, this.ch));
(function (window, ch) {
    'use strict';

    /**
     * Menu lets you organize the links by categories.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Expandable
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Menu.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.fx] Enable or disable UI effects. You should use: "slideDown", "fadeIn" or "none". Default: "slideDown".
     * @returns {menu} Returns a new instance of Menu.
     * @example
     * // Create a new Menu.
     * var menu = new ch.Menu(el, [options]);
     * @example
     * // Create a new Menu with custom options.
     * var menu = new ch.Menu({
     *     'fx': 'none'
     * });
     */
    function Menu(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        that._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Menu is created.
             * @memberof! ch.Menu.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Menu#ready
         * @example
         * // Subscribe to "ready" event.
         * menu.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Menu, ch.Component),

        // Creates methods enable and disable into the prototype.
        methods = ['enable', 'disable'],
        len = methods.length;

    function createMethods(method) {
        Menu.prototype[method] = function (child) {
            var i,
                fold = this.folds[child - 1];

            // Enables or disables a specific expandable fold
            if (fold && fold.name === 'expandable') {

                fold[method]();

            // Enables or disables Expandable folds
            } else {

                i = this.folds.length;

                while (i) {

                    fold = this.folds[i -= 1];

                    if (fold.name === 'expandable') {
                        fold[method]();
                    }
                }

                // Executes parent method
                parent[method].call(this);

                // Updates "aria-disabled" attribute
                this._el.setAttribute('aria-disabled', !this._enabled);
            }

            return this;
        };
    }

    /**
     * The name of the component.
     * @memberof! ch.Menu.prototype
     * @type {String}
     */
    Menu.prototype.name = 'menu';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Menu.prototype
     * @function
     */
    Menu.prototype.constructor = Menu;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Menu.prototype._defaults = {
        'fx': 'slideDown'
    };

    /**
     * Initialize a new instance of Menu and merge custom options with defaults options.
     * @memberof! ch.Menu.prototype
     * @function
     * @private
     * @returns {menu}
     */
    Menu.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._el.cloneNode(true);

        /**
         * The menu container.
         * @type {HTMLElement}
         */
        this.container = this._el;
        this.container.setAttribute('role', 'navigation');
        ch.util.classList(this.container).add('ch-menu');

        this._options._className ? ch.util.classList(this.container).add(this._options._className) : null;
        this._options.addClass ? ch.util.classList(this.container).add(this._options.addClass) : null;

        /**
         * A collection of folds.
         * @type {Array}
         */
        this.folds = [];

        // Inits an expandable component on each list inside main HTML code snippet
        this._createExpandables();

        return this;
    };

    /**
     * Inits an Expandable component on each list inside main HTML code snippet.
     * @function
     * @private
     */
    Menu.prototype._createExpandables = function () {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            li,
            child;

        function createExpandable(li, i) {
            var expandable,
                menu;

            // List element
            ch.util.classList(li).add('ch-menu-fold');

            // Children of list elements
            child = li.children[0];

            // Anchor inside list
            if (child.tagName === 'A') {
                // Add attr role to match wai-aria
                li.setAttribute('role', 'presentation');
                //
                ch.util.classList(child).add('ch-fold-trigger');
                // Add anchor to that.fold
                that.folds.push(child);

            } else {
                // List inside list, inits an Expandable
                expandable = new ch.Expandable(child, {
                    // Show/hide on IE8- instead slideUp/slideDown
                    'fx': that._options.fx
                });

                expandable
                    .on('show', function () {
                        /**
                         * Event emitted when the menu shows a fold.
                         * @event ch.Menu#show
                         * @example
                         * // Subscribe to "show" event.
                         * menu.on('show', function (shown) {
                         *     // Some code here!
                         * });
                         */
                        that.emit('show', i + 1);
                    })
                    .on('hide', function () {
                        /**
                         * Event emitted when the menu hides a fold.
                         * @event ch.Menu#hide
                         * @example
                         * // Subscribe to "hide" event.
                         * menu.on('hide', function () {
                         *     // Some code here!
                         * });
                         */
                        that.emit('hide');
                    });

                menu = ch.util.nextElementSibling(child);
                menu.setAttribute('role', 'menu');

                Array.prototype.forEach.call(menu.children, function (item){
                    item.setAttribute('role', 'presentation');
                    item.children[0] ? item.children[0].setAttribute('role', 'menuitem') : null;
                });

                // Add expandable to that.fold
                that.folds.push(expandable);
            }
        }

        Array.prototype.forEach.call(this.container.children, createExpandable);

        return this;
    };

    /**
     * Shows a specific fold.
     * @memberof! ch.Menu.prototype
     * @function
     * @param {Number} child - A given number of fold.
     * @returns {menu}
     * @example
     * // Shows the second fold.
     * menu.show(2);
     */
    Menu.prototype.show = function (child) {

        this.folds[child - 1].show();

        return this;
    };

    /**
     * Hides a specific fold.
     * @memberof! ch.Menu.prototype
     * @function
     * @param {Number} child - A given number of fold.
     * @returns {menu}
     * @example
     * // Hides the second fold.
     * menu.hide(2);
     */
    Menu.prototype.hide = function (child) {

        this.folds[child - 1].hide();

        return this;
    };

    /**
     * Allows to manage the menu content.
     * @param {Number} fold A given fold to change its content.
     * @param {(String | HTMLElement)} content The content that will be used by a fold.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @example
     * // Updates the content of the second fold with some string.
     * menu.content(2, 'http://ajax.com', {'cache': false});
     */
    Menu.prototype.content = function (fold, content, options) {
        if (fold === undefined || typeof fold !== 'number') {
            throw new window.Error('Menu.content(fold, content, options): Expected number of fold.');
        }

        if (content === undefined) {
            return this.folds[fold - 1].content();
        }

        this.folds[fold - 1].content(content, options);

        return this;
    };

    while (len) {
        createMethods(methods[len -= 1]);
    }

    /**
     * Destroys a Menu instance.
     * @memberof! ch.Menu.prototype
     * @function
     * @example
     * // Destroy a menu
     * menu.destroy();
     * // Empty the menu reference
     * menu = undefined;
     */
    Menu.prototype.destroy = function () {

        this.folds.forEach(function (e, i) {
            if (e.destroy !== undefined) {
                e.destroy();
            }
        });

        this._el.parentNode.replaceChild(this._snippet, this._el);

        ch.Event.dispatchCustomEvent(window.document, ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    ch.factory(Menu);

}(this, this.ch));

(function (window, ch) {
    'use strict';

    /**
     * Popover is the basic unit of a dialog window.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @mixes ch.Collapsible
     * @mixes ch.Content
     * @requires ch.Positioner
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Popover.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "button".
     * @param {HTMLElement} [options.reference] It's a HTMLElement reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(String | HTMLElement)} [options.content] The content to be shown into the Popover container.
     * @returns {popover} Returns a new instance of Popover.
     * @example
     * // Create a new Popover.
     * var popover = new ch.Popover([el], [options]);
     * @example
     * // Create a new Popover with disabled effects.
     * var popover = new ch.Popover(el, {
     *     'fx': 'none'
     * });
     * @example
     * // Create a new Popover using the shorthand way (content as parameter).
     * var popover = new ch.Popover(document.querySelector('.popover'), {'content': 'http://ui.ml.com:3040/ajax'});
     */
    function Popover(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Popover is created.
             * @memberof! ch.Popover.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Popover#ready
         * @example
         * // Subscribe to "ready" event.
         * popover.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    var document = window.document,
        body = document.body,
        // Inheritance
        parent = ch.util.inherits(Popover, ch.Component),
        shownbyEvent = {
            'pointertap': ch.onpointertap,
            'pointerenter': ch.onpointerenter
        };

    /**
     * The name of the component.
     * @memberof! ch.Popover.prototype
     * @type {String}
     */
    Popover.prototype.name = 'popover';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Popover.prototype
     * @function
     */
    Popover.prototype.constructor = Popover;

    /**
     * Configuration by default.
     * @memberof! ch.Popover.prototype
     * @type {Object}
     * @private
     */
    Popover.prototype._defaults = {
        '_ariaRole': 'dialog',
        '_className': '',
        '_hideDelay': 400,
        'addClass': '',
        'fx': 'fadeIn',
        'width': 'auto',
        'height': 'auto',
        'shownby': 'pointertap',
        'hiddenby': 'button',
        'waiting': '<div class="ch-loading ch-loading-centered"></div>',
        'position': 'absolute'
    };

    /**
     * Initialize a new instance of Popover and merge custom options with defaults options.
     * @memberof! ch.Popover.prototype
     * @function
     * @private
     * @returns {popover}
     */
    Popover.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

        // Require abilities
        this.require('Collapsible', 'Content');

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            container = document.createElement('div');

        container.innerHTML = [
            '<div',
            ' class="ch-popover ch-hide ' + this._options._className + ' ' + this._options.addClass +
                (ch.support.transition && this._options.fx !== 'none' && this._options.fx !== false ? ' ch-fx' : '') + '"',
            ' role="' + this._options._ariaRole + '"',
            ' id="ch-' + this.name + '-' + this.uid + '"',
            ' style="z-index:' + (ch.util.zIndex += 1) + ';width:' + this._options.width + ';height:' + this._options.height + '"',
            '></div>'
        ].join('');

        /**
         * The popover container. It's the element that will be shown and hidden.
         * @type {HTMLDivElement}
         */
        this.container = container.querySelector('div');

        ch.Event.addListener(this.container, ch.onpointertap, function (event) {
            event.stopPropagation();
        });

        /**
         * Element where the content will be added.
         * @private
         * @type {HTMLDivElement}
         */
        this._content = document.createElement('div');

        ch.util.classList(this._content).add('ch-popover-content');

        this.container.appendChild(this._content);

        // Add functionality to the trigger if it exists
        this._configureTrigger();

        this._positioner = new ch.Positioner({
            'target': this.container,
            'reference': this._options.reference,
            'side': this._options.side,
            'align': this._options.align,
            'offsetX': this._options.offsetX,
            'offsetY': this._options.offsetY,
            'position': this._options.position
        });

        /**
         * Handler to execute the positioner refresh() method on layout changes.
         * @private
         * @function
         * @todo Define this function on prototype and use bind(): $document.on(ch.onlayoutchange, this.refreshPosition.bind(this));
         */
        this._refreshPositionListener = function () {
            if (that._shown) {
                that._positioner.refresh(options);
            }

            return that;
        };

        this._hideTimer = function () {
            that._timeout = window.setTimeout(function () {
                that.hide();
            }, that._options._hideDelay);
        }

        this._hideTimerCleaner = function () {
            window.clearTimeout(that._timeout);
        }

        // Configure the way it hides
        this._configureHiding();

        // Refresh position:
        // on layout change
        ch.Event.addListener(document, ch.onlayoutchange, this._refreshPositionListener)
        // on resize
        ch.viewport.on(ch.onresize, this._refreshPositionListener);

        this
            .once('_show', this._refreshPositionListener)
            // on content change
            .on('_contentchange', this._refreshPositionListener);

        return this;
    };

    /**
     * Adds functionality to the trigger. When a non-trigger popover is initialized, this method isn't executed.
     * @memberof! ch.Popover.prototype
     * @private
     * @function
     */
    Popover.prototype._configureTrigger = function () {

        if (this._el === undefined) {
            return;
        }

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            // It will be triggered on pointertap/pointerenter of the $trigger
            // It can toggle, show, or do nothing (in specific cases)
            showHandler = (function () {
                // Toggle as default
                var fn = that._toggle;
                // When a Popover is shown on pointerenter, it will set a timeout to manage when
                // to close the component. Avoid to toggle and let choise when to close to the timer
                if (that._options.shownby === 'pointerenter' || that._options.hiddenby === 'none' || that._options.hiddenby === 'button') {
                    fn = function () {
                        if (!that._shown) {
                            that.show();
                        }
                    };
                }

                return fn;
            }());

        /**
         * The original and entire element and its state, before initialization.
         * @private
         * @type {HTMLDivElement}
         */
        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._el.cloneNode(true);

        // Use the trigger as the positioning reference
        this._options.reference = this._options.reference || this._el;

        // Open event when configured as able to shown anyway
        if (this._options.shownby !== 'none') {

            ch.util.classList(this._el).add('ch-shownby-' + this._options.shownby);

            ch.Event.addListener(this._el, shownbyEvent[this._options.shownby], function (event) {
                event.stopPropagation();
                ch.util.prevent(event);
                showHandler();
            });

        }

        // Get a content if it's not defined
        if (this._options.content === undefined) {
            // Content from anchor href
            // IE defines the href attribute equal to src attribute on images.
            if (this._el.nodeName === 'A' && this._el.href !== '') {
                this._options.content = this._el.href;

            // Content from title or alt
            } else if (this._el.title !== '' || this._el.alt !== '') {
                // Set the configuration parameter
                this._options.content = this._el.title || this._el.alt;
                // Keep the attributes content into the element for possible usage
                this._el.setAttribute('data-title', this._options.content);
                // Avoid to trigger the native tooltip
                this._el.title = this._el.alt = '';
            }
        }

        // Set WAI-ARIA
        this._el.setAttribute('aria-owns', 'ch-' + this.name + '-' + this.uid);
        this._el.setAttribute('aria-haspopup', 'true');

        /**
         * The popover trigger. It's the element that will show and hide the container.
         * @type {HTMLElement}
         */
        this.trigger = this._el;
    };

    /**
     * Determines how to hide the component.
     * @memberof! ch.Popover.prototype
     * @private
     * @function
     */
    Popover.prototype._configureHiding = function () {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            hiddenby = this._options.hiddenby,
            dummy,
            button,
            timeout,
            events = {};



        // Don't hide anytime
        if (hiddenby === 'none') { return; }

        // Hide by leaving the component
        if (hiddenby === 'pointerleave' && this.trigger !== undefined) {

            ch.Event.addListener(this.trigger, ch.onpointerenter, this._hideTimerCleaner);
            ch.Event.addListener(this.trigger, ch.onpointerleave, this._hideTimer);

            ch.Event.addListener(this.container, ch.onpointerenter, this._hideTimerCleaner);
            ch.Event.addListener(this.container, ch.onpointerleave, this._hideTimer);

        }

        // Hide with the button Close
        if (hiddenby === 'button' || hiddenby === 'all') {
            dummy = document.createElement('div');
            dummy.innerHTML = '<i class="ch-close" role="button" aria-label="Close"></i>';
            button = dummy.querySelector('i');

            ch.Event.addListener(button, ch.onpointertap, function () {
                that.hide();
            });

            this.container.insertBefore(button, this.container.firstChild);

        }

        if ((hiddenby === 'pointers' || hiddenby === 'all') && this._hidingShortcuts !== undefined) {
            this._hidingShortcuts();
        }

    };

    /**
     * Creates an options object from the parameters arriving to the constructor method.
     * @memberof! ch.Popover.prototype
     * @private
     * @function
     */
    Popover.prototype._normalizeOptions = function (options) {
        // IE8 and earlier don't define the node type constants, 1 === document.ELEMENT_NODE
        if (typeof options === 'string' || (typeof options === 'object' && options.nodeType !== undefined && options.nodeType === 1)) {
            options = {
                'content': options
            };
        }
        return options;
    };

    /**
     * Shows the popover container and appends it to the body.
     * @memberof! ch.Popover.prototype
     * @function
     * @param {(String | HTMLElement)} [content] The content that will be used by popover.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {popover}
     * @example
     * // Shows a basic popover.
     * popover.show();
     * @example
     * // Shows a popover with new content
     * popover.show('Some new content here!');
     * @example
     * // Shows a popover with a new content that will be loaded by ajax with some custom options
     * popover.show('http://domain.com/ajax/url', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Popover.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled || this._shown) {
            return this;
        }

        // Increase z-index and append to body
        // Do it before set content because when content sets, it triggers the position refresh
        this.container.style.zIndex = (ch.util.zIndex += 1);

        body.appendChild(this.container);

        // Open the collapsible
        this._show();

        // Request the content
        if (content !== undefined) {
            this.content(content, options);
        }

        return this;
    };

    /**
     * Hides the popover container and deletes it from the body.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {popover}
     * @example
     * // Close a popover
     * popover.hide();
     */
    Popover.prototype.hide = function() {
        var self = this,
            parent;
        // Don't execute when it's disabled
        if (!this._enabled || !this._shown) {
            return this;
        }

        // Detach the container from the DOM when it is hidden
        this.once('hide', function() {
            // Due to transitions this._shown can be outdated here
            parent = self.container.parentNode;
            if (parent !== null) {
                parent.removeChild(self.container);
            }
        });

        // Close the collapsible
        this._hide();

        return this;
    };

    /**
     * Returns a Boolean specifying if the container is shown or not.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Check the popover status
     * popover.isShown();
     * @example
     * // Check the popover status after an user action
     * $(window).on(ch.onpointertap, function () {
     *     if (popover.isShown()) {
     *         alert('Popover: visible');
     *     } else {
     *         alert('Popover: not visible');
     *     }
     * });
     */
    Popover.prototype.isShown = function () {
        return this._shown;
    };

    /**
     * Sets or gets the width of the container.
     * @memberof! ch.Popover.prototype
     * @function
     * @param {String} [data] Set a width for the container.
     * @returns {(Number | popover)}
     * @example
     * // Set a new popover width
     * component.width('300px');
     * @example
     * // Get the current popover width
     * component.width(); // '300px'
     */
    Popover.prototype.width = function (data) {

        if (data === undefined) {
            return this._options.width;
        }

        this.container.style.width = data;

        this._options.width = data;

        this.refreshPosition();

        return this;
    };

    /**
     * Sets or gets the height of the container.
     * @memberof! ch.Popover.prototype
     * @function
     * @param {String} [data] Set a height for the container.
     * @returns {(Number | popover)}
     * @example
     * // Set a new popover height
     * component.height('300px');
     * @example
     * // Get the current popover height
     * component.height(); // '300px'
     */
    Popover.prototype.height = function (data) {

        if (data === undefined) {
            return this._options.height;
        }

        this.container.style.height = data;

        this._options.height = data;

        this.refreshPosition();

        return this;
    };

    /**
     * Updates the current position of the container with given options or defaults.
     * @memberof! ch.Popover.prototype
     * @function
     * @params {Object} [options] A configuration object.
     * @returns {popover}
     * @example
     * // Update the current position
     * popover.refreshPosition();
     * @example
     * // Update the current position with a new offsetX and offsetY
     * popover.refreshPosition({
     *     'offestX': 100,
     *     'offestY': 10
     * });
     */
    Popover.prototype.refreshPosition = function (options) {

        if (this._shown) {
            // Refresh its position.
            this._positioner.refresh(options);

        } else {
            // Update its options. It will update position the next time to be shown.
            this._positioner._configure(options);
        }

        return this;
    };

    /**
     * Enables a Popover instance.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {popover}
     * @example
     * // Enable a popover
     * popover.enable();
     */
    Popover.prototype.enable = function () {

        if (this._el !== undefined) {
            this._el.setAttribute('aria-disabled', false);
        }

        parent.enable.call(this);

        return this;
    };

    /**
     * Disables a Popover instance.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {popover}
     * @example
     * // Disable a popover
     * popover.disable();
     */
    Popover.prototype.disable = function () {

        if (this._el !== undefined) {
            this._el.setAttribute('aria-disabled', true);
        }

        if (this._shown) {
            this.hide();
        }

        parent.disable.call(this);

        return this;
    };

    /**
     * Destroys a Popover instance.
     * @memberof! ch.Popover.prototype
     * @function
     * @returns {popover}
     * @example
     * // Destroy a popover
     * popover.destroy();
     * // Empty the popover reference
     * popover = undefined;
     */
    Popover.prototype.destroy = function () {

        if (this.trigger !== undefined) {

            ch.Event.removeListener(this.trigger, ch.onpointerenter, this._hideTimerCleaner);
            ch.Event.removeListener(this.trigger, ch.onpointerleave, this._hideTimer);

            ch.util.classList(this.trigger).remove('ch-' + this.name + '-trigger');

            this.trigger.removeAttribute('data-title');
            this.trigger.removeAttribute('aria-owns');
            this.trigger.removeAttribute('aria-haspopup');
            this.trigger.removeAttribute('data-side');
            this.trigger.removeAttribute('data-align');
            this.trigger.removeAttribute('role');

            this._snippet.alt ? this.trigger.setAttribute('alt', this._snippet.alt) : null;
            this._snippet.title ? this.trigger.setAttribute('title', this._snippet.title) : null;
        }

        ch.Event.removeListener(document, ch.onlayoutchange, this._refreshPositionListener);

        ch.viewport.off(ch.onresize, this._refreshPositionListener);

        parent.destroy.call(this);

        return;
    };

    ch.factory(Popover, Popover.prototype._normalizeOptions);

}(this, this.ch));

(function (window, ch) {
    'use strict';

    var document = window.document;

    ch.Popover.prototype._hidingShortcuts = function () {

        var that = this;

        function hide(event) {
            // event.button === 0: Fix issue #933 Right click closes it on Firefox.
            if (event.target !== that._el && event.target !== that.container && event.button === 0) {
                that.hide();
            }
        }

        ch.shortcuts.add(ch.onkeyesc, this.uid, function () {
            that.hide();
        });

        this
            .on('show', function () {
                ch.shortcuts.on(that.uid);
                ch.Event.addListener(document, ch.onpointertap, hide);
            })
            .on('hide', function () {
                ch.shortcuts.off(that.uid);
                ch.Event.removeListener(document, ch.onpointertap, hide);
            })
            .once('destroy', function () {
                ch.shortcuts.remove(that.uid, ch.onkeyesc);
            });
    };

}(this, this.ch));
(function (window, ch) {
    'use strict';

    /**
     * Layer is a dialog window that can be shown one at a time.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {String} [el] A HTMLElement to create an instance of ch.Layer.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointerenter".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointerleave".
     * @param {HTMLElement} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "left".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 10.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {( String | HTMLElement)} [options.content] The content to be shown into the Layer container.
     * @returns {layer} Returns a new instance of Layer.
     * @example
     * // Create a new Layer.
     * var layer = new ch.Layer([el], [options]);
     * @example
     * // Create a new Layer with disabled effects.
     * var layer = new ch.Layer({
     *     'content': 'This is the content of the Layer'
     * });
     * @example
     * // Create a new Layer using the shorthand way (content as parameter).
     * var layer = new ch.Layer('http://ui.ml.com:3040/ajax');
     */
    function Layer(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Layer is created.
             * @memberof! ch.Layer.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Layer#ready
         * @example
         * // Subscribe to "ready" event.
         * layer.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Reference to the last component open. Allows to close and to deny to
    // have 2 components open at the same time
    var lastShown,
        // Inheritance
        parent = ch.util.inherits(Layer, ch.Popover);

    /**
     * The name of the component.
     * @memberof! ch.Layer.prototype
     * @type {String}
     */
    Layer.prototype.name = 'layer';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Layer.prototype
     * @function
     */
    Layer.prototype.constructor = Layer;

    /**
     * Configuration by default.
     * @memberof! ch.Layer.prototype
     * @type {Object}
     * @private
     */
    Layer.prototype._defaults = ch.util.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-layer ch-box-lite ch-cone',
        '_ariaRole': 'tooltip',
        'shownby': 'pointerenter',
        'hiddenby': 'pointerleave',
        'side': 'bottom',
        'align': 'left',
        'offsetX': 0,
        'offsetY': 10,
        'waiting': '<div class="ch-loading-small"></div>'
    });

    /**
     * Shows the layer container and hides other layers.
     * @memberof! ch.Layer.prototype
     * @function
     * @param {(String | HTMLElement)} [content] The content that will be used by layer.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {layer}
     * @example
     * // Shows a basic layer.
     * layer.show();
     * @example
     * // Shows a layer with new content
     * layer.show('Some new content here!');
     * @example
     * // Shows a layer with a new content that will be loaded by ajax with some custom options
     * layer.show('http://domain.com/ajax/url', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Layer.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled || this._shown) {
            return this;
        }

        // Only hide if there was a component opened before
        if (lastShown !== undefined && lastShown.name === this.name && lastShown !== this) {
            lastShown.hide();
        }

        // Only save to future close if this component is closable
        if (this._options.hiddenby !== 'none' && this._options.hiddenby !== 'button') {
            lastShown = this;
        }

        // Execute the original show()
        parent.show.call(this, content, options);

        return this;
    };

    ch.factory(Layer, parent._normalizeOptions);

}(this, this.ch));

(function (ch) {
    'use strict';

    /**
     * Improves the native tooltips.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Tooltip.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointerenter".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointerleave".
     * @param {HTMLElement} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "left".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 10.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '<div class="ch-loading ch-loading-centered"></div>'.
     * @param {(String | HTMLElement)} [options.content] The content to be shown into the Tooltip container.
     * @returns {tooltip} Returns a new instance of Tooltip.
     * @example
     * // Create a new Tooltip.
     * var tooltip = new ch.Tooltip(document.querySelector('.trigger'), [options]);
     * @example
     * // Create a new Tooltip using the shorthand way (content as parameter).
     * var tooltip = new ch.Tooltip(document.querySelector('.trigger'), {'content': 'http://ui.ml.com:3040/ajax'});
     */
    function Tooltip(el, options) {

        // TODO: Review what's going on here with options
        /*
        if (options === undefined && el !== undefined && el.nodeType !== undefined) {
            options = el;
            el = undefined;
        }
        */

        options = ch.util.extend(ch.util.clone(this._defaults), options);

        return new ch.Layer(el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Tooltip.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var tooltip = $(selector).data('tooltip');
     */
    Tooltip.prototype.name = 'tooltip';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Tooltip.prototype
     * @function
     */
    Tooltip.prototype.constructor = Tooltip;

    /**
     * Configuration by default.
     * @memberof! ch.Tooltip.prototype
     * @type {Object}
     * @private
     */
    Tooltip.prototype._defaults = ch.util.extend(ch.util.clone(ch.Layer.prototype._defaults), {
        '_className': 'ch-tooltip ch-cone'
    });

    ch.factory(Tooltip, ch.Layer.prototype._normalizeOptions);

}(this.ch));

(function (window, ch) {
    'use strict';

    /**
     * Dialog window with an error skin.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Positioner
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Bubble.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "none".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "none".
     * @param {HTMLElement} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 10.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(String | HTMLElement)} [options.content] The content to be shown into the Bubble container. Default: "Check the information, please."
     * @returns {bubble} Returns a new instance of Bubble.
     * @example
     * // Create a new Bubble.
     * var bubble = new ch.Bubble($el, [options]);
     * @example
     * // Create a new Bubble with disabled effects.
     * var bubble = new ch.Bubble({
     *     'fx': 'none'
     * });
     * @example
     * // Create a new Bubble using the shorthand way (content as parameter).
     * var bubble = new ch.Bubble('http://ui.ml.com:3040/ajax');
     */
    function Bubble(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Bubble is created.
             * @memberof! ch.Bubble.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Bubble#ready
         * @example
         * // Subscribe to "ready" event.
         * bubble.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Bubble, ch.Popover);

    /**
     * The name of the component.
     * @memberof! ch.Bubble.prototype
     * @type {String}
     */
    Bubble.prototype.name = 'bubble';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Bubble.prototype
     * @function
     */
    Bubble.prototype.constructor = Bubble;

    /**
     * Configuration by default.
     * @memberof! ch.Bubble.prototype
     * @type {Object}
     * @private
     */
    Bubble.prototype._defaults = ch.util.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-bubble ch-box-icon ch-box-error ch-cone',
        '_ariaRole': 'alert',
        'shownby': 'none',
        'hiddenby': 'none',
        'side': 'right',
        'align': 'center',
        'offsetX': 10,
        'content': 'Check the information, please.'
    });

    /**
     * Initialize a new instance of Bubble and merge custom options with defaults options.
     * @memberof! ch.Bubble.prototype
     * @function
     * @private
     * @returns {bubble}
     */
    Bubble.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

        this.container.insertAdjacentHTML('beforeend', '<i class="ch-icon-remove-sign"></i>');

        return this;
    };

    ch.factory(Bubble, parent._normalizeOptions);

}(this, this.ch));

(function (window, ch) {
    'use strict';

    /**
     * Modal is a dialog window with an underlay.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {HTMLElement} [el] A HTMLElement to create an instance of ch.Modal.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "50%".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "all".
     * @param {HTMLElement} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "fixed".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading-large ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(String | HTMLElement)} [options.content] The content to be shown into the Modal container.
     * @returns {modal} Returns a new instance of Modal.
     * @example
     * // Create a new Modal.
     * var modal = new ch.Modal([el], [options]);
     * @example
     * // Create a new Modal.
     * var modal = new ch.Modal([options]);
     * @example
     * // Create a new Modal with disabled effects.
     * var modal = new ch.Modal({
     *     'content': 'This is the content of the Modal'
     * });
     * @example
     * // Create a new Modal using the shorthand way (content as parameter).
     * var modal = new ch.Modal('http://ui.ml.com:3040/ajax');
     */
    function Modal(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Modal is created.
             * @memberof! ch.Modal.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Modal#ready
         * @example
         * // Subscribe to "ready" event.
         * modal.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    var document = window.document,
        body = document.body,
        underlay = (function () {
            var dummyElement = document.createElement('div');
            dummyElement.innerHTML = '<div class="ch-underlay" tabindex="-1"></div>';

            return dummyElement.querySelector('div');
        }()),
        // Inheritance
        parent = ch.util.inherits(Modal, ch.Popover);

    /**
     * The name of the component.
     * @memberof! ch.Modal.prototype
     * @type {String}
     */
    Modal.prototype.name = 'modal';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Modal.prototype
     * @function
     */
    Modal.prototype.constructor = Modal;

    /**
     * Configuration by default.
     * @memberof! ch.Modal.prototype
     * @type {Object}
     * @private
     */
    Modal.prototype._defaults = ch.util.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-modal ch-box-lite',
        '_ariaRole': 'dialog',
        'width': '50%',
        'hiddenby': 'all',
        'reference': ch.viewport,
        'waiting': '<div class="ch-loading-large ch-loading-centered"></div>',
        'position': 'fixed'
    });

    /**
     * Shows the Modal underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @private
     */
    Modal.prototype._showUnderlay = function () {
        var useAnimation = ch.support.transition && this._options.fx !== 'none' && this._options.fx !== false,
            fxName = 'ch-fx-' + this._options.fx.toLowerCase(),
            cl = ch.util.classList(underlay);

        underlay.style.zIndex = ch.util.zIndex;

        body.appendChild(underlay);

        function showCallback(e) {
            cl.remove(fxName + '-enter-active');
            cl.remove(fxName + '-enter');

            ch.Event.removeListener(e.target, e.type, showCallback);
        }

        if (useAnimation) {
            cl.add(fxName + '-enter');
            setTimeout(function() {
                cl.add(fxName + '-enter-active');
            },10);
            ch.Event.addListener(underlay, ch.support.transition.end, showCallback);
        }
    };

    /**
     * Hides the Modal underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @private
     */
    Modal.prototype._hideUnderlay = function () {
        var useAnimation = ch.support.transition && this._options.fx !== 'none' && this._options.fx !== false,
            fxName = 'ch-fx-' + this._options.fx.toLowerCase(),
            cl = ch.util.classList(underlay),
            parent = underlay.parentNode;

        function hideCallback(e) {
            cl.remove(fxName + '-leave-active');
            cl.remove(fxName + '-leave');

            ch.Event.removeListener(e.target, e.type, hideCallback);
            parent.removeChild(underlay);
        }

        if (useAnimation) {
            cl.add(fxName + '-leave');
            setTimeout(function() {
                cl.add(fxName + '-leave-active');
            },10);
            ch.Event.addListener(underlay, ch.support.transition.end, hideCallback);
        } else {
            parent.removeChild(underlay);
        }
    };

    /**
     * Shows the modal container and the underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @param {(String | HTMLElement)} [content] The content that will be used by modal.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {modal}
     * @example
     * // Shows a basic modal.
     * modal.show();
     * @example
     * // Shows a modal with new content
     * modal.show('Some new content here!');
     * @example
     * // Shows a modal with a new content that will be loaded by ajax with some custom options
     * modal.show('http://domain.com/ajax/url', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Modal.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled || this._shown) {
            return this;
        }

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        function hideByUnderlay(e) {
            that.hide();
            // Allow only one click to analyze the config every time and to close ONLY THIS modal
            e.target.removeEventListener(e.type, hideByUnderlay);
        }

        // Add to the underlay the ability to hide the component
        if (this._options.hiddenby === 'all' || this._options.hiddenby === 'pointers') {
            ch.Event.addListener(underlay, ch.onpointertap, hideByUnderlay);
        }

        // Show the underlay
            this._showUnderlay();
        // Execute the original show()
        parent.show.call(this, content, options);

        return this;
    };

    /**
     * Hides the modal container and the underlay.
     * @memberof! ch.Modal.prototype
     * @function
     * @returns {modal}
     * @example
     * // Close a modal
     * modal.hide();
     */
    Modal.prototype.hide = function () {
        if (!this._shown) {
            return this;
        }

        // Delete the underlay listener
        ch.Event.removeListener(underlay, ch.onpointertap)
        // Hide the underlay element
        this._hideUnderlay();
        // Execute the original hide()
        parent.hide.call(this);

        return this;
    };

    ch.factory(Modal, parent._normalizeOptions);

}(this, this.ch));

(function (ch) {
    'use strict';

    /**
     * Transition lets you give feedback to the users when their have to wait for an action.
     * @memberof ch
     * @constructor
     * @augments ch.Popover
     * @param {HTMLElement} [el] A HTMLElement to create an instance of ch.Transition.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "fadeIn".
     * @param {String} [options.width] Set a width for the container. Default: "50%".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "none".
     * @param {String} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: ch.viewport.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "fixed".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(HTMLElement | String)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading-large ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {(HTMLElement | String)} [options.content] The content to be shown into the Transition container. Default: "Please wait..."
     * @returns {transition} Returns a new instance of Transition.
     * @example
     * // Create a new Transition.
     * var transition = new ch.Transition([el], [options]);
     * @example
     * // Create a new Transition with disabled effects.
     * var transition = new ch.Transition({
     *     'fx': 'none'
     * });
     * @example
     * // Create a new Transition using the shorthand way (content as parameter).
     * var transition = new ch.Transition('http://ui.ml.com:3040/ajax');
     */
    function Transition(el, options) {

        if (el === undefined || options === undefined) {
            options = {};
        }

        options.content = (function () {
            var dummyElement = document.createElement('div'),
                content = options.waiting || '';

            // TODO: options.content could be a HTMLElement
            dummyElement.innerHTML = '<div class="ch-loading-large"></div><p>' + content + '</p>';

            return dummyElement.firstChild;
        }());

        // el is not defined
        if (el === undefined) {
            el = ch.util.extend(ch.util.clone(this._defaults), options);
        // el is present as a object configuration
        } else if (el.nodeType === undefined && typeof el === 'object') {
            el = ch.util.extend(ch.util.clone(this._defaults), el);
        } else if (options !== undefined) {
            options = ch.util.extend(ch.util.clone(this._defaults), options);
        }

        return new ch.Modal(el, options);
    }

    /**
     * The name of the component.
     * @memberof! ch.Transition.prototype
     * @type {String}
     */
    Transition.prototype.name = 'transition';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Transition.prototype
     * @function
     */
    Transition.prototype.constructor = Transition;

    /**
     * Configuration by default.
     * @memberof! ch.Transition.prototype
     * @type {Object}
     * @private
     */
    Transition.prototype._defaults = ch.util.extend(ch.util.clone(ch.Modal.prototype._defaults), {
        '_className': 'ch-transition ch-box-lite',
        '_ariaRole': 'alert',
        'hiddenby': 'none',
        'content': 'Please wait...'
    });

    ch.factory(Transition, ch.Modal.prototype._normalizeOptions);

}(this.ch));

(function (window, ch) {
    'use strict';

    /**
     * Zoom shows a contextual reference to an augmented version of a declared image.
     * @memberof ch
     * @constructor
     * @augments ch.Layer
     * @requires ch.OnImagesLoads
     * @param {String} selector A CSS Selector to create an instance of ch.Zoom.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "none".
     * @param {String} [options.width] Set a width for the container. Default: "300px".
     * @param {String} [options.height] Set a height for the container. Default: "300px".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointerenter".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointerleave".
     * @param {String} [options.reference] It's a CSS Selector reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "right".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "top".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally. Default: 20.
     * @param {Number} [options.offsetY] Distance to displace the target vertically. Default: 0.
     * @param {String} [options.position] The type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: 'Loading zoom...'.
     * @param {(HTMLElement | String)} [options.content] The content to be shown into the Zoom container.
     * @returns {zoom} Returns a new instance of Zoom.
     * @example
     * // Create a new Zoom.
     * var zoom = new ch.Zoom([selector], [options]);
     * @example
     * // Create a new Zoom with a defined width (half of the screen).
     * var zoom = new ch.Zoom({
     *     'width': (ch.viewport.width / 2) + 'px'
     * });
     */
    function Zoom(selector, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(selector, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Zoom is created.
             * @memberof! ch.Zoom.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Zoom#ready
         * @example
         * // Subscribe to "ready" event.
         * zoom.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Zoom, ch.Layer);

    /**
     * The name of the component.
     * @memberof! ch.Zoom.prototype
     * @type {String}
     */
    Zoom.prototype.name = 'zoom';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Zoom.prototype
     * @function
     */
    Zoom.prototype.constructor = Zoom;

    /**
     * Configuration by default.
     * @memberof! ch.Zoom.prototype
     * @type {Object}
     * @private
     */
    Zoom.prototype._defaults = ch.util.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-zoom',
        '_ariaRole': 'tooltip',
        '_hideDelay': 0,
        'fx': 'none',
        'width': '300px',
        'height': '300px',
        'side': 'right',
        'align': 'top',
        'offsetX': 20,
        'offsetY': 0,
        'waiting': 'Loading zoom...'
    });

    /**
     * Initialize a new instance of Zoom and merge custom options with defaults options.
     * @memberof! ch.Zoom.prototype
     * @function
     * @private
     * @returns {zoom}
     */
    Zoom.prototype._init = function (selector, options) {
        // Call to its parent init method
        parent._init.call(this, selector, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * Flag to control when zoomed image is loaded.
         * @type {Boolean}
         * @private
         */
        this._loaded = false;

        /**
         * Feedback showed before the zoomed image is load. It's a transition message and its content can be configured through parameter "waiting".
         * @type {HTMLElement}
         * @private
         * @example
         * // Changing the loading feedback.
         * var zoom = new ch.Zoom({
         *     'waiting': 'My custom message'
         * });
         */
        this._loading = (function() {
            var dummyElement = document.createElement('div');
                dummyElement.innerHTML = '<div class="ch-zoom-loading ch-hide"><div class="ch-loading-large"></div><p>' + that._options.waiting + '</p></div>';

            return dummyElement.firstChild;
        }());

        this.trigger.appendChild(this._loading);


        /**
         * HTML Element shape with visual feedback to the relative size of the zoomed area.
         * @type {HTMLDivElement}
         * @private
         */
        this._seeker = (function (){
            var dummyElement = document.createElement('div');
                dummyElement.innerHTML = '<div class="ch-zoom-seeker ch-hide"></div>';

            return dummyElement.firstChild;
        }());

        this.trigger.appendChild(this._seeker);

        /**
         * The main specified image with original size (not zoomed).
         * @type {HTMLElement}
         * @private
         */
        this._original = this.trigger.children[0];

        /**
         * The zoomed image specified as a link href (see the HTML snippet).
         * @type {HTMLImageElement}
         * @private
         */
        // Use a new Image to calculate the
        // size before append the image to DOM, in ALL the browsers.
        this._zoomed = new window.Image();

        // Assign event handlers to the original image
        ch.onImagesLoads(this._original, function () {
            that._originalLoaded();
        });

        // Assign event handlers to the zoomed image
        ch.onImagesLoads(this._zoomed, function () {
            that._zoomedLoaded();
        });

        // Make the entire Show process if it tried to show before
        this.on('imageload', function () {
            if (!ch.util.classList(this._loading).contains('ch-hide')) {
                that.show();
                ch.util.classList(this._loading).add('ch-hide');
            }
        });

        // Assign event handlers to the anchor
        ch.util.classList(this.trigger).add('ch-zoom-trigger');

        // Prevent to redirect to the href
        ch.Event.addListener(this.trigger, 'click', function (event) { ch.util.prevent(event); }, false);

        // Bind move calculations
        ch.Event.addListener(this.trigger, ch.onpointermove, function (event) { that._move(event); }, false);

        return this;
    };

    /**
     * Sets the correct size to the wrapper anchor.
     * @memberof! ch.Zoom.prototype
     * @function
     * @private
     */
    Zoom.prototype._originalLoaded = function () {

        var width = this._original.width,
            height = this._original.height,
            offset = ch.util.getOffset(this._el);

        // Set the wrapper anchor size (same as image)
        this.trigger.style.width = width + 'px';
        this.trigger.style.height = height + 'px';

        // Loading position centered into the anchor
        this._loading.style.display = 'block';
        this._loading.style.left = (width - this._loading.clientWidth) / 2 + 'px',
        this._loading.style.top = (height - this._loading.clientHeight) / 2 + 'px';
        this._loading.style.display = '';

        /**
         * Width of the original specified image.
         * @type {Number}
         * @private
         */
        this._originalWidth = width;

        /**
         * Height of the original specified image.
         * @type {Number}
         * @private
         */
        this._originalHeight = height;

        /**
         * Left position of the original specified anchor/image.
         * @type {Number}
         * @private
         */
        this._originalOffsetLeft = offset.left;

        /**
         * Top position of the original specified anchor/image.
         * @type {Number}
         * @private
         */
        this._originalOffsetTop = offset.top;
    };

    /**
     * Loads the Zoom content and sets the Seeker size.
     * @memberof! ch.Zoom.prototype
     * @function
     * @private
     */
    Zoom.prototype._zoomedLoaded = function () {

        /**
         * Relation between the zoomed and the original image width.
         * @type {Number}
         * @private
         */
        this._ratioX = (this._zoomed.width / this._originalWidth);

        /**
         * Relation between the zoomed and the original image height.
         * @type {Number}
         * @private
         */
        this._ratioY = (this._zoomed.height / this._originalHeight);

        /**
         * Width of the Seeker, calculated from ratio.
         * @type {Number}
         * @private
         */
        this._seekerWidth = window.Math.floor(window.parseInt(this._options.width, 10) / this._ratioX);

        /**
         * Height of the Seeker, calculated from ratio.
         * @type {Number}
         * @private
         */
        this._seekerHeight = window.Math.floor(window.parseInt(this._options.height, 10) / this._ratioY);

        /**
         * Half of the width of the Seeker. Used to position it.
         * @type {Number}
         * @private
         */
        this._seekerHalfWidth = window.Math.floor(this._seekerWidth / 2);

        /**
         * Half of the height of the Seeker. Used to position it.
         * @type {Number}
         * @private
         */
        this._seekerHalfHeight = window.Math.floor(this._seekerHeight / 2);

        // Set size of the Seeker
        this._seeker.style.cssText = 'width:' + this._seekerWidth + 'px;height:' + this._seekerHeight + 'px';

        // Use the zoomed image as content for the floated element
        this.content(this._zoomed);

        // Update the flag to allow to zoom
        this._loaded = true;

        /**
         * Event emitted when the zoomed image is downloaded.
         * @event ch.Zoom#imageload
         * @example
         * // Subscribe to "imageload" event.
         * zoom.on('imageload', function () {
         *     alert('Zoomed image ready!');
         * });
         */
        this.emit('imageload');
    };

    /**
     * Calculates movement limits and sets it to Seeker and zoomed image.
     * @memberof! ch.Zoom.prototype
     * @function
     * @private
     * @param {Event} event Used to take the cursor position.
     */
    Zoom.prototype._move = function (event) {
        // Don't execute when it's disabled or it's not loaded
        if (!this._enabled || !this._loaded) {
            return;
        }

        // By defining these variables in here, it avoids to make
        // the substraction twice if it's a free movement
        var pageX = (event.pageX || event.clientX + document.documentElement.scrollLeft),
            pageY = (event.pageY || event.clientY + document.documentElement.scrollTop),
            seekerLeft = pageX - this._seekerHalfWidth,
            seekerTop = pageY - this._seekerHalfHeight,
            x,
            y;

        // Left side of seeker LESS THAN left side of image
        if (seekerLeft <= this._originalOffsetLeft) {
            x = 0;
        // Right side of seeker GREATER THAN right side of image
        } else if (pageX + this._seekerHalfWidth > this._originalWidth + this._originalOffsetLeft) {
            x = this._originalWidth - this._seekerWidth - 2;
        // Free move
        } else {
            x = seekerLeft - this._originalOffsetLeft;
        }

        // Top side of seeker LESS THAN top side of image
        if (seekerTop <= this._originalOffsetTop) {
            y = 0;
        // Bottom side of seeker GREATER THAN bottom side of image
        } else if (pageY + this._seekerHalfHeight > this._originalHeight + this._originalOffsetTop) {
            y = this._originalHeight - this._seekerHeight - 2;
        // Free move
        } else {
            y = seekerTop - this._originalOffsetTop;
        }

        // Move seeker and the zoomed image
        this._seeker.style.left = x + 'px';
        this._seeker.style.top = y + 'px';
        this._zoomed.style.cssText = 'left:' + (-this._ratioX * x) + 'px;top:' + (-this._ratioY * y) + 'px';
    };

    /**
     * Shows the zoom container and the Seeker, or show a loading feedback until the zoomed image loads.
     * @memberof! ch.Zoom.prototype
     * @function
     * @param {(String | HTMLElement)} [content] The content that will be used by dropdown.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {zoom}
     * @example
     * // Shows a basic zoom.
     * zoom.show();
     * @example
     * // Shows a zoom with new content
     * zoom.show('Some new content here!');
     * @example
     * // Shows a zoom with a new content that will be loaded by ajax with some custom options
     * zoom.show('http://domain.com/ajax/url', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Zoom.prototype.show = function (content, options) {
        var parentElement;
        // Don't execute when it's disabled
        if (!this._enabled || this._shown) {
            return this;
        }

        // Show feedback and trigger the image load, if it's not loaded
        if (!this._loaded) {
            ch.util.classList(this._loading).remove('ch-hide');
            this.loadImage();
            return this;
        }

        // Delete the Loading and show the Seeker
        ch.util.classList(this._seeker).remove('ch-hide');

        // Execute the original show()
        parent.show.call(this, content, options);

        return this;
    };

    /**
     * Hides the zoom container and the Seeker.
     * @memberof! ch.Zoom.prototype
     * @function
     * @returns {zoom}
     * @example
     * // Close a zoom
     * zoom.hide();
     */
    Zoom.prototype.hide = function () {
        if (!this._shown) {
            return this;
        }

        // Avoid unnecessary execution
        if (!this._loaded) {
            ch.util.classList(this._loading).add('ch-hide');
            return this;
        }

        ch.util.classList(this._seeker).add('ch-hide');

        parent.hide.call(this);

        return this;
    };

    /**
     * Adds the zoomed image source to the <img> tag to trigger the request.
     * @memberof! ch.Zoom.prototype
     * @function
     * @returns {zoom}
     * @example
     * // Load the zoomed image on demand.
     * component.loadImage();
     */
    Zoom.prototype.loadImage = function () {

        this._zoomed.src = this._el.href;

        return this;
    };

    /**
     * Destroys a Zoom instance.
     * @memberof! ch.Zoom.prototype
     * @function
     * @returns {zoom}
     * @example
     * // Destroy a zoom
     * zoom.destroy();
     * // Empty the zoom reference
     * zoom = undefined;
     */
    Zoom.prototype.destroy = function () {
        var parentElement;

        parentElement = ch.util.parentElement(this._seeker);
        parentElement.removeChild(this._seeker);

        parent.destroy.call(this);

        return;
    };

    ch.factory(Zoom, parent._normalizeOptions);

}(this, this.ch));

(function (window, ch) {
    'use strict';

    function normalizeOptions(options) {
        if (typeof options === 'string' || ch.util.isArray(options)) {
            options = {
                'selected': options
            };
        }
        return options;
    }

    /**
     * It lets you move across the months of the year and allow to set dates as selected.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Calendar.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.format] Sets the date format. You must use "DD/MM/YYYY", "MM/DD/YYYY" or "YYYY/MM/DD". Default: "DD/MM/YYYY".
     * @param {String} [options.selected] Sets a date that should be selected by default. Default: The date of today.
     * @param {String} [options.from] Set a minimum selectable date. The format of the given date should be YYYY/MM/DD.
     * @param {String} [options.to] Set a maximum selectable date. The format of the given date should be YYYY/MM/DD.
     * @param {Array} [options.monthsNames] A collection of months names. Default: ["Enero", ... , "Diciembre"].
     * @param {Array} [options.weekdays] A collection of weekdays. Default: ["Dom", ... , "Sab"].
     * @returns {calendar} Returns a new instance of Calendar.
     * @example
     * // Create a new Calendar.
     * var calendar = new ch.Calendar([el], [options]);
     * @example
     * // Creates a new Calendar with custom options.
     * var calendar =  new ch.Calendar({
     *     'format': 'MM/DD/YYYY',
     *     'selected': '2011/12/25',
     *     'from': '2010/12/25',
     *     'to': '2012/12/25',
     *     'monthsNames': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
     *     'weekdays': ['Su', 'Mo', 'Tu', 'We', 'Thu', 'Fr', 'Sa']
     * });
     * @example
     * // Creates a new Calendar using a shorthand way (selected date as parameter).
     * var calendar = new ch.Calendar('2011/12/25');
     */
    function Calendar(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Calendar is created.
             * @memberof! ch.Calendar.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Calendar#ready
         * @example
         * // Subscribe to "ready" event.
         * calendar.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    /**
     * Completes with zero the numbers less than 10.
     * @function
     * @private
     * @returns {String}
     */
    var addZero = function (num) {
            return (parseInt(num, 10) < 10) ? '0' + num : num;
        },

        /**
         * Map of date formats.
         * @type {Object}
         * @private
         */
        FORMAT_dates = {

            /**
             * Converts a given date to "YYYY/MM/DD" format.
             * @params {Date} date A given date to convert.
             * @function
             * @returns {String}
             */
            'YYYY/MM/DD': function (date) {
                return [date.year, addZero(date.month), addZero(date.day)].join('/');
            },

            /**
             * Converts a given date to "DD/MM/YYYY" format.
             * @params {Date} date A given date to convert.
             * @function
             * @returns {String}
             */
            'DD/MM/YYYY': function (date) {
                return [addZero(date.day), addZero(date.month), date.year].join('/');
            },

            /**
             * Converts a given date to "MM/DD/YYYY" format.
             * @params {Date} date A given date to convert.
             * @function
             * @returns {String}
             */
            'MM/DD/YYYY': function (date) {
                return [addZero(date.month), addZero(date.day), date.year].join('/');
            }
        },

        /**
         * Creates a JSON Object with reference to day, month and year, from a determinated date.
         * @function
         * @private
         * @returns {Object}
         */
        createDateObject = function (date) {

            // Uses date parameter or create a date from today
            date = (date === 'today') ? new Date() : new Date(date);

            /**
             * Returned custom Date object.
             * @type {Object}
             * @private
             */
            return {

                /**
                 * Reference to native Date object.
                 * @type {Date}
                 * @private
                 */
                'native': date,

                /**
                 * Number of day.
                 * @type {Number}
                 * @private
                 */
                'day': date.getDate(),

                /**
                 * Order of day in a week.
                 * @type {Number}
                 * @private
                 */
                'order': date.getDay(),

                /**
                 * Number of month.
                 * @type {Number}
                 * @private
                 */
                'month': date.getMonth() + 1,

                /**
                 * Number of full year.
                 * @type {Number}
                 * @private
                 */
                'year': date.getFullYear()
            };
        },

        /**
         * Templates of arrows to move around months.
         * @type {Object}
         * @private
         */
        arrows = {

            /**
             * Template of previous arrow.
             * @type {HTMLDivElement}
             */
            'prev': '<div class="ch-calendar-prev" role="button" aria-hidden="false"></div>',

            /**
             * Template of next arrow.
             * @type {HTMLDivElement}
             */
            'next': '<div class="ch-calendar-next" role="button" aria-hidden="false"></div>'
        },

        // Inheritance
        parent = ch.util.inherits(Calendar, ch.Component);

    /**
     * The name of the component.
     * @memberof! ch.Calendar.prototype
     * @type {String}
     */
    Calendar.prototype.name = 'calendar';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Calendar.prototype
     * @function
     */
    Calendar.prototype.constructor = Calendar;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Calendar.prototype._defaults = {
        'monthsNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        'weekdays': ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        'format': 'DD/MM/YYYY'
    };

    /**
     * Initialize a new instance of Calendar and merge custom options with defaults options.
     * @memberof! ch.Calendar.prototype
     * @function
     * @private
     * @returns {calendar}
     */
    Calendar.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._el.cloneNode(true);

        /**
         * Object to mange the date and its ranges.
         * @type {Object}
         * @private
         */
        this._dates = {
            'range': {}
        };

        this._dates.today = createDateObject('today');

        this._dates.current = this._dates.today;

        /**
         * Date of selected day.
         * @type {Object}
         * @private
         */
        this._dates.selected = (function () {

            // Get date from configuration or input value, if configured could be an Array with multiple selections
            var selected = that._options.selected;

            // Do it only if there are a "selected" parameter
            if (!selected) { return selected; }

            // Simple date selection
            if (!ch.util.isArray(selected)) {

                if (selected !== 'today') {
                    // Return date object and update currentDate
                    selected = that._dates.current = createDateObject(selected);

                } else {
                    selected = that._dates.today;
                }

            // Multiple date selection
            } else {
                selected.forEach(function (e, i){
                    // Simple date
                    if (!ch.util.isArray(e)) {
                        selected[i] = (selected[i] !== 'today') ? createDateObject(e) : that._dates.today;
                    // Range
                    } else {
                        selected[i][0] = (selected[i][0] !== 'today') ? createDateObject(e[0]) : that._dates.today;
                        selected[i][1] = (selected[i][1] !== 'today') ? createDateObject(e[1]) : that._dates.today;
                    }
                });
            }

            return selected;
        }());

        // Today's date object
        this._dates.today = createDateObject('today');

        // Minimum selectable date
        this._dates.range.from = (function () {

            // Only works when there are a "from" parameter on configuration
            if (that._options.from === undefined || !that._options.from) { return; }

            // Return date object
            return (that._options.from === 'today') ? that._dates.today : createDateObject(that._options.from);

        }());

        // Maximum selectable date
        this._dates.range.to = (function () {

            // Only works when there are a "to" parameter on configuration
            if (that._options.to === undefined || !that._options.to) { return; }

            // Return date object
            return (that._options.to === 'today') ? that._dates.today : createDateObject(that._options.to);

        }());

        /**
         * Template of previous arrow.
         * @type {HTMLDivElement}
         */
        this._prev = document.createElement('div');
        this._prev.setAttribute('aria-controls', 'ch-calendar-grid-' + this.uid);
        this._prev.setAttribute('role', 'button');
        this._prev.setAttribute('aria-hidden', 'false');
        ch.util.classList(this._prev).add('ch-calendar-prev');

        /**
         * Template of next arrow.
         * @type {HTMLDivElement}
         */
        this._next = document.createElement('div');
        this._next.setAttribute('aria-controls', 'ch-calendar-grid-' + this.uid);
        this._next.setAttribute('role', 'button');
        this._next.setAttribute('aria-hidden', 'false');
        ch.util.classList(this._next).add('ch-calendar-next');


        // Show or hide arrows depending on "from" and "to" limits
        ch.Event.addListener(this._prev, ch.onpointertap, function (event) { ch.util.prevent(event); that.prevMonth(); });
        ch.Event.addListener(this._next, ch.onpointertap, function (event) { ch.util.prevent(event); that.nextMonth(); });

        /**
         * The calendar container.
         * @type {HTMLElement}
         */
        this.container = this._el;
        this.container.insertBefore(this._prev, this.container.firstChild);
        this.container.insertBefore(this._next, this.container.firstChild);
        ch.util.classList(this.container).add('ch-calendar');
        this.container.insertAdjacentHTML('beforeend', this._createTemplate(this._dates.current));

        this._updateControls();

        // Avoid selection on the component
        ch.util.avoidTextSelection(that.container);

        return this;
    };

    /**
     * Checks if it has got a previous month to show depending on "from" limit.
     * @function
     * @private
     */
    Calendar.prototype._hasPrevMonth = function () {
        return this._dates.range.from === undefined || !(this._dates.range.from.month >= this._dates.current.month && this._dates.range.from.year >= this._dates.current.year);
    };

    /**
     * Checks if it has got a next month to show depending on "to" limits.
     * @function
     * @private
     */
    Calendar.prototype._hasNextMonth = function () {
        return this._dates.range.to === undefined || !(this._dates.range.to.month <= this._dates.current.month && this._dates.range.to.year <= this._dates.current.year);
    };

    /**
     * Refresh arrows visibility depending on "from" and "to" limits.
     * @function
     * @private
     */
    Calendar.prototype._updateControls = function () {

        // Show previous arrow when it's out of limit
        if (this._hasPrevMonth()) {
            ch.util.classList(this._prev).remove('ch-hide');
            this._prev.setAttribute('aria-hidden', 'false');

        // Hide previous arrow when it's out of limit
        } else {
            ch.util.classList(this._prev).add('ch-hide');
            this._prev.setAttribute('aria-hidden', 'true');
        }

        // Show next arrow when it's out of limit
        if (this._hasNextMonth()) {
            ch.util.classList(this._next).remove('ch-hide');
            this._next.setAttribute('aria-hidden', 'false');

        // Hide next arrow when it's out of limit
        } else {
            ch.util.classList(this._next).add('ch-hide');
            this._next.setAttribute('aria-hidden', 'true');
        }

        return this;
    };

    /**
     * Refresh the structure of Calendar's table with a new date.
     * @function
     * @private
     */
    Calendar.prototype._updateTemplate = function (date) {
        var month;

        // Update "currentDate" object
        this._dates.current = (typeof date === 'string') ? createDateObject(date) : date;

        // Delete old table
        month = this.container.querySelector('table');
        this.container.removeChild(month);

        // Append new table to content
        this.container.insertAdjacentHTML('beforeend', this._createTemplate(this._dates.current));

        // Refresh arrows
        this._updateControls();

        return this;
    };

    /**
     * Creates a complete month in a table.
     * @function
     * @private
     */
    Calendar.prototype._createTemplate = function (date) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            cell,
            positive,
            day,
            isSelected,
            thead = (function () {

                // Create thead structure
                var t = ['<thead><tr role="row">'],
                    dayIndex;

                // Add week names
                for (dayIndex = 0; dayIndex < 7; dayIndex += 1) {
                    t.push('<th role="columnheader">' + that._defaults.weekdays[dayIndex] + '</th>');
                }

                // Close thead structure
                t.push('</tr></thead>');

                // Join structure and return
                return t.join('');

            }()),

            table = [
                '<table class="ch-calendar-month" role="grid" id="ch-calendar-grid-' + that.uid + '">',
                '<caption>' + that._defaults.monthsNames[date.month - 1] + ' - ' + date.year + '</caption>',
                thead
            ],

            // Total amount of days into month
            cells = (function () {

                // Amount of days of current month
                var currentMonth = new Date(date.year, date.month, 0).getDate(),

                // Amount of days of previous month
                    prevMonth = new Date([date.year, date.month, '01'].join('/')).getDay(),

                // Merge amount of previous and current month
                    subtotal = prevMonth + currentMonth,

                // Amount of days into last week of month
                    latest = subtotal % 7,

                // Amount of days of next month
                    nextMonth = (latest > 0) ? 7 - latest : 0;

                return {
                    'previous': prevMonth,
                    'subtotal': subtotal,
                    'total': subtotal + nextMonth
                };

            }());

        table.push('<tbody><tr class="ch-calendar-week" role="row">');

        // Iteration of weekdays
        for (cell = 0; cell < cells.total; cell += 1) {

            // Push an empty cell on previous and next month
            if (cell < cells.previous || cell > cells.subtotal - 1) {
                table.push('<td role="gridcell" class="ch-calendar-other">X</td>');
            } else {

                // Positive number of iteration
                positive = cell + 1;

                // Day number
                day = positive - cells.previous;

                // Define if it's the day selected
                isSelected = this._isSelected(date.year, date.month, day);

                // Create cell
                table.push(
                    // Open cell structure including WAI-ARIA and classnames space opening
                    '<td role="gridcell"' + (isSelected ? ' aria-selected="true"' : '') + ' class="ch-calendar-day',

                    // Add Today classname if it's necesary
                    (date.year === that._dates.today.year && date.month === that._dates.today.month && day === that._dates.today.day) ? ' ch-calendar-today' : null,

                    // Add Selected classname if it's necesary
                    (isSelected ? ' ch-calendar-selected ' : null),

                    // From/to range. Disabling cells
                    (
                        // Disable cell if it's out of FROM range
                        (that._dates.range.from && day < that._dates.range.from.day && date.month === that._dates.range.from.month && date.year === that._dates.range.from.year) ||

                        // Disable cell if it's out of TO range
                        (that._dates.range.to && day > that._dates.range.to.day && date.month === that._dates.range.to.month && date.year === that._dates.range.to.year)

                    ) ? ' ch-calendar-disabled' : null,

                    // Close classnames attribute and print content closing cell structure
                    '">' + day + '</td>'
                );

                // Cut week if there are seven days
                if (positive % 7 === 0) {
                    table.push('</tr><tr class="ch-calendar-week" role="row">');
                }

            }

        }

        table.push('</tr></tbody></table>');

        // Return table object
        return table.join('');

    };

    /**
     * Checks if a given date is into 'from' and 'to' dates.
     * @function
     * @private
     */
    Calendar.prototype._isInRange = function (date) {
        var inRangeFrom = true,
            inRangeTo = true;

        if (this._dates.range.from) {
            inRangeFrom = (this._dates.range.from.native <= date.native);
        }

        if (this._dates.range.to) {
            inRangeTo = (this._dates.range.to.native >= date.native);
        }

        return inRangeFrom && inRangeTo;
    };

    /**
     * Indicates if an specific date is selected or not (including date ranges and simple dates).
     * @function
     * @private
     */
    Calendar.prototype._isSelected = function (year, month, day) {
        var yepnope;

        if (!this._dates.selected) { return; }

        yepnope = false;

        // Simple selection
        if (!ch.util.isArray(this._dates.selected)) {
            if (year === this._dates.selected.year && month === this._dates.selected.month && day === this._dates.selected.day) {
                yepnope = true;
                return yepnope;
            }

        // Multiple selection (ranges)
        } else {
            this._dates.selected.forEach(function (e, i) {
                // Simple date
                if (!ch.util.isArray(e)) {
                    if (year === e.year && month === e.month && day === e.day) {
                        yepnope = true;
                        return yepnope;
                    }
                // Range
                } else {
                    if (
                        (year >= e[0].year && month >= e[0].month && day >= e[0].day) &&
                            (year <= e[1].year && month <= e[1].month && day <= e[1].day)
                    ) {
                        yepnope = true;
                        return yepnope;
                    }
                }
            });
        }

        return yepnope;
    };

    /**
     * Selects a specific date or returns the selected date.
     * @memberof! ch.Calendar.prototype
     * @function
     * @param {String} [date] A given date to select. The format of the given date should be "YYYY/MM/DD".
     * @returns {calendar}
     * @example
     * // Returns the selected date.
     * calendar.select();
     * @example
     * // Select a specific date.
     * calendar.select('2014/05/28');
     */
    Calendar.prototype.select = function (date) {
        // Getter
        if (!date) {
            if (this._dates.selected === undefined) {
                return;
            }
            return FORMAT_dates[this._options.format](this._dates.selected);
        }

        // Setter
        var newDate = createDateObject(date);


        if (!this._isInRange(newDate)) {
            return this;
        }

        // Update selected date
        this._dates.selected = (date === 'today') ? this._dates.today : newDate;

        // Create a new table of selected month
        this._updateTemplate(this._dates.selected);

        /**
         * Event emitted when a date is selected.
         * @event ch.Calendar#select
         * @example
         * // Subscribe to "select" event.
         * calendar.on('select', function () {
         *     // Some code here!
         * });
         */
        this.emit('select');

        return this;
    };

    /**
     * Returns date of today
     * @memberof! ch.Calendar.prototype
     * @function
     * @returns {String} The date of today
     * @example
     * // Get the date of today.
     * var today = calendar.getToday();
     */
    Calendar.prototype.getToday = function () {
        return FORMAT_dates[this._options.format](this._dates.today);
    };

    /**
     * Moves to the next month.
     * @memberof! ch.Calendar.prototype
     * @function
     * @returns {calendar}
     * @example
     * // Moves to the next month.
     * calendar.nextMonth();
     */
    Calendar.prototype.nextMonth = function () {
        if (!this._enabled || !this._hasNextMonth()) {
            return this;
        }

        // Next year
        if (this._dates.current.month === 12) {
            this._dates.current.month = 0;
            this._dates.current.year += 1;
        }

        // Create a new table of selected month
        this._updateTemplate([this._dates.current.year, this._dates.current.month + 1, '01'].join('/'));

        /**
         * Event emitted when a next month is shown.
         * @event ch.Calendar#nextmonth
         * @example
         * // Subscribe to "nextmonth" event.
         * calendar.on('nextmonth', function () {
         *     // Some code here!
         * });
         */
        this.emit('nextmonth');

        return this;
    };

    /**
     * Move to the previous month.
     * @memberof! ch.Calendar.prototype
     * @function
     * @returns {calendar}
     * @example
     * // Moves to the prev month.
     * calendar.prevMonth();
     */
    Calendar.prototype.prevMonth = function () {

        if (!this._enabled || !this._hasPrevMonth()) {
            return this;
        }

        // Previous year
        if (this._dates.current.month === 1) {
            this._dates.current.month = 13;
            this._dates.current.year -= 1;
        }

        // Create a new table to the prev month
        this._updateTemplate([this._dates.current.year, this._dates.current.month - 1, '01'].join('/'));

        /**
         * Event emitted when a previous month is shown.
         * @event ch.Calendar#prevmonth
         * @example
         * // Subscribe to "prevmonth" event.
         * calendar.on('prevmonth', function () {
         *     // Some code here!
         * });
         */
        this.emit('prevmonth');

        return this;
    };

    /**
     * Move to the next year.
     * @memberof! ch.Calendar.prototype
     * @function
     * @returns {calendar}
     * @example
     * // Moves to the next year.
     * calendar.nextYear();
     */
    Calendar.prototype.nextYear = function () {

        if (!this._enabled || !this._hasNextMonth()) {
            return this;
        }

        // Create a new table of selected month
        this._updateTemplate([this._dates.current.year + 1, this._dates.current.month, '01'].join('/'));

        /**
         * Event emitted when a next year is shown.
         * @event ch.Calendar#nextyear
         * @example
         * // Subscribe to "nextyear" event.
         * calendar.on('nextyear', function () {
         *     // Some code here!
         * });
         */
        this.emit('nextyear');

        return this;
    };

    /**
     * Move to the previous year.
     * @memberof! ch.Calendar.prototype
     * @function
     * @returns {calendar}
     * @example
     * // Moves to the prev year.
     * calendar.prevYear();
     */
    Calendar.prototype.prevYear = function () {

        if (!this._enabled || !this._hasPrevMonth()) {
            return this;
        }

        // Create a new table to the prev year
        this._updateTemplate([this._dates.current.year - 1, this._dates.current.month, '01'].join('/'));

        /**
         * Event emitted when a previous year is shown.
         * @event ch.Calendar#prevyear
         * @example
         * // Subscribe to "prevyear" event.
         * calendar.on('prevyear', function () {
         *     // Some code here!
         * });
         */
        this.emit('prevyear');

        return this;
    };

    /**
     * Set a minimum selectable date.
     * @memberof! ch.Calendar.prototype
     * @function
     * @param {String} date A given date to set as minimum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @returns {calendar}
     * @example
     * // Set a minimum selectable date.
     * calendar.setFrom('2010/05/28');
     */
    Calendar.prototype.setFrom = function (date) {
        // this from is a reference to the global form
        this._dates.range.from = (date === 'auto') ? undefined : createDateObject(date);
        this._updateTemplate(this._dates.current);

        return this;
    };

    /**
     * Set a maximum selectable date.
     * @memberof! ch.Calendar.prototype
     * @function
     * @param {String} date A given date to set as maximum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @returns {calendar}
     * @example
     * // Set a maximum selectable date.
     * calendar.setTo('2014/05/28');
     */
    Calendar.prototype.setTo = function (date) {
        // this to is a reference to the global to
        this._dates.range.to = (date === 'auto') ? undefined : createDateObject(date);
        this._updateTemplate(this._dates.current);

        return this;
    };

    /**
     * Destroys a Calendar instance.
     * @memberof! ch.Calendar.prototype
     * @function
     * @example
     * // Destroy a calendar
     * calendar.destroy();
     * // Empty the calendar reference
     * calendar = undefined;
     */
    Calendar.prototype.destroy = function () {

        this._el.parentNode.replaceChild(this._snippet, this._el);

        ch.Event.dispatchCustomEvent(window.document, ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Calendar, normalizeOptions);

}(this, this.ch));
(function (window, ch) {
    'use strict';

    /**
     * Dropdown shows a list of options for navigation.
     * @memberof ch
     * @constructor
     * @augments ch.Layer
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Dropdown.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization.
     * @param {String} [options.fx] Enable or disable UI effects. You must use: "slideDown", "fadeIn" or "none". Default: "none".
     * @param {String} [options.width] Set a width for the container. Default: "auto".
     * @param {String} [options.height] Set a height for the container. Default: "auto".
     * @param {String} [options.shownby] Determines how to interact with the trigger to show the container. You must use: "pointertap", "pointerenter" or "none". Default: "pointertap".
     * @param {String} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointers".
     * @param {HTMLElement} [options.reference] It's a reference to position and size of element that will be considered to carry out the position. Default: the trigger element.
     * @param {String} [options.side] The side option where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. Its value can be: "left", "right", "top", "bottom" or "center". Default: "left".
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horizontally. Default: 0.
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically. Default: -1.
     * @param {String} [options.position] The position option specifies the type of positioning used. Its value must be "absolute" or "fixed". Default: "absolute".
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading. Default: '&lt;div class="ch-loading ch-loading-centered"&gt;&lt;/div&gt;'.
     * @param {Boolean} [options.skin] Sets a CSS class name to the trigger and container to get a variation of Dropdown. Default: false.
     * @param {Boolean} [options.shortcuts] Configures navigation shortcuts. Default: true.
     * @param {(String | HTMLElement)} [options.content] The content to be shown into the Dropdown container.
     * @returns {dropdown} Returns a new instance of Dropdown.
     * @example
     * // Create a new Dropdown.
     * var dropdown = new ch.Dropdown([el], [options]);
     * @example
     * // Create a new skinned Dropdown.
     * var dropdown = new ch.Dropdown({
     *     'skin': true
     * });
     */
    function Dropdown(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Dropdown is created.
             * @memberof! ch.Dropdown.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Dropdown#ready
         * @example
         * // Subscribe to "ready" event.
         * dropdown.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    var document = window.document,
        // Inheritance
        parent = ch.util.inherits(Dropdown, ch.Layer);

    /**
     * The name of the component.
     * @memberof! ch.Dropdown.prototype
     * @type {String}
     */
    Dropdown.prototype.name = 'dropdown';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Dropdown.prototype
     * @function
     */
    Dropdown.prototype.constructor = Dropdown;

    /**
     * Configuration by default.
     * @memberof! ch.Dropdown.prototype
     * @type {Object}
     * @private
     */
    Dropdown.prototype._defaults = ch.util.extend(ch.util.clone(parent._defaults), {
        '_className': 'ch-dropdown ch-box-lite',
        '_ariaRole': 'combobox',
        'fx': 'none',
        'shownby': 'pointertap',
        'hiddenby': 'pointers',
        'offsetY': -1,
        'skin': false,
        'shortcuts': true
    });

    /**
     * Initialize a new instance of Dropdown and merge custom options with defaults options.
     * @memberof! ch.Dropdown.prototype
     * @function
     * @private
     * @returns {dropdown}
     */
    Dropdown.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            // The second element of the HTML snippet (the dropdown content)
            content = ch.util.nextElementSibling(this.trigger);

        /**
         * The dropdown trigger. It's the element that will show and hide the container.
         * @type {HTMLElement}
         */
        this.trigger.setAttribute('aria-activedescendant', 'ch-dropdown' + this.uid + '-selected')
        ch.util.classList(this.trigger).add('ch-dropdown-trigger');
        ch.util.avoidTextSelection(this.trigger);



        // Skinned dropdown
        if (this._options.skin) {
            ch.util.classList(this.trigger).add('ch-dropdown-trigger-skin');
            ch.util.classList(this.container).add('ch-dropdown-skin');
        // Default Skin
        } else {
            ch.util.classList(this.trigger).add('ch-btn-skin');
            ch.util.classList(this.trigger).add('ch-btn-small');
        }

        /**
         * A list of links with the navigation options of the component.
         * @type {NodeList}
         * @private
         */
        this._navigation = (function () {
            var items = content.querySelectorAll('a');
            Array.prototype.forEach.call(items, function (item, index) {
                item.setAttribute('role', 'option');
                ch.Event.addListener(item, ch.onpointerenter, function () {
                    that._navigation[that._selected = index].focus();
                });
            });
            return items;
        }());


        if (this._options.shortcuts && this._navigationShortcuts !== undefined) {
            this._navigationShortcuts();
        }

        this._options.content = content;

        /**
         * The original and entire element and its state, before initialization.
         * @private
         * @type {HTMLElement}
         */
        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._options.content.cloneNode(true);

        return this;
    };

    /**
     * Shows the dropdown container.
     * @memberof! ch.Dropdown.prototype
     * @function
     * @param {(String | HTMLElement)} [content] The content that will be used by dropdown.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @returns {dropdown}
     * @example
     * // Shows a basic dropdown.
     * dropdown.show();
     * @example
     * // Shows a dropdown with new content
     * dropdown.show('Some new content here!');
     * @example
     * // Shows a dropdown with a new content that will be loaded by ajax with some custom options
     * dropdown.show('http://domain.com/ajax/url', {
     *     'cache': false,
     *     'params': 'x-request=true'
     * });
     */
    Dropdown.prototype.show = function (content, options) {
        // Don't execute when it's disabled
        if (!this._enabled) {
            return this;
        }

        // Execute the original show()
        parent.show.call(this, content, options);

        // Z-index of trigger over content (secondary / skin dropdown)
        if (this._options.skin) {
            this.trigger.style.zIndex = ch.util.zIndex += 1;
        }

        this._selected = -1;

        return this;
    };

    /**
     * Destroys a Dropdown instance.
     * @memberof! ch.Dropdown.prototype
     * @function
     * @example
     * // Destroy a dropdown
     * dropdown.destroy();
     * // Empty the dropdown reference
     * dropdown = undefined;
     */
    Dropdown.prototype.destroy = function () {



        ch.util.classList(this.trigger).remove('ch-dropdown-trigger');
        ch.util.classList(this.trigger).remove('ch-dropdown-trigger-skin');
        ch.util.classList(this.trigger).remove('ch-user-no-select');
        ch.util.classList(this.trigger).remove('ch-btn-skin');
        ch.util.classList(this.trigger).remove('ch-btn-small');
        this.trigger.removeAttribute('aria-controls');

        this.trigger.insertAdjacentHTML('afterend', this._snippet);

        // this.$trigger.off('.dropdown');
        // this.$container.off('.dropdown');

        ch.Event.dispatchCustomEvent(window.document, ch.onlayoutchange);

        // $.each(this._$navigation, function (i, e) {
        //     $(e).off(ch.onpointerenter);
        // });



        parent.destroy.call(this);

        return;
    };

    ch.factory(Dropdown);

}(this, this.ch));

(function (ch) {
    'use strict';

    /**
     * Highlights the current option when navigates by keyboard.
     * @function
     * @private
     */
    ch.Dropdown.prototype._highlightOption = function (key) {

        var optionsLength = this._navigation.length;

        if (!this._shown) { return; }

        // Sets limits behavior
        if (this._selected === (key === ch.onkeydownarrow ? optionsLength - 1 : 0)) { return; }

        // Unselects current option
        if (this._selected !== -1) {
            this._navigation[this._selected].blur();
            this._navigation[this._selected].removeAttribute('id');
        }

        if (key === ch.onkeydownarrow) { this._selected += 1; } else { this._selected -= 1; }

        // Selects new current option
        this._navigation[this._selected].focus();
        this._navigation[this._selected].id = 'ch-dropdown' + this.uid + '-selected';
    };

    /**
     * Add handlers to manage the keyboard on Dropdown navigation.
     * @function
     * @private
     */
    ch.Dropdown.prototype._navigationShortcuts = function () {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        ch.shortcuts.add(ch.onkeyuparrow, this.uid, function (event) {
            // Prevent default behavior
            ch.util.prevent(event);

            that._highlightOption(event.shortcut);
        });

        ch.shortcuts.add(ch.onkeydownarrow, this.uid, function (event) {
            // Prevent default behavior
            ch.util.prevent(event);

            that._highlightOption(event.shortcut);
        });

        this.once('destroy', function () {
            ch.shortcuts.remove(ch.onkeyuparrow, that.uid);
            ch.shortcuts.remove(ch.onkeydownarrow, that.uid);
        });

        return this;
    };

}(this.ch));
(function (window, ch) {
    'use strict';

    /**
     * Tabs lets you create tabs for static and dynamic content.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Expandable
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Tabs.
     * @param {Object} [options] Options to customize an instance.
     * @returns {tabs} Returns a new instance of Tabs.
     * @example
     * // Create a new Tabs.
     * var tabs = new ch.Tabs(el);
     */
    function Tabs(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Tabs is created.
             * @memberof! ch.Tabs.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Emits the event 'ready' when the component is ready to use.
         * @event ch.Tabs#ready
         * @example
         * // Subscribe to "ready" event.
         * tabs.on('ready',function () {
         *     this.show();
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Tabs, ch.Component),

        location = window.location,

        // Creates methods enable and disable into the prototype.
        methods = ['enable', 'disable'],
        len = methods.length,

        // Regular expresion to get hash
        hashRegExp = new RegExp('\\#!?\\/?(.[^\\?|\\&|\\s]+)');


    function createMethods(method) {
        Tabs.prototype[method] = function (tab) {
            var i;

            // Enables or disables an specifc tab panel
            if (tab !== undefined) {
                this.tabpanels[tab - 1][method]();

            // Enables or disables Tabs
            } else {

                i = this.tabpanels.length;

                while (i) {
                    this.tabpanels[i -= 1][method]();
                }

                // Executes parent method
                parent[method].call(this);

                // Updates "aria-disabled" attribute
                this._el.setAttribute('aria-disabled', !this._enabled);
            }

            return this;
        };
    }

    /**
     * The name of the component.
     * @memberof! ch.Tabs.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var tabs = $(selector).data('tabs');
     */
    Tabs.prototype.name = 'tabs';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Tabs.prototype
     * @function
     */
    Tabs.prototype.constructor = Tabs;

    /**
     * Initialize a new instance of Tabs and merge custom options with defaults options.
     * @memberof! ch.Tabs.prototype
     * @function
     * @private
     * @returns {tabs}
     */
    Tabs.prototype._init = function (el, options) {
        parent._init.call(this, el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
        * The actual location hash, is used to know if there's a specific tab panel shwown.
        * @type {String}
        * @private
        */
        this._currentHash = (function () {
            var hash = location.hash.match(hashRegExp);
            return (hash !== null) ? hash[1] : '';
        }());

        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._el.cloneNode(true);

        /**
         * The tabs container.
         * @type {HTMLElement}
         */
        this.container = this._el;
        ch.util.classList(this.container).add('ch-tabs');

        /**
         * The tabs triggers.
         * @type {HTMLElement}
         */
        this.triggers = this.container.children[0];
        this.triggers.setAttribute('role', 'tablist');
        ch.util.classList(this.triggers).add('ch-tabs-triggers')

        /**
         * A collection of tab panel.
         * @type {Array}
         */
        this.tabpanels = [];

        /**
         * The container of tab panels.
         * @type {HTMLElement}
         */
        this.panel = this.container.children[1];
        this.panel.setAttribute('role', 'presentation');
        ch.util.classList(this.panel).add('ch-tabs-panel')
        ch.util.classList(this.panel).add('ch-box-lite')


        /**
         * The tab panel's containers.
         * @type {HTMLElement}
         * @private
         */
        this._tabsPanels = this.panel.children;

        // Creates tab
        Array.prototype.forEach.call(this.triggers.getElementsByTagName('a'), function (el, index) {
            that._createTab(index, el);
        });

        // Set the default shown tab.
        this._shown = 1;

        // Checks if the url has a hash to shown the associated tab.
        this._hasHash();

        return this;
    };

    /**
     * Create tab panels.
     * @function
     * @private
     */
    Tabs.prototype._createTab = function (i, e) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            tab,

            panel = this._tabsPanels[i],

            // Create Tab panel's options
            options = {
                '_classNameIcon': null,
                '_classNameTrigger': 'ch-tab',
                '_classNameContainer': 'ch-tabpanel',
                'toggle': false
            };

        // Tab panel async configuration
        if (panel === undefined) {

            panel = document.createElement('div');
            panel.setAttribute('id', e.href.split('#')[1]);

            this.panel.appendChild(panel);

            options.content = e.href;
            options.waiting = this._options.waiting;
            options.cache = this._options.cache;
            options.method = this._options.method;
        }

        // Tab panel container configuration
        options.container = panel;

        // Creates new Tab panel
        tab = new ch.Expandable(e, options);

        // Creates tab's hash
        tab._hash = e.href.split('#')[1];

        // Add ARIA roles
        tab.trigger.setAttribute('role', 'tab');
        tab.container.setAttribute('role', 'tabpanel');

        // Binds show event
        tab.on('show', function () {
            that._updateShown(i + 1);
        });

        // Adds tab panel to the collection
        this.tabpanels.push(tab);

        return this;
    };

    /**
     * Checks if the url has a hash to shown the associated tab panel.
     * @function
     * @private
     */
    Tabs.prototype._hasHash = function () {

        /**
         * Event emitted when a tab hide a tab panel container.
         * @event ch.Tabs#hide
         * @example
         * // Subscribe to "hide" event.
         * tabs.on('hide', function () {
         *     // Some code here!
         * });
         */
        this.emit('hide', this._shown);

        var i = 0,
            // Shows the first tab panel if not hash or it's hash and it isn't from the current tab panel,
            l = this.tabpanels.length;

        // If hash open that tab panel
        for (i; i < l; i += 1) {
            if (this.tabpanels[i]._hash === this._currentHash) {
                this._shown = i + 1;
                break;
            }
        }

        this.tabpanels[this._shown - 1].show();

        /**
         * Event emitted when the tabs shows a tab panel container.
         * @event ch.Tabs#show
         * @ignore
         */
        this.emit('show', this._shown);

        return this;
    };

    /**
     * Shows a specific tab panel.
     * @memberof! ch.Tabs.prototype
     * @function
     * @param {Number} tab - A given number of tab panel.
     * @returns {tabs}
     * @example
     * // Shows the second tab panel.
     * tabs.show(2);
     */
    Tabs.prototype.show = function (tab) {

        // Shows the current tab
        this.tabpanels[tab - 1].show();

        return this;
    };

    /**
     * Updates the shown tab panel, hides the previous tab panel, changes window location and emits "show" event.
     * @memberof! ch.Tabs.prototype
     * @function
     * @private
     * @param {Number} tab - A given number of tab panel.
     */
    Tabs.prototype._updateShown = function (tab) {

        // If tab doesn't exist or if it's shown do nothing
        if (this._shown === tab) {
            return this;
        }

        /**
         * Event emitted when a tab hide a tab panel container.
         * @event ch.Tabs#hide
         * @example
         * // Subscribe to "hide" event.
         * tabs.on('hide', function () {
         *     // Some code here!
         * });
         */
        this.emit('hide', this._shown);

        // Hides the shown tab
        this.tabpanels[this._shown - 1].hide();

        /**
         * Get wich tab panel is shown.
         * @name ch.Tabs#_shown
         * @type {Number}
         * @private
         */
        this._shown = tab;

        // Update window location hash
        location.hash = this._currentHash = (this._currentHash === '')
            // If the current hash is empty, create it.
            ? '#!/' + this.tabpanels[this._shown - 1]._hash
            // update only the previous hash
            : location.hash.replace(location.hash.match(hashRegExp)[1], this.tabpanels[this._shown - 1]._hash);

        /**
         * Event emitted when the tabs shows a tab panel container.
         * @event ch.Tabs#show
         * @example
         * // Subscribe to "show" event.
         * tabs.on('show', function (shownTab) {
         *     // Some code here!
         * });
         */
        this.emit('show', this._shown);

        return this;
    };

    /**
     * Returns the number of the shown tab panel.
     * @memberof! ch.Tabs.prototype
     * @function
     * @returns {Boolean}
     * @example
     * if (tabs.getShown() === 1) {
     *     fn();
     * }
     */
    Tabs.prototype.getShown = function () {
        return this._shown;
    };

    /**
     * Allows to manage the tabs content.
     * @param {Number} tab A given tab to change its content.
     * @param {HTMLElement} content The content that will be used by a tabpanel.
     * @param {Object} [options] A custom options to be used with content loaded by ajax.
     * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
     * @param {String} [options.params] Params like query string to be sent to the server.
     * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
     * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
     * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
     * @example
     * // Updates the content of the second tab with some string.
     * tabs.content(2, 'http://ajax.com', {'cache': false});
     */
    Tabs.prototype.content = function (tab, content, options) {
        if (tab === undefined || typeof tab !== 'number') {
            throw new window.Error('Tabs.content(tab, content, options): Expected a number of tab.');
        }

        if (content === undefined) {
            return this.tab[tab - 1].content();
        }

        this.tabpanels[tab - 1].content(content, options);

        return this;
    };

    /**
     * Enables an instance of Tabs or a specific tab panel.
     * @memberof! ch.Tabs.prototype
     * @name enable
     * @function
     * @param {Number} [tab] - A given number of tab panel to enable.
     * @returns {tabs} Returns an instance of Tabs.
     * @example
     * // Enabling an instance of Tabs.
     * tabs.enable();
     * @example
     * // Enabling the second tab panel of a tabs.
     * tabs.enable(2);
     */

    /**
     * Disables an instance of Tabs or a specific tab panel.
     * @memberof! ch.Tabs.prototype
     * @name disable
     * @function
     * @param {Number} [tab] - A given number of tab panel to disable.
     * @returns {tabs} Returns an instance of Tabs.
     * @example
     * // Disabling an instance of Tabs.
     * tabs.disable();
     * @example
     * // Disabling the second tab panel.
     * tabs.disable(2);
     */
    while (len) {
        createMethods(methods[len -= 1]);
    }

    /**
     * Destroys a Tabs instance.
     * @memberof! ch.Tabs.prototype
     * @function
     * @example
     * // Destroying an instance of Tabs.
     * tabs.destroy();
     */
    Tabs.prototype.destroy = function () {

        this._el.parentNode.replaceChild(this._snippet, this._el);

        ch.Event.dispatchCustomEvent(window.document, ch.onlayoutchange);

        parent.destroy.call(this);
    };

    /**
     * Factory
     */
    ch.factory(Tabs);

}(this, this.ch));
(function (window, ch) {
    'use strict';

    /**
     * A large list of elements. Some elements will be shown in a preset area, and others will be hidden waiting for the user interaction to show it.
     * @memberof ch
     * @constructor
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Carousel.
     * @param {Object} [options] Options to customize an instance.
     * @param {Number} [options.async] Defines the number of future asynchronous items to add to the component. Default: 0.
     * @param {Boolean} [options.arrows] Defines if the arrow-buttons must be created or not at initialization. Default: true.
     * @param {Boolean} [options.pagination] Defines if a pagination must be created or not at initialization. Default: false.
     * @param {Boolean} [options.fx] Enable or disable the slide effect. Default: true.
     * @param {Number} [options.limitPerPage] Set the maximum amount of items to show in each page.
     * @returns {carousel} Returns a new instance of Carousel.
     * @example
     * // Create a new carousel.
     * var carousel = new ch.Carousel(el, [options]);
     * @example
     * // Create a new Carousel with disabled effects.
     * var carousel = new ch.Carousel(el, {
     *     'fx': false
     * });
     * @example
     * // Create a new Carousel with items asynchronously loaded.
     * var carousel = new ch.Carousel(el, {
     *     'async': 10
     * }).on('itemsadd', function (collection) {
     *     // Inject content into the added <li> elements
     *     $.each(collection, function (i, e) {
     *         e.innerHTML = 'Content into one of newly inserted <li> elements.';
     *     });
     * });
     */
    function Carousel(el, options) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Carousel is created.
             * @memberof! ch.Carousel.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Carousel#ready
         * @example
         * // Subscribe to "ready" event.
         * carousel.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    var pointertap = ch.onpointertap,
        Math = window.Math,
        setTimeout = window.setTimeout,
        // Inheritance
        parent = ch.util.inherits(Carousel, ch.Component);

    /**
     * The name of the component.
     * @memberof! ch.Carousel.prototype
     * @type {String}
     */
    Carousel.prototype.name = 'carousel';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Carousel.prototype
     * @function
     */
    Carousel.prototype.constructor = Carousel;

    /**
     * Configuration by default.
     * @memberof! ch.Carousel.prototype
     * @type {Object}
     * @private
     */
    Carousel.prototype._defaults = {
        'async': 0,
        'arrows': true,
        'pagination': false,
        'fx': true
    };

    /**
     * Initialize a new instance of Carousel and merge custom options with defaults options.
     * @memberof! ch.Carousel.prototype
     * @function
     * @private
     * @returns {carousel}
     */
    Carousel.prototype._init = function (el, options) {
        // Call to its parents init method
        parent._init.call(this, el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * The original and entire element and its state, before initialization.
         * @type {HTMLDivElement}
         * @private
         */
        // cloneNode(true) > parameters is required. Opera & IE throws and internal error. Opera mobile breaks.
        this._snippet = this._el.cloneNode(true);

        /**
         * Element that moves (slides) across the component (inside the mask).
         * @private
         * @type {HTMLElement}
         */
        this._list = this._el.children[0];

        ch.util.classList(this._el).add('ch-carousel');
        ch.util.classList(this._list).add('ch-carousel-list');

        /**
         * Collection of each child of the slider list.
         * @private
         * @type {HTMLCollection}
         */
        this._items = (function () {
                var item,
                    // uses querySelectorAll because it need a static collection
                    collection = that._list.querySelectorAll('li'),
                    collectionLength = collection.length;

                Array.prototype.forEach.call(collection, function(item){
                    ch.util.classList(item).add('ch-carousel-item');
                });

                return collection;
            }());

        /**
         * Element that wraps the list and denies its overflow.
         * @private
         * @type {HTMLDivElement}
         */
        this._mask = document.createElement('div');
        this._mask.setAttribute('role', 'tabpanel');
        this._mask.setAttribute('class','ch-carousel-mask');
        this._mask.appendChild(this._list);

        this._el.appendChild(this._mask);

        /**
         * Size of the mask (width). Updated in each refresh.
         * @private
         * @type {Number}
         */
        this._maskWidth = ch.util.getOuterDimensions(this._mask).width;

        /**
         * The width of each item, including paddings, margins and borders. Ideal for make calculations.
         * @private
         * @type {Number}
         */
        this._itemWidth = ch.util.getOuterDimensions(this._items[0]).width;

        /**
         * The width of each item, without paddings, margins or borders. Ideal for manipulate CSS width property.
         * @private
         * @type {Number}
         */
        this._itemOuterWidth = parseInt(ch.util.getStyles(this._items[0], 'width'));

        /**
         * The size added to each item to make it elastic/responsive.
         * @private
         * @type {Number}
         */
        this._itemExtraWidth = 0;

        /**
         * The height of each item, including paddings, margins and borders. Ideal for make calculations.
         * @private
         * @type {Number}
         */
        this._itemHeight = ch.util.getOuterDimensions(this._items[0]).height;

        /**
         * The margin of all items. Updated in each refresh only if it's necessary.
         * @private
         * @type {Number}
         */
        this._itemMargin = 0;

        /**
         * Flag to control when arrows were created.
         * @private
         * @type {Boolean}
         */
        this._arrowsCreated = false;

        /**
         * Flag to control when pagination was created.
         * @private
         * @type {Boolean}
         */
        this._paginationCreated = false;

        /**
         * Amount of items in each page. Updated in each refresh.
         * @private
         * @type {Number}
         */
        this._limitPerPage = 0;

        /**
         * Page currently showed.
         * @private
         * @type {Number}
         */
        this._currentPage = 1;

        /**
         * Total amount of pages. Data updated in each refresh.
         * @private
         * @type {Number}
         */
        this._pages = 0;

        /**
         * Distance needed to move ONLY ONE PAGE. Data updated in each refresh.
         * @private
         * @type {Number}
         */
        this._pageWidth = 0;

        /**
         * List of items that should be loaded asynchronously on page movement.
         * @private
         * @type {Number}
         */
        this._async = this._options.async;

        /**
         * UI element of arrow that moves the Carousel to the previous page.
         * @private
         * @type {HTMLDivElement}
         */
        this._prevArrow = document.createElement('div');
        this._prevArrow.setAttribute('role', 'button');
        this._prevArrow.setAttribute('aria-hidden', 'true');
        this._prevArrow.setAttribute('class', 'ch-carousel-prev ch-carousel-disabled');
        ch.Event.addListener(this._prevArrow, pointertap, function () { that.prev(); }, false);

        /**
         * UI element of arrow that moves the Carousel to the next page.
         * @private
         * @type {HTMLDivElement}
         */
        this._nextArrow = document.createElement('div');
        this._nextArrow.setAttribute('role', 'button');
        this._nextArrow.setAttribute('aria-hidden', 'true');
        this._nextArrow.setAttribute('class', 'ch-carousel-next');
        ch.Event.addListener(this._nextArrow, pointertap, function () { that.next(); }, false);

        /**
         * UI element that contains all the thumbnails for pagination.
         * @private
         * @type {HTMLDivElement}
         */
        this._pagination = document.createElement('div');
        this._pagination.setAttribute('role', 'navigation');
        this._pagination.setAttribute('class', 'ch-carousel-pages');

        ch.Event.addListener(this._pagination, pointertap, function (event) {
            // Get the page from the element
            var page = event.target.getAttribute('data-page');
            // Allow interactions from a valid page of pagination
            if (page !== null) { that.select(window.parseInt(page, 10)); }
        }, false);

        // Refresh calculation when the viewport resizes
        ch.viewport.on('resize', function () { that.refresh(); });

        // If efects aren't needed, avoid transition on list
        if (!this._options.fx) { ch.util.classList(this._list).add('ch-carousel-nofx'); }

        // Position absolutelly the list when CSS transitions aren't supported
        if (!ch.support.transition) {
            this._list.style.cssText += 'position:absolute;left:0;';
        }

        // If there is a parameter specifying a pagination, add it
        if (this._options.pagination) { this._addPagination(); }

        // Allow to render the arrows
        if (this._options.arrows !== undefined && this._options.arrows !== false) { this._addArrows(); }

        // Set WAI-ARIA properties to each item depending on the page in which these are
        this._updateARIA();

        // Calculate items per page and calculate pages, only when the amount of items was changed
        this._updateLimitPerPage();

        // Update the margin between items and its size
        this._updateDistribution();

        return this;
    };

    /**
     * Set accesibility properties to each item depending on the page in which these are.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._updateARIA = function () {
        /**
         * Reference to an internal component instance, saves all the information and configuration properties.
         * @type {Object}
         * @private
         */
        var that = this,
            // Amount of items when ARIA is updated
            total = this._items.length + this._async,
            // Page where each item is in
            page;

        // Update WAI-ARIA properties on all items
        Array.prototype.forEach.call(this._items, function (item, i) {
            // Update page where this item is in
            page = Math.floor(i / that._limitPerPage) + 1;
            // Update ARIA attributes
            item.setAttribute('aria-hidden', (page !== that._currentPage));
            item.setAttribute('aria-setsize', total);
            item.setAttribute('aria-posinset', (i + 1));
            item.setAttribute('aria-label', 'page' + page);
        });

    };

    /**
     * Adds items when page/pages needs to load it asynchronously.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._loadAsyncItems = function () {

        // Load only when there are items to load
        if (this._async === 0) { return; }

        // Amount of items from the beginning to current page
        var total = this._currentPage * this._limitPerPage,
            // How many items needs to add to items rendered to complete to this page
            amount = total - this._items.length,
            // The new width calculated from current width plus extraWidth
            width = (this._itemWidth + this._itemExtraWidth),
            // Get the height using new width and relation between width and height of item (ratio)
            height = ((width * this._itemHeight) / this._itemWidth).toFixed(3),
            // Generic <LI> HTML Element to be added to the Carousel
            item = [
                '<li',
                ' class="ch-carousel-item"',
                ' style="width:' + width + 'px;height:' + height + 'px;margin-right:' + this._itemMargin + 'px"',
                '></li>'
            ].join(''),
            // It stores <LI> that will be added to the DOM collection
            items = '',
            // It stores the items that must be added, it helps to slice the items in the list
            counter = 0;

        // Load only when there are items to add
        if (amount < 1) { return; }

        // If next page needs less items than it support, then add that amount
        amount = (this._async < amount) ? this._async : amount;

        // Add the necessary amount of items
        while (amount) {
            items += item;
            amount -= 1;
            counter += 1;
        }

        // Add sample items to the list
        this._list.insertAdjacentHTML('beforeend', items);

        // Update items collection
        // uses querySelectorAll because it need a static collection
        this._items = this._list.querySelectorAll('li');

        // Set WAI-ARIA properties to each item
        this._updateARIA();

        // Update amount of items to add asynchronously
        this._async -= amount;

        /**
         * Event emitted when the component creates new asynchronous empty items.
         * @event ch.Carousel#itemsadd
         * @example
         * // Create a new Carousel with items asynchronously loaded.
         * var carousel = new ch.Carousel({
         *     'async': 10
         * }).on('itemsadd', function (collection) {
         *     // Inject content into the added <li> elements
         *     $.each(collection, function (i, e) {
         *         e.innerHTML = 'Content into one of newly inserted <li> elements.';
         *     });
         * });
         */
        this.emit('itemsadd', Array.prototype.slice.call(this._items, -counter));
    };

    /**
     * Creates the pagination of the component.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._addPagination = function () {
        // Remove the current pagination if it's necessary to create again
        if (this._paginationCreated) {
            this._removePagination();
        }

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            thumbs = [],
            page = that._pages,
            isSelected;

        // Generate a thumbnail for each page on Carousel
        while (page) {
            // Determine if this thumbnail is selected or not
            isSelected = (page === that._currentPage);
            // Add string to collection
            thumbs.unshift(
                '<span',
                ' role="button"',
                ' aria-selected="' + isSelected + '"',
                ' aria-controls="page' + page + '"',
                ' data-page="' + page + '"',
                ' class="' + (isSelected ? 'ch-carousel-selected' : '') + '"',
                '>' + page + '</span>'
            );

            page -= 1;
        }

        // Append thumbnails to pagination and append this to Carousel
        that._pagination.innerHTML = thumbs.join('');
        that._el.appendChild(that._pagination);

        // Avoid selection on the pagination
        ch.util.avoidTextSelection(that._pagination);

        // Check pagination as created
        that._paginationCreated = true;
    };

    /**
     * Deletes the pagination from the component.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._removePagination = function () {
        // Avoid to change something that not exists
        if (!this._paginationCreated) { return; }
        // Delete thumbnails
        this._pagination.innerHTML = '';
        // Check pagination as deleted
        this._paginationCreated = false;
    };

    /**
     * It stops the slide effect while the list moves.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     * @param {Function} callback A function to execute after disable the effects.
     */
    Carousel.prototype._standbyFX = function (callback) {
        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        // Do it if is required
        if (this._options.fx && ch.support.transition) {
            // Delete efects on list to make changes instantly
            ch.util.classList(this._list).add('ch-carousel-nofx');
            // Execute the custom method
            callback.call(this);
            // Restore efects to list
            // Use a setTimeout to be sure to do this AFTER changes
            setTimeout(function () { ch.util.classList(that._list).remove('ch-carousel-nofx'); }, 0);
        // Avoid to add/remove classes if it hasn't effects
        } else {
            callback.call(this);
        }
    };

    /**
     * Calculates the total amount of pages and executes internal methods to load asynchronous items, update WAI-ARIA, update the arrows and update pagination.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._updatePages = function () {
        // Update the amount of total pages
        // The ratio between total amount of items and items in each page
        this._pages = Math.ceil((this._items.length + this._async) / this._limitPerPage);
        // Add items to the list, if it's necessary
        this._loadAsyncItems();
        // Set WAI-ARIA properties to each item
        this._updateARIA();
        // Update arrows (when pages === 1, there is no arrows)
        this._updateArrows();
        // Update pagination
        if (this._options.pagination) {
            this._addPagination();
        }
    };

    /**
     * Calculates the correct items per page and calculate pages, only when the amount of items was changed.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._updateLimitPerPage = function () {

        var max = this._options.limitPerPage,
            // Go to the current first item on the current page to restore if pages amount changes
            firstItemOnPage,
            // The width of each item into the width of the mask
            // Avoid zero items in a page
            limitPerPage = Math.floor(this._maskWidth / this._itemOuterWidth) || 1;

        // Limit amount of items when user set a limitPerPage amount
        if (max !== undefined && limitPerPage > max) { limitPerPage = max; }

        // Set data and calculate pages, only when the amount of items was changed
        if (limitPerPage === this._limitPerPage) { return; }

        // Restore if limitPerPage is NOT the same after calculations (go to the current first item page)
        firstItemOnPage = ((this._currentPage - 1) * this._limitPerPage) + 1;
        // Update amount of items into a single page (from conf or auto calculations)
        this._limitPerPage = limitPerPage;
        // Calculates the total amount of pages and executes internal methods
        this._updatePages();
        // Go to the current first item page
        this.select(Math.ceil(firstItemOnPage / limitPerPage));
    };

    /**
     * Calculates and set the size of the items and its margin to get an adaptive Carousel.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._updateDistribution = function () {

        var moreThanOne = this._limitPerPage > 1,
            // Total space to use as margin into mask
            // It's the difference between mask width and total width of all items
            freeSpace = this._maskWidth - (this._itemOuterWidth * this._limitPerPage),
            // Width to add to each item to get responsivity
            // When there are more than one item, get extra width for each one
            // When there are only one item, extraWidth must be just the freeSpace
            extraWidth = moreThanOne ? Math.ceil(freeSpace / this._limitPerPage / 2) : Math.ceil(freeSpace),
            // Amount of spaces to distribute the free space
            spaces,
            // The new width calculated from current width plus extraWidth
            width,
            // Styles to update the item element width, height & margin-right
            cssItemText;

        // Update ONLY IF margin changed from last refresh
        // If *new* and *old* extra width are 0, continue too
        if (extraWidth === this._itemExtraWidth && extraWidth > 0) { return; }

        // Update global value of width
        this._itemExtraWidth = extraWidth;

        // When there are 6 items on a page, there are 5 spaces between them
        // Except when there are only one page that NO exist spaces
        spaces = moreThanOne ? this._limitPerPage - 1 : 0;
        // The new width calculated from current width plus extraWidth
        width = this._itemWidth + extraWidth;

        // Free space for each space between items
        // Ceil to delete float numbers (not Floor, because next page is seen)
        // There is no margin when there are only one item in a page
        // Update global values
        this._itemMargin = moreThanOne ? Math.ceil(freeSpace / spaces / 2) : 0;

        // Update distance needed to move ONLY ONE page
        // The width of all items on a page, plus the width of all margins of items
        this._pageWidth = (this._itemOuterWidth + extraWidth + this._itemMargin) * this._limitPerPage;

        // Update the list width
        // Do it before item resizing to make space to all items
        // Delete efects on list to change width instantly
        this._standbyFX(function () {
            this._list.style.cssText = this._list.style.cssText + '; ' + 'width:' + (this._pageWidth * this._pages) + 'px;';
        });

        // Get the height using new width and relation between width and height of item (ratio)
        cssItemText = [
                'width:' + width + 'px;',
                'height:' + ((width * this._itemHeight) / this._itemWidth).toFixed(3) + 'px;',
                'margin-right:' + this._itemMargin + 'px;'
            ].join('');

        // Update element styles
        Array.prototype.forEach.call(this._items, function (item, index){
            item.setAttribute('style', cssItemText);
        });

        // Update the mask height with the list height
        this._mask.style.height = ch.util.getOuterDimensions(this._list).height + 'px';

        // Suit the page in place
        this._standbyFX(function () {
            this._translate(-this._pageWidth * (this._currentPage - 1));
        });
    };

    /**
     * Adds arrows to the component.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._addArrows = function () {
        // Avoid selection on the arrows
        ch.util.avoidTextSelection(this._prevArrow, this._nextArrow);
        // Add arrows to DOM
        this._el.insertBefore(this._prevArrow, this._el.children[0])
        this._el.appendChild(this._nextArrow);
        // Check arrows as created
        this._arrowsCreated = true;
    };

    /**
     * Set as disabled the arrows by adding a classname and a WAI-ARIA property.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     * @param {Boolean} prev Defines if the "previous" arrow must be disabled or not.
     * @param {Boolean} next Defines if the "next" arrow must be disabled or not.
     */
    Carousel.prototype._disableArrows = function (prev, next) {
        this._prevArrow.setAttribute('aria-disabled', prev);
        this._prevArrow.setAttribute('aria-hidden', prev);
        ch.util.classList(this._prevArrow)[prev ? 'add' : 'remove']('ch-carousel-disabled');

        this._nextArrow.setAttribute('aria-disabled', next);
        this._nextArrow.setAttribute('aria-hidden', next);
        ch.util.classList(this._nextArrow)[next ? 'add' : 'remove']('ch-carousel-disabled');
    };

    /**
     * Check for arrows behavior on first, last and middle pages, and update class name and WAI-ARIA values.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     */
    Carousel.prototype._updateArrows = function () {
        // Check arrows existency
        if (!this._arrowsCreated) {
            return;
        }
        // Case 1: Disable both arrows if there are ony one page
        if (this._pages === 1) {
            this._disableArrows(true, true);
        // Case 2: "Previous" arrow hidden on first page
        } else if (this._currentPage === 1) {
            this._disableArrows(true, false);
        // Case 3: "Next" arrow hidden on last page
        } else if (this._currentPage === this._pages) {
            this._disableArrows(false, true);
        // Case 4: Enable both arrows on Carousel's middle
        } else {
            this._disableArrows(false, false);
        }
    };

    /**
     * Moves the list corresponding to specified displacement.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     * @param {Number} displacement Distance to move the list.
     */
    Carousel.prototype._translate = (function () {
        // CSS property written as string to use on CSS movement
        var transform = '-' + ch.util.VENDOR_PREFIX + '-transform',
            vendorTransformKey = ch.util.VENDOR_PREFIX ? ch.util.VENDOR_PREFIX + 'Transform' : null;

        // Use CSS transform to move
        if (ch.support.transition) {
            return function (displacement) {
                // Firefox has only "transform", Safari only "webkitTransform",
                // Chrome has support for both. Applied required minimum
                if (vendorTransformKey) {
                    this._list.style[vendorTransformKey] = 'translateX(' + displacement + 'px)';
                }
                this._list.style.transform = 'translateX(' + displacement + 'px)';
            };
        }

        // Use left position to move
        return function (displacement) {
            this._list.style.left = displacement + 'px';
        };
    }());

    /**
     * Updates the selected page on pagination.
     * @memberof! ch.Carousel.prototype
     * @private
     * @function
     * @param {Number} from Page previously selected. It will be unselected.
     * @param {Number} to Page to be selected.
     */
    Carousel.prototype._switchPagination = function (from, to) {
        // Avoid to change something that not exists
        if (!this._paginationCreated) { return; }
        // Get all thumbnails of pagination element
        var children = this._pagination.children,
            fromItem = children[from - 1],
            toItem = children[to - 1];

        // Unselect the thumbnail previously selected
        fromItem.setAttribute('aria-selected', false)
        ch.util.classList(fromItem).remove('ch-carousel-selected');

        // Select the new thumbnail
        toItem.setAttribute('aria-selected', true)
        ch.util.classList(toItem).add('ch-carousel-selected');
    };

    /**
     * Triggers all the necessary recalculations to be up-to-date.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.refresh = function () {

        var that = this,
            maskWidth = ch.util.getOuterDimensions(this._mask).width;

        // Check for changes on the width of mask, for the elastic carousel
        // Update the width of the mask
        if (maskWidth !== this._maskWidth) {
            // Update the global reference to the with of the mask
            this._maskWidth = maskWidth;
            // Calculate items per page and calculate pages, only when the amount of items was changed
            this._updateLimitPerPage();
            // Update the margin between items and its size
            this._updateDistribution();

            /**
             * Event emitted when the component makes all the necessary recalculations to be up-to-date.
             * @event ch.Carousel#refresh
             * @example
             * // Subscribe to "refresh" event.
             * carousel.on('refresh', function () {
             *     alert('Carousel was refreshed.');
             * });
             */
            this.emit('refresh');
        }

        // Check for a change in the total amount of items
        // Update items collection
        if (this._list.children.length !== this._items.length) {
            // Update the entire reference to items
            // uses querySelectorAll because it need a static collection
            this._items = this._list.querySelectorAll('li');
            // Calculates the total amount of pages and executes internal methods
            this._updatePages();
            // Go to the last page in case that the current page no longer exists
            if (this._currentPage > this._pages) {
                this._standbyFX(function () {
                    that.select(that._pages);
                });
            }

            /**
             * Event emitted when the component makes all the necessary recalculations to be up-to-date.
             * @event ch.Carousel#refresh
             * @ignore
             */
            this.emit('refresh');
        }

        return this;
    };

    /**
     * Moves the list to the specified page.
     * @memberof! ch.Carousel.prototype
     * @function
     * @param {Number} page Reference of page where the list has to move.
     * @returns {carousel}
     */
    Carousel.prototype.select = function (page) {
        // Getter
        if (page === undefined) {
            return this._currentPage;
        }

        // Avoid to move if it's disabled
        // Avoid to select the same page that is selected yet
        // Avoid to move beyond first and last pages
        if (!this._enabled || page === this._currentPage || page < 1 || page > this._pages) {
            return this;
        }

        // Perform these tasks in the following order:
        // Task 1: Move the list from 0 (zero), to page to move (page number beginning in zero)
        this._translate(-this._pageWidth * (page - 1));
        // Task 2: Update selected thumbnail on pagination
        this._switchPagination(this._currentPage, page);
        // Task 3: Update value of current page
        this._currentPage = page;
        // Task 4: Check for arrows behavior on first, last and middle pages
        this._updateArrows();
        // Task 5: Add items to the list, if it's necessary
        this._loadAsyncItems();

        /**
         * Event emitted when the component moves to another page.
         * @event ch.Carousel#select
         * @example
         * // Subscribe to "select" event.
         * carousel.on('select', function () {
         *     alert('Carousel was moved.');
         * });
         */
        this.emit('select');

        return this;
    };

    /**
     * Moves the list to the previous page.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.prev = function () {

        this.select(this._currentPage - 1);

        /**
         * Event emitted when the component moves to the previous page.
         * @event ch.Carousel#prev
         * @example
         * carousel.on('prev', function () {
         *     alert('Carousel has moved to the previous page.');
         * });
         */
        this.emit('prev');

        return this;
    };

    /**
     * Moves the list to the next page.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.next = function () {

        this.select(this._currentPage + 1);

        /**
         * Event emitted when the component moves to the next page.
         * @event ch.Carousel#next
         * @example
         * carousel.on('next', function () {
         *     alert('Carousel has moved to the next page.');
         * });
         */
        this.emit('next');

        return this;
    };

    /**
     * Enables a Carousel instance.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.enable = function () {

        this._el.setAttribute('aria-disabled', false);

        this._disableArrows(false, false);

        parent.enable.call(this);

        return this;
    };

    /**
     * Disables a Carousel instance.
     * @memberof! ch.Carousel.prototype
     * @function
     * @returns {carousel}
     */
    Carousel.prototype.disable = function () {

        this._el.setAttribute('aria-disabled', true);

        this._disableArrows(true, true);

        parent.disable.call(this);

        return this;
    };

    /**
     * Destroys a Carousel instance.
     * @memberof! ch.Carousel.prototype
     * @function
     */
    Carousel.prototype.destroy = function () {

        this._el.parentNode.replaceChild(this._snippet, this._el);

        ch.Event.dispatchCustomEvent(window.document, ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    ch.factory(Carousel);

}(this, this.ch));

(function (window, ch) {
    'use strict';

    function normalizeOptions(options) {
        var num = window.parseInt(options, 10);

        if (!window.isNaN(num)) {
            options = {
                'max': num
            };
        }

        return options;
    }

    /**
     * Countdown counts the maximum of characters that user can enter in a form control. Countdown could limit the possibility to continue inserting charset.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @param {HTMLElement} el A HTMLElement to create an instance of ch.Countdown.
     * @param {Object} [options] Options to customize an instance.
     * @param {Number} [options.max] Number of the maximum amount of characters user can input in form control. Default: 500.
     * @param {String} [options.plural] Message of remaining amount of characters, when it's different to 1. The variable that represents the number to be replaced, should be a hash. Default: "# characters left.".
     * @param {String} [options.singular] Message of remaining amount of characters, when it's only 1. The variable that represents the number to be replaced, should be a hash. Default: "# character left.".
     * @returns {countdown} Returns a new instance of Countdown.
     * @example
     * // Create a new Countdown.
     * var countdown = new ch.Countdown([el], [options]);
     * @example
     * // Create a new Countdown with custom options.
     * var countdown = new ch.Countdown({
     *     'max': 250,
     *     'plural': 'Left: # characters.',
     *     'singular': 'Left: # character.'
     * });
     * @example
     * // Create a new Countdown using the shorthand way (max as parameter).
     * var countdown = new ch.Countdown({'max': 500});
     */
    function Countdown(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Countdown is created.
             * @memberof! ch.Countdown.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Countdown#ready
         * @example
         * // Subscribe to "ready" event.
         * countdown.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Countdown, ch.Component);

    /**
     * The name of the component.
     * @memberof! ch.Countdown.prototype
     * @type {String}
     */
    Countdown.prototype.name = 'countdown';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Countdown.prototype
     * @function
     */
    Countdown.prototype.constructor = Countdown;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Countdown.prototype._defaults = {
        'plural': '# characters left.',
        'singular': '# character left.',
        'max': 500
    };

    /**
     * Initialize a new instance of Countdown and merge custom options with defaults options.
     * @memberof! ch.Countdown.prototype
     * @function
     * @private
     * @returns {countdown}
     */
    Countdown.prototype._init = function (el, options) {
        // Call to its parent init method
        parent._init.call(this, el, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,

            /**
             * Create the "id" attribute.
             * @type {String}
             * @private
             */
            messageID = 'ch-countdown-message-' + that.uid,

           /**
             * Singular or Plural message depending on amount of remaining characters.
             * @type {String}
             * @private
             */
            message;

        /**
         * The countdown trigger.
         * @type {HTMLTextAreaElement}
         * @example
         * // Gets the countdown trigger.
         * countdown.trigger;
         */
        this.trigger = this._el;
        ch.Event.addListener(this.trigger, 'keyup', function () { that._count(); });
        ch.Event.addListener(this.trigger, 'keypress', function () { that._count(); });
        ch.Event.addListener(this.trigger, 'keydown', function () { that._count(); });

        // IE8 doesn't work
        ch.Event.addListener(this.trigger, 'input', function () { that._count(); });

        // IE8 - IE10 doesn't work
        ch.Event.addListener(this.trigger, 'paste', function () { that._count(); });
        ch.Event.addListener(this.trigger, 'cut', function () { that._count(); });


        /**
         * Amount of free characters until full the field.
         * @type {Number}
         * @private
         */
        that._remaining = that._options.max - that._contentLength();

        // Update the message
        message = ((that._remaining === 1) ? that._options.singular : that._options.plural);

        /**
         * The countdown container.
         * @type {HTMLParagraphElement}
         */
        that.container = (function () {
            var parent = ch.util.parentElement(that._el);
                parent.insertAdjacentHTML('beforeend', '<span class="ch-countdown ch-form-hint" id="' + messageID + '">' + message.replace('#', that._remaining) + '</span>');

            return parent.querySelector('#' + messageID);
        }());

        this.on('disable', this._removeError);

        return this;
    };

    /**
     * Returns the length of value.
     * @function
     * @private
     * @returns {Number}
     */
    Countdown.prototype._contentLength = function () {
        return this._el.value.length;
    };

    /**
     * Process input of data on form control and updates remaining amount of characters or limits the content length. Also, change the visible message of remaining characters.
     * @function
     * @private
     * @returns {countdown}
     */
    Countdown.prototype._count = function () {

        if (!this._enabled) {
            return this;
        }

        var length = this._contentLength(),
            message;

        this._remaining = this._options.max - length;

        // Limit Count alert the user
        if (length <= this._options.max) {

            if (this._exceeded) {
                // Update exceeded flag
                this._exceeded = false;
                this._removeError();
            }

        } else if (length > this._options.max) {

            /**
             * Event emitted when the lenght of characters is exceeded.
             * @event ch.Countdown#exceed
             * @example
             * // Subscribe to "exceed" event.
             * countdown.on('exceed', function () {
             *     // Some code here!
             * });
             */
            this.emit('exceed');

            // Update exceeded flag
            this._exceeded = true;

            this.trigger.setAttribute('aria-invalid', 'true');
            ch.util.classList(this.trigger).add('ch-validation-error');

            ch.util.classList(this.container).add('ch-countdown-exceeded');
        }

        // Change visible message of remaining characters
        // Singular or Plural message depending on amount of remaining characters
        message = (this._remaining !== 1 ? this._options.plural : this._options.singular).replace(/\#/g, this._remaining);

        // Update DOM text
        this.container.innerText  = message;

        return this;

    };

     /**
     * Process input of data on form control and updates remaining amount of characters or limits the content length. Also, change the visible message of remaining characters.
     * @function
     * @private
     * @returns {countdown}
     */
    Countdown.prototype._removeError = function () {
        ch.util.classList(this.trigger).remove('ch-validation-error');
        this.trigger.setAttribute('aria-invalid', 'false');

        ch.util.classList(this.container).remove('ch-countdown-exceeded');

        return this;
    };

    /**
     * Destroys a Countdown instance.
     * @memberof! ch.Countdown.prototype
     * @function
     * @example
     * // Destroy a countdown
     * countdown.destroy();
     * // Empty the countdown reference
     * countdown = undefined;
     */
    Countdown.prototype.destroy = function () {
        var parentElement = ch.util.parentElement(this.container);
            parentElement.removeChild(this.container);

        ch.Event.dispatchCustomEvent(window.document, ch.onlayoutchange);

        parent.destroy.call(this);

        return;
    };

    // Factorize
    ch.factory(Countdown, normalizeOptions);

}(this, this.ch));
(function (window, ch) {
    'use strict';

    /**
     * Datepicker lets you select dates.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Calendar
     * @param {HTMLElement} [el] A HTMLElement to create an instance of ch.Datepicker.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.format] Sets the date format. Default: "DD/MM/YYYY".
     * @param {String} [options.selected] Sets a date that should be selected by default. Default: "today".
     * @param {String} [options.from] Set a minimum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @param {String} [options.to] Set a maximum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @param {Array} [options.monthsNames] A collection of months names. Default: ["Enero", ... , "Diciembre"].
     * @param {Array} [options.weekdays] A collection of weekdays. Default: ["Dom", ... , "Sab"].
     * @param {Boolean} [options.hiddenby] Determines how to hide the component. You must use: "button", "pointers", "pointerleave", "all" or "none". Default: "pointers".
     * @param {HTMLElement} [options.context] It's a reference to position and size of element that will be considered to carry out the position.
     * @param {String} [options.side] The side option where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "center".
     * @param {Number} [options.offsetX] Distance to displace the target horizontally.
     * @param {Number} [options.offsetY] Distance to displace the target vertically.
     * @param {String} [options.position] The type of positioning used. You must use: "absolute" or "fixed". Default: "absolute".
     * @returns {datepicker} Returns a new instance of Datepicker.
     * @example
     * // Create a new Datepicker.
     * var datepicker = new ch.Datepicker([selector], [options]);
     * @example
     * // Create a new Datepicker with custom options.
     * var datepicker = new ch.Datepicker({
     *     "format": "MM/DD/YYYY",
     *     "selected": "2011/12/25",
     *     "from": "2010/12/25",
     *     "to": "2012/12/25",
     *     "monthsNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
     *     "weekdays": ["Su", "Mo", "Tu", "We", "Thu", "Fr", "Sa"]
     * });
     */
    function Datepicker(selector, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(selector, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Datepicker is created.
             * @memberof! ch.Datepicker.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Datepicker#ready
         * @example
         * // Subscribe to "ready" event.
         * datepicker.on('ready', function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);
    }

    // Inheritance
    var parent = ch.util.inherits(Datepicker, ch.Component),
        // Creates methods enable and disable into the prototype.
        methods = ['enable', 'disable'],
        len = methods.length;

    function createMethods(method) {
        Datepicker.prototype[method] = function () {

            this._popover[method]();

            parent[method].call(this);

            return this;
        };
    }

    /**
     * The name of the component.
     * @memberof! ch.Datepicker.prototype
     * @type {String}
     * @example
     * // You can reach the associated instance.
     * var datepicker = $(selector).data('datepicker');
     */
    Datepicker.prototype.name = 'datepicker';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Datepicker.prototype
     * @function
     */
    Datepicker.prototype.constructor = Datepicker;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Datepicker.prototype._defaults = {
        'format': 'DD/MM/YYYY',
        'side': 'bottom',
        'align': 'center',
        'hiddenby': 'pointers'
    };

    /**
     * Initialize a new instance of Datepicker and merge custom options with defaults options.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @private
     * @returns {datepicker}
     */
    Datepicker.prototype._init = function (selector, options) {
        // Call to its parent init method
        parent._init.call(this, selector, options);

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        /**
         * The datepicker input field.
         * @type {HTMLElement}
         */
        this.field = this._el;
        this.field.insertAdjacentHTML('afterend', '<i role="button" class="ch-datepicker-trigger ch-icon-calendar"></i>');

        /**
         * The datepicker trigger.
         * @type {HTMLElement}
         */
        this.trigger = ch.util.nextElementSibling(this.field);

        /**
         * Reference to the Calendar component instanced.
         * @type {ch.Calendar}
         * @private
         */
        this._calendar = new ch.Calendar(document.createElement('div'), options);

        /**
         * Reference to the Popover component instanced.
         * @type {ch.Popover}
         * @private
         */
        this._popover = new ch.Popover(this.trigger, {
            '_className': 'ch-datepicker ch-cone',
            '_ariaRole': 'tooltip',
            'content': this._calendar.container,
            'side': this._options.side,
            'align': this._options.align,
            'offsetX': 1,
            'offsetY': 10,
            'shownby': 'pointertap',
            'hiddenby': this._options.hiddenby
        });

        ch.Event.addListener(this._popover._content, ch.onpointertap, function (event) {
            var el = event.target;

            // Day selection
            if (el.nodeName === 'TD' && el.className.indexOf('ch-calendar-disabled') === -1 && el.className.indexOf('ch-calendar-other') === -1) {
                that.pick(el.innerHTML);
            }

        });

        this.field.setAttribute('aria-describedby', 'ch-popover-' + this._popover.uid);

        // Change type of input to "text"
        this.field.type = 'text';

        // Change value of input if there are a selected date
        this.field.value = (this._options.selected) ? this._calendar.select() : this.field.value;

        // Hide popover
        this.on('disable', this.hide);

        return this;
    };

    /**
     * Shows the datepicker.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Shows a datepicker.
     * datepicker.show();
     */
    Datepicker.prototype.show = function () {

        if (!this._enabled) {
            return this;
        }

        this._popover.show();

        /**
         * Event emitted when a datepicker is shown.
         * @event ch.Datepicker#show
         * @example
         * // Subscribe to "show" event.
         * datepicker.on('show', function () {
         *     // Some code here!
         * });
         */
        this.emit('show');

        return this;
    };

    /**
     * Hides the datepicker.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Shows a datepicker.
     * datepicker.hide();
     */
    Datepicker.prototype.hide = function () {
        this._popover.hide();

        /**
         * Event emitted when a datepicker is hidden.
         * @event ch.Datepicker#hide
         * @example
         * // Subscribe to "hide" event.
         * datepicker.on('hide', function () {
         *     // Some code here!
         * });
         */
        this.emit('hide');

        return this;
    };

    /**
     * Selects a specific day into current month and year.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @private
     * @param {(String | Number)} day A given day to select.
     * @returns {datepicker}
     * @example
     * // Select a specific day.
     * datepicker.pick(28);
     */
    Datepicker.prototype.pick = function (day) {

        // Select the day and update input value with selected date
        this.field.value = [this._calendar._dates.current.year, this._calendar._dates.current.month, day].join('/');

        // Hide float
        this._popover.hide();

        // Select a date
        this.select(this.field.value);

        return this;
    };

    /**
     * Selects a specific date or returns the selected date.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @param {String} [date] A given date to select. The format of the given date should be "YYYY/MM/DD".
     * @returns {(datepicker | String)}
     * @example
     * // Returns the selected date.
     * datepicker.select();
     * @example
     * // Select a specific date.
     * datepicker.select('2014/05/28');
     */
    Datepicker.prototype.select = function (date) {

       // Setter
       // Select the day and update input value with selected date
        if (date) {
            this._calendar.select(date);
            this.field.value = this._calendar.select();

            /**
             * Event emitted when a date is selected.
             * @event ch.Datepicker#select
             * @example
             * // Subscribe to "select" event.
             * datepicker.on('select', function () {
             *     // Some code here!
             * });
             */
            this.emit('select');

            return this;
        }

        // Getter
        return this._calendar.select();
    };

    /**
     * Returns date of today
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {String} The date of today
     * @example
     * // Get the date of today.
     * var today = datepicker.getToday();
     */
    Datepicker.prototype.getToday = function () {
        return this._calendar.getToday();
    };

    /**
     * Moves to the next month.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Moves to the next month.
     * datepicker.nextMonth();
     */
    Datepicker.prototype.nextMonth = function () {
        this._calendar.nextMonth();

        /**
         * Event emitted when a next month is shown.
         * @event ch.Datepicker#nextmonth
         * @example
         * // Subscribe to "nextmonth" event.
         * datepicker.on('nextmonth', function () {
         *     // Some code here!
         * });
         */
        this.emit('nextmonth');

        return this;
    };

    /**
     * Move to the previous month.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Moves to the prev month.
     * datepicker.prevMonth();
     */
    Datepicker.prototype.prevMonth = function () {

        this._calendar.prevMonth();

        /**
         * Event emitted when a previous month is shown.
         * @event ch.Datepicker#prevmonth
         * @example
         * // Subscribe to "prevmonth" event.
         * datepicker.on('prevmonth', function () {
         *     // Some code here!
         * });
         */
        this.emit('prevmonth');

        return this;
    };

    /**
     * Move to the next year.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Moves to the next year.
     * datepicker.nextYear();
     */
    Datepicker.prototype.nextYear = function () {

        this._calendar.nextYear();

        /**
         * Event emitted when a next year is shown.
         * @event ch.Datepicker#nextyear
         * @example
         * // Subscribe to "nextyear" event.
         * datepicker.on('nextyear', function () {
         *     // Some code here!
         * });
         */
        this.emit('nextyear');

        return this;
    };

    /**
     * Move to the previous year.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Moves to the prev year.
     * datepicker.prevYear();
     */
    Datepicker.prototype.prevYear = function () {

        this._calendar.prevYear();

        /**
         * Event emitted when a previous year is shown.
         * @event ch.Datepicker#prevyear
         * @example
         * // Subscribe to "prevyear" event.
         * datepicker.on('prevyear', function () {
         *     // Some code here!
         * });
         */
        this.emit('prevyear');

        return this;
    };

    /**
     * Reset the Datepicker to date of today
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker}
     * @example
     * // Resset the datepicker
     * datepicker.reset();
     */
    Datepicker.prototype.reset = function () {

        // Delete input value
        this.field.value = '';
        this._calendar.reset();

        /**
         * Event emitter when the datepicker is reseted.
         * @event ch.Datepicker#reset
         * @example
         * // Subscribe to "reset" event.
         * datepicker.on('reset', function () {
         *     // Some code here!
         * });
         */
        this.emit('reset');

        return this;
    };

    /**
     * Set a minimum selectable date.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @param {String} date A given date to set as minimum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @returns {datepicker}
     * @example
     * // Set a minimum selectable date.
     * datepicker.setFrom('2010/05/28');
     */
    Datepicker.prototype.setFrom = function (date) {
        this._calendar.setFrom(date);

        return this;
    };

    /**
     * Set a maximum selectable date.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @param {String} date A given date to set as maximum selectable date. The format of the given date should be "YYYY/MM/DD".
     * @returns {datepicker}
     * @example
     * // Set a maximum selectable date.
     * datepicker.setTo('2014/05/28');
     */
    Datepicker.prototype.setTo = function (date) {
        this._calendar.setTo(date);

        return this;
    };

    /**
     * Enables an instance of Datepicker.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker} Returns an instance of Datepicker.
     * @example
     * // Enabling an instance of Datepicker.
     * datepicker.enable();
     */

    /**
     * Disables an instance of Datepicker.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @returns {datepicker} Returns an instance of Datepicker.
     * @example
     * // Disabling an instance of Datepicker.
     * datepicker.disable();
     */
    while (len) {
        createMethods(methods[len -= 1]);
    }

    /**
     * Destroys a Datepicker instance.
     * @memberof! ch.Datepicker.prototype
     * @function
     * @example
     * // Destroying an instance of Datepicker.
     * datepicker.destroy();
     */
    Datepicker.prototype.destroy = function () {

        ch.util.parentElement(this.trigger).removeChild(this.trigger);

        this._el.removeAttribute('aria-describedby');
        this._el.type = 'date';

        this._popover.destroy();

        parent.destroy.call(this);
    };

    // Factorize
    ch.factory(Datepicker);

}(this, this.ch));
(function (window, ch) {
    'use strict';


    function highlightSuggestion(target) {
        var posinset;

        Array.prototype.forEach.call(this._suggestionsList.childNodes, function(e, i){
            if(e.contains(target)){
                posinset = parseInt(target.getAttribute('aria-posinset'), 10) - 1;
            }
        });

        this._highlighted = (typeof posinset === 'number') ? posinset : null;

        this._toogleHighlighted();

        return this;
    };

    var specialKeyCodeMap = {
        9: 'tab',
        27: 'esc',
        37: 'left',
        39: 'right',
        13: 'enter',
        38: 'up',
        40: 'down'
    };

    /**
     * Autocomplete Component shows a list of suggestions for a HTMLInputElement.
     * @memberof ch
     * @constructor
     * @augments ch.Component
     * @requires ch.Popover
     * @param {HTMLElement} [el] A HTMLElement to create an instance of ch.Autocomplete.
     * @param {Object} [options] Options to customize an instance.
     * @param {String} [options.loadingClass] Default: "ch-autocomplete-loading".
     * @param {String} [options.highlightedClass] Default: "ch-autocomplete-highlighted".
     * @param {String} [options.itemClass] Default: "ch-autocomplete-item".
     * @param {String} [options.addClass] CSS class names that will be added to the container on the component initialization. Default: "ch-box-lite ch-autocomplete".
     * @param {Number} [options.keystrokesTime] Default: 150.
     * @param {Boolean} [options.html] Default: false.
     * @param {String} [options.side] The side option where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "bottom".
     * @param {String} [options.align] The align options where the target element will be positioned. You must use: "left", "right", "top", "bottom" or "center". Default: "left".
     * @param {Number} [options.offsetX] The offsetX option specifies a distance to displace the target horitontally.
     * @param {Number} [options.offsetY] The offsetY option specifies a distance to displace the target vertically.
     * @param {String} [options.positioned] The positioned option specifies the type of positioning used. You must use: "absolute" or "fixed". Default: "absolute".
     * @returns {autocomplete}
     * @example
     * // Create a new AutoComplete.
     * var autocomplete = new AutoComplete([el], [options]);
     * @example
     * // Create a new AutoComplete with configuration.
     * var autocomplete = new AutoComplete('.my-autocomplete', {
     *  'loadingClass': 'custom-loading',
     *  'highlightedClass': 'custom-highlighted',
     *  'itemClass': 'custom-item',
     *  'addClass': 'carousel-cities',
     *  'keystrokesTime': 600,
     *  'html': true,
     *  'side': 'center',
     *  'align': 'center',
     *  'offsetX': 0,
     *  'offsetY': 0,
     *  'positioned': 'fixed'
     * });
     */
    function Autocomplete(el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        this._init(el, options);

        if (this.initialize !== undefined) {
            /**
             * If you define an initialize method, it will be executed when a new Autocomplete is created.
             * @memberof! ch.Autocomplete.prototype
             * @function
             */
            this.initialize();
        }

        /**
         * Event emitted when the component is ready to use.
         * @event ch.Autocomplete#ready
         * @example
         * // Subscribe to "ready" event.
         * autocomplete.on('ready',function () {
         *     // Some code here!
         * });
         */
        window.setTimeout(function () { that.emit('ready'); }, 50);

        return this;

    }

    // Inheritance
    var parent = ch.util.inherits(Autocomplete, ch.Component),
        // there is no mouseenter to highlight the item, so it happens when the user do mousedown
        highlightEvent = (ch.support.touch) ? ch.onpointerdown : 'mouseover';

    /**
     * The name of the component.
     * @type {String}
     */
    Autocomplete.prototype.name = 'autocomplete';

    /**
     * Returns a reference to the constructor function.
     * @memberof! ch.Autocomplete.prototype
     * @function
     */
    Autocomplete.prototype.constructor = Autocomplete;

    /**
     * Configuration by default.
     * @type {Object}
     * @private
     */
    Autocomplete.prototype._defaults = {
        'loadingClass': 'ch-autocomplete-loading',
        'highlightedClass': 'ch-autocomplete-highlighted',
        'itemClass': 'ch-autocomplete-item',
        'addClass': 'ch-box-lite ch-autocomplete',
        'side': 'bottom',
        'align': 'left',
        'html': false,
        '_hiddenby': 'none',
        'keystrokesTime': 150,
        '_itemTemplate': '<li class="{{itemClass}}"{{suggestedData}}>{{term}}<i class="ch-icon-arrow-up" data-js="ch-autocomplete-complete-query"></i></li>'
    };

    /**
     * Initialize a new instance of Autocomplete and merge custom options with defaults options.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._init = function (el, options) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        // Call to its parent init method
        parent._init.call(this, el, options);

        // creates the basic item template for this instance
        this._options._itemTemplate = this._options._itemTemplate.replace('{{itemClass}}', this._options.itemClass);

        if (this._options.html) {
            // remove the suggested data space when html is configured
            this._options._itemTemplate = this._options._itemTemplate.replace('{{suggestedData}}', '');
        }

        // The component who shows and manage the suggestions.
        this._popover = new ch.Popover({
            'reference': this._el,
            'content': this._suggestionsList,
            'side': this._options.side,
            'align': this._options.align,
            'addClass': this._options.addClass,
            'hiddenby': this._options._hiddenby,
            'width': this._el.getBoundingClientRect().width + 'px',
            'fx': this._options.fx
        });
        /**
         * The autocomplete container.
         * @type {HTMLDivElement}
         * @example
         * // Gets the autocomplete container to append or prepend content.
         * autocomplete.container.appendChild(document.createElement('div'));
         */
        this.container = this._popover.container;

        this.container.setAttribute('aria-hidden', 'true');

        /**
         * The autocomplete suggestion list.
         * @type {HTMLUListElement}
         * @private
         */
        this._suggestionsList = document.createElement('ul');
        ch.util.classList(this._suggestionsList).add('ch-autocomplete-list');

        this.container.appendChild(this._suggestionsList);

        /**
         * Selects the items
         * @memberof! ch.Autocomplete.prototype
         * @function
         * @private
         * @returns {autocomplete}
         */

        this._highlightSuggestion = function (event) {
            var target = event.target || event.srcElement,
                item = (target.nodeName === 'LI') ? target : (target.parentNode.nodeName === 'LI') ? target.parentNode : null;

            if (item !== null) {
                highlightSuggestion.call(that, item);
            }

        };

        ch.Event.addListener(this.container, highlightEvent, this._highlightSuggestion);


        ch.Event.addListener(this.container, ch.onpointerdown, function itemEvents(event) {
            var target = event.target || event.srcElement;

            // completes the value, it is a shortcut to avoid write the complete word
            if (target.nodeName === 'I' && !that._options.html) {
                ch.util.prevent(event);
                that._el.value = that._suggestions[that._highlighted];
                that.emit('type', that._el.value);
                return;
            }

            if ((target.nodeName === 'LI' && target.className.indexOf(that._options.itemClass) !== -1) || (target.parentElement.nodeName === 'LI' && target.parentElement.className.indexOf(that._options.itemClass) !== -1)) {
                that._selectSuggestion();
            }
        });

        /**
         * The autocomplete trigger.
         * @type {HTMLElement}
         */
        this.trigger = this._el;

        this.trigger.setAttribute('aria-autocomplete', 'list');
        this.trigger.setAttribute('aria-haspopup', 'true');
        this.trigger.setAttribute('aria-owns', this.container.getAttribute('id'));
        this.trigger.setAttribute('autocomplete', 'off');

        ch.Event.addListener(this.trigger, 'focus', function turnon() { that._turn('on'); })
        ch.Event.addListener(this.trigger, 'blur', function turnoff() {that._turn('off'); });

        // Turn on when the input element is already has focus
        if (this._el === document.activeElement && !this._enabled) {
            this._turn('on');
        }

        // The number of the selected item or null when no selected item is.
        this._highlighted = null;

        // Collection of suggestions to be shown.
        this._suggestions = [];

        // Used to show when the user cancel the suggestions
        this._originalQuery = this._currentQuery = this._el.value;

        if (this._configureShortcuts !== undefined) {
            this._configureShortcuts();
        }

        return this;
    };

    /**
     * Turns on the ability off listen the keystrokes
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._turn = function (turn) {
        var that = this;

        if (!this._enabled) {
            return this;
        }


        function turnOn() {
            that._currentQuery = that._el.value.trim();

            // when the user writes
            window.clearTimeout(that._stopTyping);

            that._stopTyping = window.setTimeout(function () {

                ch.util.classList(that.trigger).add(that._options.loadingClass);
                /**
                 * Event emitted when the user is typing.
                 * @event ch.Autocomplete#type
                 * @example
                 * // Subscribe to "type" event with ajax call
                 * autocomplete.on('type', function (userInput) {
                 *      $.ajax({
                 *          'url': '/countries?q=' + userInput,
                 *          'dataType': 'json',
                 *          'success': function (response) {
                 *              autocomplete.suggest(response);
                 *          }
                 *      });
                 * });
                 * @example
                 * // Subscribe to "type" event with jsonp
                 * autocomplete.on('type', function (userInput) {
                 *       $.ajax({
                 *           'url': '/countries?q='+ userInput +'&callback=parseResults',
                 *           'dataType': 'jsonp',
                 *           'cache': false,
                 *           'global': true,
                 *           'context': window,
                 *           'jsonp': 'parseResults',
                 *           'crossDomain': true
                 *       });
                 * });
                 */
                that.emit('type', that._currentQuery);
            }, that._options.keystrokesTime);
        }

        function turnOnFallback(e) {
            if (specialKeyCodeMap[e.which || e.keyCode]) {
                return;
            }
            // When keydown is fired that.trigger still has an old value
            setTimeout(turnOn, 1);
        }

        this._originalQuery = this._el.value;

        // IE8 don't support the input event at all
        // IE9 is the only browser that doesn't fire the input event when characters are removed
        if (turn === 'on') {
            if (!ch.util.isMsie() || ch.util.isMsie() > 9) {
                ch.Event.addListener(this.trigger, ch.onkeyinput, turnOn);
            } else {
                'keydown cut paste'.split(' ').forEach(function(evtName) {
                    ch.Event.addListener(that.trigger, evtName, turnOnFallback);
                });
            }
        } else if (turn === 'off') {
            this.hide();
            if (!ch.util.isMsie() || ch.util.isMsie() > 9) {
                ch.Event.removeListener(this.trigger, ch.onkeyinput, turnOn);
            } else {
                'keydown cut paste'.split(' ').forEach(function(evtName) {
                    ch.Event.removeListener(that.trigger, evtName, turnOnFallback);
                });
            }
        }

        return this;

    };

    /**
     * It sets to the HTMLInputElement the selected query and it emits a 'select' event.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._selectSuggestion = function () {

        window.clearTimeout(this._stopTyping);

        if (this._highlighted === null) {
            return this;
        }

        if (!this._options.html) {
            this._el.value = this._suggestions[this._highlighted];
        }

        this._el.blur();

        /**
         * Event emitted when a suggestion is selected.
         * @event ch.Autocomplete#select
         * @example
         * // Subscribe to "select" event.
         * autocomplete.on('select', function () {
         *     // Some code here!
         * });
         */
        this.emit('select');

        return this;
    };

    /**
     * It highlights the item adding the "ch-autocomplete-highlighted" class name or the class name that you configured as "highlightedClass" option.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._toogleHighlighted = function () {
        // null is when is not a selected item but,
        // increments 1 _highlighted because aria-posinset starts in 1 instead 0 as the collection that stores the data
        var current = (this._highlighted === null) ? null : (this._highlighted + 1),
            currentItem = this.container.querySelector('[aria-posinset="' + current + '"]'),
            selectedItem = this.container.querySelector('[aria-posinset].' + this._options.highlightedClass);

        if (selectedItem !== null) {
            // background the highlighted item
            ch.util.classList(selectedItem).remove(this._options.highlightedClass);
        }

        if (currentItem !== null) {
            // highlight the selected item
            ch.util.classList(currentItem).add(this._options.highlightedClass);
        }

        return this;
    };

    /**
     * Add suggestions to be shown.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @returns {autocomplete}
     * @example
     * // The suggest method needs an Array of strings to work with default configuration
     * autocomplete.suggest(['Aruba','Armenia','Argentina']);
     * @example
     * // To work with html configuration, it needs an Array of strings. Each string must to be as you wish you watch it
     * autocomplete.suggest([
     *  '<strong>Ar</strong>uba <i class="flag-aruba"></i>',
     *  '<strong>Ar</strong>menia <i class="flag-armenia"></i>',
     *  '<strong>Ar</strong>gentina <i class="flag-argentina"></i>'
     * ]);
     */
    Autocomplete.prototype.suggest = function (suggestions) {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            items = [],
            matchedRegExp = new RegExp('(' + this._currentQuery.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1") + ')', 'ig'),
            totalItems = 0,
            itemDOMCollection,
            itemTemplate = this._options._itemTemplate,
            suggestedItem,
            term,
            suggestionsLength = suggestions.length,
            el,
            itemSelected = this.container.querySelector('.' + this._options.highlightedClass);

        // hide the loading feedback
        ch.util.classList(this.trigger).remove(that._options.loadingClass)

        // hides the suggestions list
        if (suggestionsLength === 0) {
            this._popover.hide();

            return this;
        }

        // shows the suggestions list when the is closed and the element is withs focus
        if (!this._popover.isShown() && window.document.activeElement === this._el) {
            this._popover.show();
        }

        // remove the class from the extra added items
        if (itemSelected !== null) {
            ch.util.classList(itemSelected).remove(this._options.highlightedClass);
        }

        // add each suggested item to the suggestion list
        for (suggestedItem = 0; suggestedItem < suggestionsLength; suggestedItem += 1) {
            // get the term to be replaced
            term = suggestions[suggestedItem];

            // for the html configured component doesn't highlight the term matched it must be done by the user
            if (!that._options.html) {
                term = term.replace(matchedRegExp, '<strong>$1</strong>');
                itemTemplate = this._options._itemTemplate.replace('{{suggestedData}}', ' data-suggested="' + suggestions[suggestedItem] + '"');
            }

            items.push(itemTemplate.replace('{{term}}', term));
        }

        this._suggestionsList.innerHTML = items.join('');

        itemDOMCollection = this.container.querySelectorAll('.' + this._options.itemClass);

        // with this we set the aria-setsize value that counts the total
        totalItems = itemDOMCollection.length;

        // Reset suggestions collection.
        this._suggestions.length = 0;

        for (suggestedItem = 0; suggestedItem < totalItems; suggestedItem += 1) {
            el = itemDOMCollection[suggestedItem];

            // add the data to the suggestions collection
            that._suggestions.push(el.getAttribute('data-suggested'));

            el.setAttribute('aria-posinset', that._suggestions.length);
            el.setAttribute('aria-setsize', totalItems);
        }

        this._highlighted = null;

        this._suggestionsQuantity = this._suggestions.length;

        return this;
    };

    /**
     * Hides component's container.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @returns {autocomplete}
     * @example
     * // Hides the autocomplete.
     * autocomplete.hide();
     */
    Autocomplete.prototype.hide = function () {

        if (!this._enabled) {
            return this;
        }

        this._popover.hide();

        /**
         * Event emitted when the Autocomplete container is hidden.
         * @event ch.Autocomplete#hide
         * @example
         * // Subscribe to "hide" event.
         * autocomplete.on('hide', function () {
         *  // Some code here!
         * });
         */
        this.emit('hide');

        return this;
    };

    /**
     * Returns a Boolean if the component's core behavior is shown. That means it will return 'true' if the component is on and it will return false otherwise.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @returns {Boolean}
     * @example
     * // Execute a function if the component is shown.
     * if (autocomplete.isShown()) {
     *     fn();
     * }
     */
    Autocomplete.prototype.isShown = function () {
        return this._popover.isShown();
    };

    Autocomplete.prototype.disable = function () {
        if (this.isShown()) {
            this.hide();
            this._el.blur();
        }

        parent.disable.call(this);

        return this;
    };

    /**
     * Destroys an Autocomplete instance.
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @example
     * // Destroying an instance of Autocomplete.
     * autocomplete.destroy();
     */
    Autocomplete.prototype.destroy = function () {

        ch.Event.removeListener(this.container, highlightEvent, this._highlightSuggestion);

        this.trigger.removeAttribute('autocomplete');
        this.trigger.removeAttribute('aria-autocomplete');
        this.trigger.removeAttribute('aria-haspopup');
        this.trigger.removeAttribute('aria-owns');

        this._popover.destroy();

        parent.destroy.call(this);

        return;
    };

    ch.factory(Autocomplete);

}(this, this.ch));

(function (Autocomplete, ch) {
    'use strict';
    /**
     * Congfigure shortcuts to navigate and set values, or cancel the typed text
     * @memberof! ch.Autocomplete.prototype
     * @function
     * @private
     * @returns {autocomplete}
     */
    Autocomplete.prototype._configureShortcuts = function () {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this;

        // Shortcuts
        ch.shortcuts.add(ch.onkeyenter, this.uid, function (event) {
            ch.util.prevent(event);
            that._selectSuggestion();
        });

        ch.shortcuts.add(ch.onkeyesc, this.uid, function () {
            that.hide();
            that._el.value = that._originalQuery;
        });

        ch.shortcuts.add(ch.onkeyuparrow, this.uid, function (event) {
            ch.util.prevent(event);

            var value;

            // change the selected value & stores the future HTMLInputElement value
            if (that._highlighted === null) {

                that._highlighted = that._suggestionsQuantity - 1;
                value = that._suggestions[that._highlighted];

            } else if (that._highlighted <= 0) {

                this._prevHighlighted = this._currentHighlighted = null;
                value = that._currentQuery;

            } else {

                that._highlighted -= 1;
                value = that._suggestions[that._highlighted];

            }

            that._toogleHighlighted();

            if (!that._options.html) {
                that._el.value = value;
            }

        });

        ch.shortcuts.add(ch.onkeydownarrow, this.uid, function () {
            var value;

            // change the selected value & stores the future HTMLInputElement value
            if (that._highlighted === null) {

                that._highlighted = 0;

                value = that._suggestions[that._highlighted];

            } else if (that._highlighted >= that._suggestionsQuantity - 1) {

                that._highlighted = null;
                value = that._currentQuery;

            } else {

                that._highlighted += 1;
                value = that._suggestions[that._highlighted];

            }

            that._toogleHighlighted();

            if (!that._options.html) {
                that._el.value = value;
            }

        });

        // Activate the shortcuts for this instance
        this._popover.on('show', function () { ch.shortcuts.on(that.uid); });

        // Deactivate the shortcuts for this instance
        this._popover.on('hide', function () { ch.shortcuts.off(that.uid); });

        this.on('destroy', function () {
            ch.shortcuts.remove(this.uid);
        });

        return this;
    };

}(this.ch.Autocomplete, this.ch));