(function(window, document, location, history) {
    'use strict';

    var init = function(_) {
        init = false;

        _.tests = {};
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
    bounds = '^./\\?=&#$'.split(''),
    _ = {
        version: '<%= pkg.version %>',
        isBoundary: function(char) {
            return bounds.indexOf(char) >= 0;
        },
        define: function(name, test, style) {
            if (init) {
                init(_);
            }
            var source = test;
            switch (typeof test) {
                case "undefined":
                    test = name;
                    /* falls through */
                case "string":
                    if (!_.isBoundary(test.charAt(0))) {
                        test = '(^|/|\\?|=|&|#)' + test;
                    }
                    if (!_.isBoundary(test.charAt(test.length - 1))) {
                        test += '($|/|\\?|=|&|#|\.)';
                    }
                    try {
                        source = { initial: source, actual: test };
                        test = new RegExp(test);
                    } catch (e) {
                        test = function() {
                            window.console.error('Invalid Vista definition: ', name, source, e);
                        };
                        break;
                    }
                    /* falls through */
                case "object":
                    test = test.test.bind(test);// haha!
                    test.source = source;
            }
            _.tests[name] = test;
            _.style.textContent += _._rules(name, style);
        },
        update: function() {
            var url = location+'',
                start = true;
            for (var name in _.tests) {
                var show = _.tests[name](url);
                _.toggle(name, show);
                if (show) {
                    start = false;
                }
            }
            _.toggle('start', start);
        },
        active: function(name) {
            name = _._clean(name);
            var not = _._not(name),
                hasAttr = html.hasAttribute('vista-'+(not||name));
            return (hasAttr && !not) || (!hasAttr && !!not);
        },
        toggle: function(name, active) {
            name = _._clean(name);
            active = active === undefined ? !_.active(name) : active;
            html[active ? 'setAttribute' : 'removeAttribute']('vista-'+name, 'active');
        },

        _clean: function(name) {
            return name.indexOf('+') > 0 ?
                name.replace(/\+|\!/g, '_') :
                name;
        },
        _not: function(name) {
            return name.charAt(0) === '!' && name.substring(1);
        },
        _rules: function(name, style) {
            var attr = _._clean(name);
            return '[vista~="'+name+'"],\n'+
                   '[vista-'+attr+'] [vista~="!'+name+'"] {\n'+
                   '  display: none !important;\n'+
                   '}\n'+
                   '[vista-'+attr+'] [vista~="'+name+'"] {\n'+
                   '  display: block !important;\n'+
                   '  display: '+(style||'initial')+' !important;\n'+
                   '}\n';
        },
        _config: function() {
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
                _._ensure(uses[k].getAttribute('vista').split(' '));
            }
            if (meta.length || uses.length) {
                _.update();
            }
        },
        _ensure: function(names) {
            for (var i=0; i<names.length; i++) {
                var name = names[i],
                    test = name;
                if (name.indexOf('+') > 0) {
                    var subnames = name.split('+');
                    _._ensure(subnames);
                    test = _._and(subnames);
                } else {
                    name = _._not(name) || name;
                    test = name;
                }
                if (!_.tests.hasOwnProperty(name)) {
                    _.define(name, test);
                }
            }
        },
        _and: function(names) {
            return function and(url) {
                for (var j=0; j<names.length; j++) {
                    var name = names[j],
                        not = name.charAt(0) === '!';
                    if (not) {
                        name = name.substring(1);
                    }
                    var passed = _.tests[name](url);
                    if ((passed && not) || (!passed && !not)) {
                        return false;
                    }
                }
                return true;
            };
        }
    };

    _._config();
    document.addEventListener('DOMContentLoaded', _._config);

    // export Vista (AMD, commonjs, or window)
    var define = window.define || function(){};
    define((window.exports||window).Vista = _);

})(window, document, window.location, window.history);
