/*! Vista - v0.1.0 - 2014-04-11
* https://github.com/esha/vista
* Copyright (c) 2014 ESHA Research; Licensed MIT */
(function(window, document, location, Eventi) {
    'use strict';

    var init = function Vista() {
        init = false;
        _._list = [];
        _.style = document.createElement('style');
        document.head.appendChild(_.style);
        Eventi.on(_, 'location', _.update);
        _.define('start');
    },
    _ = {
        version: '<%= pkg.version %>',
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
                 ', .'+name+'-vista .hide-'+name+' { display: none !important; }\n'+
                   '.'+name+'-vista .show-'+name+' { display: block !important; }\n'+
                   '.'+name+'-vista '+_.inline.join('.show-'+name+
                 ', .'+name+'-vista ')+'.show-'+name+' { display: inline-block !important; }\n';
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
            document.documentElement.classList[active ? 'add' : 'remove'](name+'-vista');
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

})(window, document, window.location, window.Eventi || {
    on: function(o,t, fn) {
        var w = window, h = w.history;
        w.addEventListener('hashchange', fn);
        w.addEventListener('popstate', fn);
        h._pushState = h.pushState;
        h.pushState = function() {
            var ret = h._pushState.apply(this, arguments);
            fn();
            return ret;
        };
        fn();
    }
});
