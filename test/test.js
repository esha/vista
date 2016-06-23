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
  window.visible = visible;

  module('vista');

  test('API', function() {
    equal(typeof Vista, "object", 'Vista should be present');
    equal(typeof Vista.version, "string", "Vista.version");
    equal(typeof Vista.init, "undefined", "Vista.init should not be exposed");
    equal(typeof Vista.define, "function", "Vista.define");
    equal(typeof Vista.update, "function", "Vista.update");
    equal(typeof Vista.toggle, "function", "Vista.toggle");
    equal(typeof Vista.active, "function", "Vista.active");
    equal(typeof Vista.style, "object", "Vista.style");
    equal(typeof Vista.tests, "object", "Vista.tests");
  });

  test('Vista.define', function() {
    Vista.define('name');
    var test = Vista.tests.name;
    equal(typeof test, 'function');
    equal(test('name'), true);
    equal(test('nope'), false);
    delete Vista.tests.name;

    Vista.define('regexp', /^(reg|exp)$/);
    test = Vista.tests.regexp;
    equal(typeof test, 'function');
    equal(test('reg'), true);
    equal(test('exp'), true);
    equal(test('regexp'), false);
    delete Vista.tests.regexp;

    var fn = function(){};
    Vista.define('function', fn);
    test = Vista.tests.function;
    equal(typeof test, 'function');
    strictEqual(test, fn);
    delete Vista.tests.function;
  });

  test('Vista.define w/style arg', function() {
    expect(1);
    var rules = Vista._rules;
    Vista._rules = function(name, style) {
      Vista._rules = rules;
      equal(style, 'inline');
      return rules(name, style);
    };
    Vista.define('style', 'foo', 'inline');
  });

  test('Vista._rules includes style', function() {
    var rule = Vista._rules('foo', 'flex');
    ok(rule.indexOf('display: flex') > 0);
  });

  test('Vista.update calls all test fns', function() {
    expect(2);
    var tests = Vista.tests;
    Vista.tests = {};
    Vista.define('one', function() {
      ok('one');
    });
    Vista.define('two', function() {
      ok('two');
    });
    Vista.update();
    Vista.tests = tests;
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
    
    Vista.toggle('foo', true);
    var active = Vista.active('foo');
    equal(typeof active, "boolean");
    ok(active, 'should be active');
    ok(!Vista.active('!foo'));
    equal(active, html.hasAttribute('vista-foo'));
    
    Vista.toggle('foo', false);
    ok(!Vista.active('foo'));
    ok(Vista.active('!foo'));
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

  test('body shortcut definitions', function() {
    var simple = document.querySelector('[vista~="simple"]'),
        not = document.querySelector('[vista~="!notsimple"]');
    ok(!visible(simple));
    ok(visible(not));
    location.hash = 'simple';
    ok(Vista.active('simple'), 'simple should be active');
    ok(visible(simple));
    location.hash = 'notsimple';
    ok(!visible(not));
    location.hash = '';
  });

  test('implicit OR of tests', function() {
    var show = document.querySelector('[vista="!hash !re"]');
    ok(!visible(show));
    location.hash = '#other';
    ok(visible(show));

    // thoroughly test that it's an implicit OR
    show = document.querySelector('[vista="hash simple"]');
    ok(!visible(show));
    location.hash = 'simple';
    ok(visible(show));
    location.hash = '';
    ok(!visible(show));
    location.hash = 'hash';
    ok(visible(show));
    location.hash = '';
    ok(!visible(show));
  });

  test('explicit AND of tests', function() {
    var show = document.querySelector('[vista="hash+simple"]');
    ok(!visible(show));
    location.hash = 'simple';
    ok(!visible(show));
    location.hash = 'hash';
    ok(!visible(show));
    location.hash = 'hash/simple';
    ok(visible(show));
    location.hash = '';
    ok(!visible(show));

    show = document.querySelector('[vista="simple+!hash+index"]');
    ok(!visible(show));
    location.hash = 'hash/simple';
    ok(!visible(show));
    location.hash = 'simple';
    ok(visible(show));
    location.hash = '';
    ok(!visible(show));
  });
} else {
  window.console.log('\nSkipping visibility tests until https://github.com/ariya/phantomjs/issues/12668 is fixed.\n'+
                     'Please test in another browser to ensure functionality.');
}

}());
