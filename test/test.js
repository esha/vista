(function(isVisible, isNotVisible) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      QUnit.module(name, {[setup][ ,teardown]})
      QUnit.test(name, callback)
      assert.assert.expect(numberOfAssertions)
      assert.async([numberOfCallbacks])
    Test assertions:
      assert.ok(value, [message])
      assert.equal(actual, expected, [message])
      assert.notEqual(actual, expected, [message])
      assert.deepEqual(actual, expected, [message])
      assert.notDeepEqual(actual, expected, [message])
      assert.strictEqual(actual, expected, [message])
      assert.notStrictEqual(actual, expected, [message])
      assert.throws(block, [expected], [message])
  */
  QUnit.module('vista');

  QUnit.test('API', function(assert) {
    assert.equal(typeof Vista, "object", 'Vista should be present');
    assert.equal(typeof Vista.version, "string", "Vista.version");
    assert.equal(typeof Vista.init, "undefined", "Vista.init should not be exposed");
    assert.equal(typeof Vista.define, "function", "Vista.define");
    assert.equal(typeof Vista.update, "function", "Vista.update");
    assert.equal(typeof Vista.toggle, "function", "Vista.toggle");
    assert.equal(typeof Vista.active, "function", "Vista.active");
    assert.equal(typeof Vista.style, "object", "Vista.style");
    assert.equal(typeof Vista.tests, "object", "Vista.tests");
  });

  QUnit.test('Vista.define', function(assert) {
    Vista.define('name');
    var test = Vista.tests.name;
    assert.equal(typeof test, 'function');
    assert.equal(test('name'), true);
    assert.equal(test('nope'), false);
    delete Vista.tests.name;

    Vista.define('regexp', /^(reg|exp)$/);
    test = Vista.tests.regexp;
    assert.equal(typeof test, 'function');
    assert.equal(test('reg'), true);
    assert.equal(test('exp'), true);
    assert.equal(test('regexp'), false);
    delete Vista.tests.regexp;

    var fn = function(){};
    Vista.define('function', fn);
    test = Vista.tests.function;
    assert.equal(typeof test, 'function');
    assert.strictEqual(test, fn);
    delete Vista.tests.function;
  });

  QUnit.test('Vista.define w/style arg', function(assert) {
    assert.expect(1);
    var rules = Vista._rules;
    Vista._rules = function(name, style) {
      Vista._rules = rules;
      assert.equal(style, 'inline');
      return rules(name, style);
    };
    Vista.define('style', 'foo', 'inline');
  });

  QUnit.test('Vista._rules includes style', function(assert) {
    var rule = Vista._rules('foo', 'flex');
    assert.ok(rule.indexOf('display: flex') > 0);
  });

  QUnit.test('Vista.update calls all test fns', function(assert) {
    assert.expect(2);
    var tests = Vista.tests;
    Vista.tests = {};
    Vista.define('one', function() {
      assert.ok('one');
    });
    Vista.define('two', function() {
      assert.ok('two');
    });
    Vista.update();
    Vista.tests = tests;
  });

  QUnit.test('Vista.toggle', function(assert) {
    var html = document.documentElement;
    assert.equal(html.hasAttribute('vista-test'), false);
    Vista.toggle('test', true);
    assert.equal(html.hasAttribute('vista-test'), true);
    Vista.toggle('test', true);
    assert.equal(html.hasAttribute('vista-test'), true);
    Vista.toggle('test', false);
    assert.equal(html.hasAttribute('vista-test'), false);
    Vista.toggle('test');
    assert.equal(html.hasAttribute('vista-test'), true);
    Vista.toggle('test');
    assert.equal(html.hasAttribute('vista-test'), false);
  });

  QUnit.test('Vista.active', function(assert) {
    var html = document.documentElement;
    
    Vista.toggle('foo', true);
    var active = Vista.active('foo');
    assert.equal(typeof active, "boolean");
    assert.ok(active, 'should be active');
    assert.ok(!Vista.active('!foo'));
    assert.equal(active, html.hasAttribute('vista-foo'));
    
    Vista.toggle('foo', false);
    assert.ok(!Vista.active('foo'));
    assert.ok(Vista.active('!foo'));
  });

  QUnit.test('head meta-tag definitions', function(assert) {
    var show = document.querySelector('[vista~="index"]'),
        hide = document.querySelector('[vista~="!index"]');
    isVisible(assert, show);
    isNotVisible(assert, hide);

    show = document.querySelector('[vista~="hash"]');
    hide = document.querySelector('[vista~="!hash"]');
    isNotVisible(assert, show);
    isVisible(assert, hide);
    location.hash = 'hash';
    assert.ok(Vista.active('hash'), 'hash should be active');
    isVisible(assert, show, 'hash element is not visible when hash is '+location.hash);
    isNotVisible(assert, hide, '!hash element is visible when hash is '+location.hash);
    
    // tests should match full URL section, not just partial section
    location.hash = 'hashes';
    assert.equal(Vista.active('hash'), false, 'hash should not be active');
    isNotVisible(assert, show);
    isVisible(assert, hide);
  });

  QUnit.test('body meta-tag definitions', function(assert) {
    location.hash = '';
    var show = document.querySelector('[vista~="re"]'),
        hide = document.querySelector('[vista~="!re"]');
    isVisible(assert, show);
    isNotVisible(assert, hide);
    location.hash = '';
    assert.ok(Vista.active('re'), 're should be active');
    isVisible(assert, show);
    isNotVisible(assert, hide);
  });

  QUnit.test('body shortcut definitions', function(assert) {
    var simple = document.querySelector('[vista="simple"]'),
        not = document.querySelector('[vista="!notsimple"]');
    isNotVisible(assert, simple);
    isVisible(assert, not);
    location.hash = 'simple';
    assert.ok(Vista.active('simple'), 'simple should be active');
    isVisible(assert, simple);
    location.hash = 'notsimple';
    isNotVisible(assert, not);
    location.hash = '';
  });

  QUnit.test('implicit OR of tests', function(assert) {
    var show = document.querySelector('[vista="!hash !re"]');
    isNotVisible(assert, show);
    location.hash = '#other';
    isVisible(assert, show);

    // thoroughly test that it's an implicit OR
    show = document.querySelector('[vista="hash simple"]');
    isNotVisible(assert, show);
    location.hash = 'simple';
    isVisible(assert, show);
    location.hash = '';
    isNotVisible(assert, show);
    location.hash = 'hash';
    isVisible(assert, show);
    location.hash = '';
    isNotVisible(assert, show);
  });

  QUnit.test('explicit AND of tests', function(assert) {
    var show = document.querySelector('[vista="hash+simple"]');
    isNotVisible(assert, show);
    location.hash = 'simple';
    isNotVisible(assert, show);
    location.hash = 'hash';
    isNotVisible(assert, show);
    location.hash = 'hash/simple';
    isVisible(assert, show);
    location.hash = '';
    isNotVisible(assert, show);

    show = document.querySelector('[vista="simple+!hash+index"]');
    isNotVisible(assert, show);
    location.hash = 'hash/simple';
    isNotVisible(assert, show);
    location.hash = 'simple';
    isVisible(assert, show);
    location.hash = '';
    isNotVisible(assert, show);
  });

}(window.isVisible, window.isNotVisible));
