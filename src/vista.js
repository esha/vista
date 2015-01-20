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
    html = document.documentElement,
    _ = {
        version: '<%= pkg.version %>',
        define: function(name, test, style) {
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
            _.style.textContent += _.rules(name, style);
        },
        rules: function(name, style) {
            return '[vista~="'+name+'"],\n'+
                   '[vista-'+name+'] [vista~="!'+name+'"] {\n'+
                   '  display: none !important;\n'+
                   '}\n'+
                   '[vista-'+name+'] [vista~="'+name+'"] {\n'+
                   '  display: block !important;\n'+
                   '  display: '+(style||'initial')+' !important;\n'+
                   '}\n';
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
        defined: function(name) {
            if (_._list) {
                for (var i=0; i<_._list.length; i++) {
                    if (_._list[i].name === name) {
                        return true;
                    }
                }
            }
            return false;
        },
        active: function(name) {
            return html.hasAttribute('vista-'+name);
        },
        toggle: function(name, active) {
            active = active === undefined ? !_.active(name) : active;
            html[active ? 'setAttribute' : 'removeAttribute']('vista-'+name, 'active');
        },
        config: function() {
            var meta = document.querySelectorAll('meta[itemprop=vista]');
            for (var i=0,m=meta.length; i<m; i++) {
                var el = meta[i],
                    definitions = (el.getAttribute('define')||'').split(' '),
                    style = el.getAttribute('style');
                for (var j=0,n=definitions.length; j<n; j++) {
                    var definition = definitions[j],
                        eq = definition.indexOf('=');
                    if (eq > 0) {
                        _.define(definition.substring(0, eq), definition.substring(eq+1), style);
                    } else {
                        _.define(definition, undefined, style);
                    }
                }
                el.setAttribute('itemprop', definitions.length ? 'vista-done' : 'vista-fail');
            }
            var uses = document.querySelectorAll('[vista]');
            for (var k=0; k<uses.length; k++) {
                var use = uses[k].getAttribute('vista').split(' ');
                for (var l=0; l<use.length; l++) {
                    var name = use[l];
                    if (name.charAt(0) === '!') {
                        name = name.substring(1);
                    }
                    if (!_.defined(name)) {
                        _.define(name);
                    }
                }
            }
            if (meta.length || uses.length) {
                _.update();
            }
        }
    };

    _.config();
    document.addEventListener('DOMContentLoaded', _.config);

    // export Vista (AMD, commonjs, or window)
    var define = window.define || function(){};
    define((window.exports||window).Vista = _);

})(window, document, window.location, window.history);
