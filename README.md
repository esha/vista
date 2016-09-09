# Vista

Vista gives you automatic, declarative, URL-based control of element display. In a typical web site, each URL loads a different set of HTML elements for display. In a single page webapp, all the HTML lives under one URL. Vista makes it easy to maintain a meaningful relationship between the URL and the elements that are displayed. After all, a single-page application should still be updating the browser's location for each significant state change in the application (to allow the back button, bookmarking, deep-linking, etc). While this display control is usually a subtask of "routers" and "view controllers", such approaches bind the simple on/off of elements to more involved and/or encapsulated processes, creating a tight coupling of display and logic that is sometimes complex, opaque, and/or limiting.

Vista makes managing the active "view" simple, declarative, decoupled, and very fast. You add the `vista` attribute to your elements and optionally define a few URL tests (which you can also declare in your markup). No concerns about view heirarchy/containers/renderers. No manual display toggling. No extra CSS to write. No routers or event listeners to configure. You can use it with your routers or view renderers or without them. No dependencies. No conflicts. No constraints.

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

### A Quick Example

```html
<p vista="foo">Foo</p><!-- hidden until location.href.match('foo') !== null -->
<p vista="!foo">Bar</p><!-- visible while location.href.match('foo') === null -->
<a href="#shows_foo">Show Foo And Hide Bar</a>
<a href="#anythingelse">Hide Foo And Show Bar</a>
```


### Defining Your Views

"Views" with Vista are simply an association between a name, a "URL test" for the current `location.href`, and optionally, a display style to be used. In many cases, the logical name and the test can be the same value, as in the quick example above. In other cases, you'll want a simpler name or a more complex URL test.

#### Declarative Definition (best way):  

Basic version (looks for `location.href.match('shortcut')`):  
```html
<div vista="shortcut">...</div>
```  

Named test (looks for `location.href.match('test')`):  
```html
<meta itemprop="vista" define="name=test">
<div vista="name">...</div>
```  

A 2nd named, regexp test and a custom style (2nd one looks for specific query param):  
```html
<meta itemprop="vista" define="name=test grid=(\\?|&)layout=grid" style="flex">
<span vista="name2">...</span><div vista="grid">...</div>
```  

The last one allows you to also specify the display style value to be used,
where the default of `initial` (with `block` as fallback) is not desired.  

Named definitions do not need to be declared next to the elements they are controlling.

#### Programmatic Definition (if you really must):  

`Vista.define(name[, test[, style]])`  

The name will be used to generate the pertinent CSS display styles. The URL test will be turned into a regular expression that is tested against the current URL of the page. Or, if you are using `Vista.define(name, test)`, the test may be a RegExp instance or Function. If, via either definition method, the test is omitted, then the name itself will be used as the test expression (which is often sufficient). Here are some definition examples in JavaScript:

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

### Using Your Views

To show an element only when a test passes:  

`<button vista="nameOfTest">`

To show an element only when a test fails:

`<span vista="!nameOfTest">`

To show an element when any of several tests pass:

`<a vista="a_test anotherTest">`

To show an element when all of several tests pass:

`<div vista="nameOfTest+a_test">`

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

### "Advanced" Use

To force immediate evaluation of all test statuses (i.e. after you define new ones, but before a url change):

`Vista.update();`

To temporarily force a particular status (i.e. override the latest update):

`Vista.toggle(name[, active]);`

To test whether a particular status is active or not:

`Vista.active(name);`

Write CSS rules that use the "[vista-name]" attributes toggled on the document body as the location changes:

`[vista-name] .my-thing { ... }`

## Release History
* 2014-04-10 [v0.1.0][] (first public release)
* 2014-04-11 [v0.1.1][] (test full location, add some documentation)
* 2014-04-16 [v0.2.0][] (flip toggle classes to vista-{name})
* 2014-04-24 [v0.2.1][] (watch replaceState calls)
* 2014-08-25 [v1.0.0][] (multiple <meta itemprop="vista" define="... instead of single <meta name="vista" content...)
* 2014-09-23 [v1.1.0][] (Vista.active(name), toggle fix)
* 2014-10-20 [v2.0.1][] (Use attributes instead of classes, add configurable display style, '=' now allowed in meta definitions)
* 2015-01-20 [v2.1.1][] (Support shortcut define-and-use syntax, add Vista.defined(name) method)
* 2016-06-23 [v3.0.0][] (Removed Vista.defined, support, compound definition-test syntax, update dev deps, misc refactoring)

[v0.1.0]: https://github.com/esha/vista/tree/0.1.0
[v0.1.1]: https://github.com/esha/vista/tree/0.1.1
[v0.2.0]: https://github.com/esha/vista/tree/0.2.0
[v0.2.1]: https://github.com/esha/vista/tree/0.2.1
[v1.0.0]: https://github.com/esha/vista/tree/1.0.0
[v1.1.0]: https://github.com/esha/vista/tree/1.1.0
[v2.0.1]: https://github.com/esha/vista/tree/2.0.1
[v2.1.1]: https://github.com/esha/vista/tree/2.1.1
[v3.0.0]: https://github.com/esha/vista/tree/3.0.0
