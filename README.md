#### Vista uses generated CSS to provide declarative, URL-driven control of when (or how) any elements in your page are displayed, right from your HTML.

### A Quick Example

```html
<p vista="foo">Foo</p><!-- hidden while no section of the URL is 'foo' -->
<p vista="!foo">Bar</p><!-- visible while no section of the URL is 'foo' -->
<a href="#foo">Show Foo And Hide Bar</a>
<a href="#notjustfoo">Hide Foo And Show Bar</a>
```

# What This Is For

In a typical webapp, the URL loads a different page of HTML elements. But in a single page webapp, all elements live in the same page but only some are displayed at any one time. Vista makes it easy, even necessary, to keep that meaningful relationship between the URL and the elements that are displayed. After all, if you use the URL to control element display, you can't forget to update the URL. This means you always support the back button, deep linking, and bookmarks.

Vista lets you manage element display in a way that is simple, declarative, decoupled, and fast. Just add a vista="url-section-here" attribute to your element, and it will only be displayed when the URL has a section like that. Nothing else needed. If you want more complex URL tests, Vista lets you declare those in markup too. There's no manual display toggling, nor custom CSS, nor extra JavaScript to write. Vista works with frameworks or on its own. It has no dependencies, no known conflicts, and few constraints.

Try it out. In many cases, dynamic element display (unlike dynamic element content) is better managed in markup (which is display code, after all), without tight JavaScript coupling to routers, controllers, or renderers. With Vista, it's only between the URL and your <div>. This naturally and easily pushes workflow through the URL, enforcing good URL management, letting links be links and sticking to the declarative style that is natural to the web.

## Getting Started

