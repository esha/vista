# Vista

Vista provides declarative, URL-driven control of element display. In a typical webapp, each URL loads a different page of HTML elements. In a single page webapp, all the HTML elements live in the same page but only some are displayed at any one time. Vista makes it easy to restore that meaningful relationship between the URL and the elements that are displayed. After all, a single-page application should still be updating the browser's location for each significant state change in the application (to allow the back button, bookmarking, deep-linking, etc). While this display control is usually a subtask of "routers" and "view controllers", such approaches bind the simple on/off of elements to more involved and/or encapsulated processes, creating a tight coupling of display and logic that is can be constraining in the best cases and often is simply unnecessary. Sometimes it is cleaner to leave control of HTML to your HTML, even in a single page app.

Vista enables you to manage element display in a way that is simple, declarative, decoupled, and fast. Just add a `vista="part-of-url-here"` attribute to your element, and it will only be displayed when the URL matches. Nothing else needed. Of course, if you want more complex URL tests, Vista also provides easy ways to declare those in your markup too. There are no concerns about view heirarchy/containers/renderers/lifecycles. No manual display toggling. No extra CSS or JavaScript to write. There are no routers or event listeners to configure. You can use Vista with your routers or view renderers or on its own. It has no dependencies, no known conflicts, and few constraints.

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
<p vista="foo">Foo</p><!-- hidden while location.href.match('foo') === null -->
<p vista="!foo">Bar</p><!-- visible while location.href.match('foo') === null -->
<a href="#shows_foo">Show Foo And Hide Bar</a>
<a href="#anythingelse">Hide Foo And Show Bar</a>
```


### Defining Your Views

"Views" with Vista are defined by a name and a "URL test" for the current `location.href` (optionally, a display style too). In many cases, that name and the test can be the same value, as in the quick example above. In other cases, you'll want a more complex URL test and need a simpler logical name.

#### Declarative Definition (best way):  

Basic version (element is visible if current URL has 'simple' in it):  
```html
<div vista="simple">...</div>
```  

Named test (visible if current URL has 'test' in it):  
```html
<meta itemprop="vista" define="name=test">
<div vista="name">...</div>
```  

A 2nd named, regexp test and a custom style:  
```html
<meta itemprop="vista" define="name=test grid=(\\?|&)layout=grid" style="flex">
<div vista="grid">...</div><!-- 'display: flex', if URL has specific query param -->
<span vista="!name">...</span><!-- 'display: flex', if URL doesn't have 'test' in it -->
```  

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

To show an element only when a test fails:

`<span vista="!nameOfTest">`

To show an element when any of several tests pass:

`<a vista="my_test myOtherTest">`

To show an element when all of several tests pass:

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

The names of each defined view are used to generate the needed CSS rules for controlling the display of related `[vista~="name"]` elements. All declarative URL tests are turned into regular expressions to be tested against the current URL of the page at initialization and any time that the location is updated. As shown above, if you are using `Vista.define(name, test[, style])`, the test parameter will accept a RegExp instance or Function. If, via either declarative or programmatic definition, the test is omitted, then the name itself is always used as the test expression. Most users will find this sufficient in the majority of uses.

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

[v0.1.0]: https://github.com/esha/vista/tree/0.1.0
[v0.1.1]: https://github.com/esha/vista/tree/0.1.1
[v0.2.0]: https://github.com/esha/vista/tree/0.2.0
[v0.2.1]: https://github.com/esha/vista/tree/0.2.1
[v1.0.0]: https://github.com/esha/vista/tree/1.0.0
[v1.1.0]: https://github.com/esha/vista/tree/1.1.0
[v2.0.1]: https://github.com/esha/vista/tree/2.0.1
[v2.1.1]: https://github.com/esha/vista/tree/2.1.1
[v3.0.0]: https://github.com/esha/vista/tree/3.0.0
