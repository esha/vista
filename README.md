# Vista

Vista gives you automatic, responsive control of element display via the current location.

If you are developing a single-page application (of any degree of complexity), you are (or should be) updating the browser's location bar  when there is a significant state change in the application (to allow the back button, bookmarking, deep-linking, etc). Such updates typically involve the showing or hiding of one or many elements.
This activity is typically a subtask of fancy "routers" and "view managers" or even custom elements that hide/show themselves, often abstracting or encapsulating the simple on/off of elements unnecessarily and sometimes, obnoxiously.

Vista keeps it simple. One little library to apply tests to the location when it changes and toggle the associated classes accordingly. You just declare the tests (`<meta name="vista" content="name=regexp"/>` or `Vista.define(name, regExpOrFn)`) and stick `show-{name}` or `hide-{name}` classes on your elements. Everything else is handled automatically. No concerns about view/element heirarchy or containers. No manual visibility toggling. No CSS rules to write. No routers or event listeners to configure. You can use it with your routers or view renderers or without them. No dependencies. No conflicts. See below for the documentation, if you even need it. :)

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

`<meta name="vista" content="name=test otherName=otherTest nameAsTest">`  

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
  <meta name="vista" content="reports hasChart=#(pie|bar|line) query=\?q=.+"/>
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

### Advanced

To force immediate evaluation of all test statuses (i.e. after you define new ones, but before a url change):

`Vista.update();`

To temporarily force a particular status (i.e. override the latest update):

`Vista.toggle(name[, active]);`

To add additional elements that should be `display: inline-block;` instead of `display: block;`:

`Vista.inline.push('x-inline-element');`

Note that this last one will only affect *subsequent* definitions.

## Release History
* 2014-04-10 [v0.1.0][] (first public release)
* 2014-04-11 [v0.1.1][] (test full location, add some documentation)

[v0.1.0]: https://github.com/esha/vista/tree/0.1.0
[v0.1.1]: https://github.com/esha/vista/tree/0.1.1
