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
    return element && (element.offsetWidth > 0 || element.offsetHeight > 0);
  }

  module('vista');

  test('API', function() {
    equal(typeof Vista, "object", 'Vista should be present');
    equal(typeof Vista.version, "string", "Vista.version");
    equal(typeof Vista.init, "undefined", "Vista.init should not be exposed");
    equal(typeof Vista.define, "function", "Vista.define");
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

  test('Vista.define w/style arg', function() {
    expect(1);
    var rules = Vista.rules;
    Vista.rules = function(name, style) {
      Vista.rules = rules;
      equal(style, 'inline');
      return rules(name, style);
    };
    Vista.define('style', 'foo', 'inline');
  });

  test('Vista.rules includes style', function() {
    var rule = Vista.rules('foo', 'flex');
    ok(rule.indexOf('display: flex') > 0);
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
    var html = document.documentElement;
    equal(html.hasAttribute('vista-test'), false);
    Vista.toggle('test', true);
    equal(html.hasAttribute('vista-test'), true);
    Vista.toggle('test', true);
    equal(html.hasAttribute('vista-test'), true);
    Vista.toggle('test', false);
    equal(html.hasAttribute('vista-test'), false);
    Vista.toggle('test');
    equal(html.hasAttribute('vista-test'), true);
    Vista.toggle('test');
    equal(html.hasAttribute('vista-test'), false);
  });

  test('Vista.active', function() {
    var html = document.documentElement;
    Vista.toggle('test', true);
    var active = Vista.active('test');
    equal(typeof active, "boolean");
    ok(active, 'should be active');
    equal(active, html.hasAttribute('vista-test'));
    Vista.toggle('test', false);
    ok(!Vista.active('test'));
  });

//HACK: Until  is fixed, skip affected tests during build.
if (!window.skipVisibilityTests) {
  test('head meta-tag definitions', function() {
    var show = document.querySelector('[vista~="index"]'),
        hide = document.querySelector('[vista~="!index"]');
    ok(visible(show));
    ok(!visible(hide));

    show = document.querySelector('[vista~="hash"]');
    hide = document.querySelector('[vista~="!hash"]');
    ok(!visible(show));
    ok(visible(hide));
    location.hash = 'hash';
    ok(Vista.active('hash'), 'hash should be active');
    ok(visible(show), 'hash element is not visible when hash is '+location.hash);
    ok(!visible(hide), '!hash element is visible when hash is '+location.hash);
  });

  test('body meta-tag definitions', function() {
    var show = document.querySelector('[vista~="re"]'),
        hide = document.querySelector('[vista~="!re"]');
    ok(!visible(show));
    ok(visible(hide));
    location.hash = '';
    ok(Vista.active('re'), 're should be active');
    ok(visible(show));
    ok(!visible(hide));
  });

  test('multiple associations', function() {
    var show = document.querySelector('[vista="!hash !re"]');
    ok(!visible(show));
    location.hash = '#other';
    ok(visible(show));
  });
} else {
  window.console.log('\nSkipping visibility tests until https://github.com/ariya/phantomjs/issues/12668 is fixed.\n'+
                     'Please test in another browser to ensure functionality.');
}

}());
