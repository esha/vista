(function() {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  function visible(element) {
    return element.offsetWidth > 0 || element.offsetHeight > 0;
  }

  module('vista');

  test('API', function() {
    equal(typeof Vista, "object", 'Vista should be present');
    equal(typeof Vista.version, "string", "Vista.version");
    equal(typeof Vista.init, "undefined", "Vista.init should not be exposed");
    equal(typeof Vista.define, "function", "Vista.define");
    equal(Array.isArray(Vista.inline), true, "Vista.inline");
    equal(typeof Vista.rules, "function", "Vista.rules");
    equal(typeof Vista.update, "function", "Vista.update");
    equal(typeof Vista.toggle, "function", "Vista.toggle");
    equal(typeof Vista.active, "function", "Vista.active");
  });

  test('Vista.define', function() {
    Vista.define('name');
    var view = Vista._list.pop();
    equal(view.name, 'name');
    equal(view.test('name'), true);
    equal(view.test('nope'), false);
    Vista.define('regexp', /^(reg|exp)$/);
    view = Vista._list.pop();
    equal(view.name, 'regexp');
    equal(view.test('reg'), true);
    equal(view.test('exp'), true);
    equal(view.test('regexp'), false);
    var fn = function(){};
    Vista.define('function', fn);
    view = Vista._list.pop();
    equal(view.name, 'function');
    equal(view.test, fn);
  });

  test('Vista.rules for all inline elements', function() {
    expect(Vista.inline.length);
    var css = Vista.rules('rule');
    Vista.inline.forEach(function(el) {
      ok(css.indexOf('.vista-rule '+el+'.show-rule') > 0);
    });
  });

  test('Vista.update calls all test fns', function() {
    expect(2);
    var _list = Vista._list;
    Vista._list = [];
    Vista.define('one', function() {
      ok('one');
    });
    Vista.define('two', function() {
      ok('two');
    });
    Vista.update();
    Vista._list = _list;
  });

  test('Vista.toggle', function() {
    var classes = document.documentElement.classList;
    equal(classes.contains('vista-test'), false);
    Vista.toggle('test', true);
    equal(classes.contains('vista-test'), true);
    Vista.toggle('test', true);
    equal(classes.contains('vista-test'), true);
    Vista.toggle('test', false);
    equal(classes.contains('vista-test'), false);
    Vista.toggle('test');
    equal(classes.contains('vista-test'), true);
    Vista.toggle('test');
    equal(classes.contains('vista-test'), false);
  });

  test('Vista.active', function() {
    var classes = document.documentElement.classList;
    Vista.toggle('test', true);
    var active = Vista.active('test');
    equal(typeof active, "boolean");
    ok(active, 'should be active');
    equal(active, classes.contains('vista-test'));
    Vista.toggle('test', false);
    ok(!Vista.active('test'));
  });

  test('head meta-tag definitions', function() {
    var show = document.querySelector('.show-index'),
        hide = document.querySelector('.hide-index');
    ok(visible(show));
    ok(!visible(hide));

    show = document.querySelector('.show-hash');
    hide = document.querySelector('.hide-hash');
    ok(!visible(show));
    ok(visible(hide));
    location.hash = 'hash';
    ok(visible(show));
    ok(!visible(hide));
  });

  test('body meta-tag definitions', function() {
    var show = document.querySelector('.show-re'),
        hide = document.querySelector('.hide-re');
    ok(!visible(show));
    ok(visible(hide));
    location.hash = '';
    ok(visible(show));
    ok(!visible(hide));
  });

}());
