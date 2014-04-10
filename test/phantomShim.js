// PhantomJS doesn't support bind yet - https://github.com/ariya/phantomjs/issues/10522
if (typeof Function.prototype.bind !== 'function') {
  if (console) {
    console.log('\nTests are using a shim for Function.prototype.bind to polyfill testing for PhantomJS.\nIf you are running these tests in a browser, your results may be inaccurate.');
  }
  Function.prototype.bind = function() {
    var slice = Array.prototype.slice,
      fn = this,
      callWith = slice.call(arguments),
      bound = function() {
        return fn.call.apply(fn, callWith.concat(slice.call(arguments)));
      };
    bound.prototype = fn.prototype;
    return bound;
  };
}