Download the [production version][min] or the [development version][max]. [![Build Status](https://travis-ci.org/esha/vista.png?branch=master)](https://travis-ci.org/esha/vista)  
[Bower][bower]: `bower install vista`  
[NPM][npm]: `npm install vista`   
[Component][component]: `component install esha/vista`  

[min]: https://raw.github.com/esha/vista/master/dist/vista.min.js
[max]: https://raw.github.com/esha/vista/master/dist/vista.js
[npm]: https://npmjs.org/package/vista
[bower]: http://bower.io/
[component]: http://component.io/

## Documentation

### Defining Your Views

"Views" with Vista are defined by a name and a "test" for the current URL (optionally, a display style too). In many cases, that name and the test can be the same value, as in the quick example above. In other cases, you'll want a more complex URL test and need a simpler logical name.

#### Declarative Definition (best way):  

Basic version (element is visible under a URL like 'http://example.com/simple.html'):  
```html
<div vista="simple">...</div>
```  

Named test (visible under a URL like 'http://example.com?test_this=true'):  
```html
<meta itemprop="vista" define="name=test_this">
<div vista="name">...</div>
```  

Add a 2nd named, regexp test and a custom style:  
```html
<meta itemprop="vista" define="name=test_this grid=layout=grid" style="flex">
<div vista="grid">...</div><!-- 'display: flex', when URL like http://example.com?layout=grid&a=1 -->
<span vista="!name">...</span><!-- 'display: flex', when URL lacks a 'test_this' section -->
```  

As you can see, multiple definitions can share the same `<meta itemprop="vista">` element, as long as they are space-delimited.

It may be helpful to know that in the common case, where no custom display style is specified, the default style used is `initial` (with `block` as fallback for browsers that need it).  

Also, note that definitions never need to be declared next to the elements they are controlling.
Your `<meta itemprop="vista">` definitions can be placed anywhere. The `<head>` element is recommended.

#### Programmatic Definition (if you really must):  

The provided API is `Vista.define(name[, test[, style]])`. Here are some examples:

```javascript
// simple view, where the name and URL test value are the same
Vista.define('reports');

// view with full RegExp to test if URL's full hash equals a chart
Vista.define('hasChart', /#(pie|bar)$/);

// view with a custom test function to which the URL is passed and an alternate style
Vista.define('special', function(url) {
    // return a truthy value to pass the test or falsey to fail
    return url.indexOf('special') > 0 || localStorage.getItem('special');
}, 'inline-block');
```

Of course, only the last one actually must be done with JavaScript. Functions may not be defined as tests via markup at this time, though they may be supported (via reference) eventually.

Please note that when you define new tests programmatically, they are not automatically applied until the next time the location is updated. To force an immediate re-evaluation of all tests, call `Vista.update()`.

### Using Your Views

To show an element only when a test passes:  

`<button vista="nameOfTest">`

To show an element only when a test *fails*:

`<span vista="!nameOfTest">`

To show an element when *any* of several tests pass:

`<a vista="my_test myOtherTest">`

To show an element when *all* of several tests pass:

`<div vista="nameOfTest+my_test">`

The needed CSS rules are generated and applied automatically for you. Here's another small usage example:

```html
<body>
  <div vista="reports">
    Reports would go here, of course.
  </div>
  <!-- hide the submenu to make more room for the chart -->
  <div id="submenu" vista="!hasChart">
    Sub-menu is here...
  </div>
  ...
</body>
```

### Implementation

The names of each defined view are used to generate the needed CSS rules for controlling the display of related `[vista~="name"]` elements. All declarative URL tests are turned into regular expressions. If the declared test starts/ends with anything that looks like URL format chars (i.e. `./\?=&#`) or regexp start/end chars (`^` and `$`), then that end of the test is left as-is, otherwise, the end will be pre/postfixed with regexp to match those relevant chars. This is done to ensure that full URL section matches are the default (avoiding false positives like "color=reddish" when you only wanted "color=red"). The resulting regexps are tested against the current URL of the page at page load and any time that the location is updated. As shown above, if you are using `Vista.define(name, test[, style])`, the test parameter will directly accept a RegExp instance or Function. If, via either declarative or programmatic definition, the test is omitted, then the name itself is always used as the test expression. Most users will find this sufficient in the majority of uses.

Upon page load, location changes, or calls to `Vista.update()`, all tests are evaluated. For each one, a correlating `vista-name` attribute on the `<html>` element is toggled, according to whether the test returns a truthy or falsey value. 

### "Advanced" Features

Temporarily force a particular status (i.e. override the latest update):

`Vista.toggle(name[, active]);`

Test whether a particular status is active or not:

`Vista.active(name);`

Write your own CSS rules that use the "[vista-name]" attributes toggled on the document element as the location changes:

`html[vista-name] .my-thing { ... }`

## Release History
* 2014-04-10 [v0.1.0][] (first public release)
* 2014-04-11 [v0.1.1][] (test full location, add some documentation)
* 2014-04-16 [v0.2.0][] (flip toggle classes to vista-{name})
* 2014-04-24 [v0.2.1][] (watch replaceState calls)
* 2014-08-25 [v1.0.0][] (multiple <meta itemprop="vista" define="... instead of single <meta name="vista" content...)
* 2014-09-23 [v1.1.0][] (Vista.active(name), toggle fix)
* 2014-10-20 [v2.0.1][] (Use attributes instead of classes, add configurable display style, '=' now allowed in meta definitions)
* 2015-01-20 [v2.1.1][] (Support shortcut define-and-use syntax, add Vista.defined(name) method)
* 2016-06-23 [v3.0.0][] (Removed Vista.defined, support compound+definition+test syntax, update dev deps, misc refactoring)
* 2016-09-12 [v3.1.0][] (Match full URL sections by default, via smart pre/postfix of tests)

[v0.1.0]: https://github.com/esha/vista/tree/0.1.0
[v0.1.1]: https://github.com/esha/vista/tree/0.1.1
[v0.2.0]: https://github.com/esha/vista/tree/0.2.0
[v0.2.1]: https://github.com/esha/vista/tree/0.2.1
[v1.0.0]: https://github.com/esha/vista/tree/1.0.0
[v1.1.0]: https://github.com/esha/vista/tree/1.1.0
[v2.0.1]: https://github.com/esha/vista/tree/2.0.1
[v2.1.1]: https://github.com/esha/vista/tree/2.1.1
[v3.0.0]: https://github.com/esha/vista/tree/3.0.0
[v3.1.0]: https://github.com/esha/vista/tree/3.1.0
