# Vista

Vista gives you automatic, declarative, location-based control of element display.

If you are developing a single-page application (of any degree of complexity), you should be updating the browser's location for each significant state change in the application (to allow the back button, bookmarking, deep-linking, etc). This generally coincides with showing and hiding of page elements, usually a subtask of "routers" and "view managers". Such approaches needlessly bind the simple on/off of elements to more involved and/or encapsulated processes, creating a tight coupling of display and logic that is sometimes complex, opaque, and/or limiting.

Vista makes "view management" simple, declarative, and decoupled. You need only define the tests (`<meta itemprop="vista" define="name=regexp"/>` or `Vista.define(name, regExpOrFn)`) and stick `show-{name}` or `hide-{name}` classes on your elements. No concerns about view heirarchy/containers/renderers. No manual display toggling. No extra CSS to write. No routers or event listeners to configure. You can use it with your routers or view renderers or without them. No dependencies. No conflicts. No constraints.

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

### Define

Declarative (best way):  

`<meta itemprop="vista" define="name=test otherName=otherTest nameAsTest">`  

Programmatic (when you need to):  

`Vista.define(name[, test])`  

The name will be used to generate the pertinent CSS display styles. The test will be turned into a regular expression that is tested against the current URL of the page. Or, if you are using `Vista.define(name, test)`, the test may be a RegExp instance or Function. If, via either definition method, the test is omitted, then the name itself will be used as the test expression (which is often sufficient). Here are some definition examples:

```javascript
Vista.define('reports');
Vista.define('hasChart', /#.*(pie|bar|line)/);
Vista.define('special', function(url) {
    // return a truthy value to pass the test or falsey to fail
    return url.indexOf('special=true') > 0 || user.settings('special');
});
```

```html
<head>
  <meta itemprop="vista" define="reports hasChart=#(pie|bar|line) query=\?q=.+"/>
  <script src="../bower_components/vista/dist/vista.min.js"></script>
</head>
...
```

### Use

To show an element only when the test passes:  

`class="show-{name}"`

or hide an element only when a test passes:

`class="hide-{name}"`

The needed CSS rules are generated and applied automatically for you. Here are some usage examples:

```html
<body>
  <div class="show-reports">
    Reports would go here, of course.
  </div>
  <!-- hide the submenu to make more room for the chart -->
  <div id="submenu" class="hide-hasChart">
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

To add additional elements that should be `display: inline-block;` instead of `display: block;` for *subsequent* definitions:

`Vista.inline.push('x-inline-element');`

Write CSS rules that use the ".vista-{name}" classes toggled on the document body as the location changes:

`.vista-{name} .my-thing { ... }`

## Release History
* 2014-04-10 [v0.1.0][] (first public release)
* 2014-04-11 [v0.1.1][] (test full location, add some documentation)
* 2014-04-16 [v0.2.0][] (flip toggle classes to vista-{name})
* 2014-04-24 [v0.2.1][] (watch replaceState calls)
* 2014-08-25 [v1.0.0][] (multiple <meta itemprop="vista" define="... instead of single <meta name="vista" content...)
* 2014-09-23 [v1.1.0][] (Vista.active(name), toggle fix)

[v0.1.0]: https://github.com/esha/vista/tree/0.1.0
[v0.1.1]: https://github.com/esha/vista/tree/0.1.1
[v0.2.0]: https://github.com/esha/vista/tree/0.2.0
[v0.2.1]: https://github.com/esha/vista/tree/0.2.1
[v1.0.0]: https://github.com/esha/vista/tree/1.0.0
[v1.1.0]: https://github.com/esha/vista/tree/1.1.0
