# Vista

Really easy, CSS-based, location-driven display control for your elements.

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

Programatic:  

`Vista.define(name[, test])`  

or declarative:  

`<meta name="vista" content="{name}={test}">`  

The name will be used to generate the CSS display rules. The test will be turned into a regular expression that is tested against the current URL of the page. Or, if you are using `Vista.define(name, test)`, the test may be a RegExp instance or Function. If, via either definition method, the test is omitted, then the name itself will be used as the test expression (which is often sufficient). Here are some definition examples:

```javascript
Vista.define('reports');
Vista.define('hasChart', /#.*(pie|bar|line)/);
Vista.define('special', function(url) {
    // here you can 
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

`class="view-{name}"`

or hide an element only when a test passes:

`class="hide-{name}"`

The needed CSS rules are generated and applied automatically for you. There's nothing else you need to do. Just name and define a few tests, then apply a few classes. Whenever your location changes, your view will update automatically according to the tests and classes you have set. Here are some usage examples:

```html
<body>
  <div class="view-reports">
    Reports would go here, of course.
  </div>
  <!-- hide the submenu to make more room for the chart -->
  <div id="submenu" class="hide-hasChart">
    Sub-menu is here...
  </div>
  ...
</body>
```

## Release History
* 2014-04-10 [v0.1.0][] (first public release)

[v0.1.0]: https://github.com/esha/vista/tree/0.1.0
