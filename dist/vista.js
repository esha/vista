/*! Vista - v0.2.0 - 2014-04-24
* https://github.com/esha/vista
* Copyright (c) 2014 ESHA Research; Licensed MIT */
(function(window, document, location, history) {
    'use strict';

    var init = function() {
        init = false;

        _._list = [];

        _.style = document.createElement('style');
        document.head.appendChild(_.style);

        window.addEventListener('hashchange', _.update);
        window.addEventListener('popstate', _.update);
        var intercept = function(name) {
            var fn = _['_'+name] = history[name];
            history[name] = function() {
                var ret = fn.apply(this, arguments);
                _.update();
                return ret;
            };
        };
        intercept('pushState');
        intercept('replaceState');

        _.define('start');
        _.update();
    },
    _ = {
        version: '0.2.0',
        define: function(name, test) {
            if (init) {
                init();
            }
            switch (typeof test) {
                case "undefined":
                    test = name;
                    /* falls through */
                case "string":
                    test = new RegExp(test);
                    /* falls through */
                case "object":
                    test = test.test.bind(test);// haha!
            }
            _._list.push({ name: name, test: test });
            _.style.innerHTML += _.rules(name);
        },
        inline: 'span a input button select label img'.split(' '),
        rules: function(name) {
            return '.show-'+name+
                 ', .vista-'+name+' .hide-'+name+' { display: none !important; }\n'+
                   '.vista-'+name+' .show-'+name+' { display: block !important; }\n'+
                   '.vista-'+name+' '+_.inline.join('.show-'+name+
                 ', .vista-'+name+' ')+'.show-'+name+' { display: inline-block !important; }\n';
        },
        update: function() {
            var url = location+'',
                start = true;
            _._list.forEach(function(vista) {
                var show = vista.test(url);
                _.toggle(vista.name, show);
                if (show) {
                    start = false;
                }
            });
            _.toggle('start', start);
        },
        toggle: function(name, active) {
            document.documentElement.classList[active ? 'add' : 'remove']('vista-'+name);
        }
    };

    var meta = document.querySelector('meta[name=vista]');
    if (meta) {
        var definitions = meta.getAttribute('content') || '';
        definitions.split(' ').forEach(function(definition) {
            _.define.apply(_, definition.split('='));
        });
        _.update();
    }

    // export Vista (AMD, commonjs, or window)
    var define = window.define || function(){};
    define((window.exports||window).Vista = _);

})(window, document, window.location, window.history);
