/*
* Global object factory
* It returns global `global` object with all properties of `window`
*/
var global = (function () {
    return this || (1, eval)('this');
}());

if (!global.hasOwnProperty('console')) {
    global.console = {
        log : function (text) {
            return false;
        },
        dir : function (obj) {
            return false;
        }
    };
}

var SmallFramework = global.SmallFramework = (function (settings) {
    
    return (1, {
        settings : {
            routers : settings.routers || {},
            cache : settings.cache !== undefined ? settings.cache : true,
            historyAPI : settings.historyAPI ? settings.historyAPI : false
        },
        templatesCache : {},
        requestsCache : {},
        
        init : function () {
            global._global = this;
            _event = this.settings.historyAPI ? 'popstate' : 'hashchange';
            global.OBJ = document.querySelector('[data-app="true"]') || document.body;
            
            if ('extends' in settings) {
                
                for (var callback in settings.extends) {
                    this[callback] = settings.extends[callback];
                }
            }
            
            if (this.settings.historyAPI) {  
                              
                [].forEach.call( document.querySelectorAll('a'), function(el) {
                    el.addEventListener('click', function(ev) {
                        history.pushState(null, null, el.getAttribute('href'));
                        _global.hashChangeEvent(document.location.pathname.replace(/^\//,''));
                        ev.preventDefault();
                    }, false);
                });
            } else {
                
                [].forEach.call( document.querySelectorAll('a'), function(el) {
                    var href = el.getAttribute('href');
                    if (href.indexOf('/') == 0) {
                        el.setAttribute('href', '#'+href);
                    }
                });
                this.hashChangeEvent(document.location.hash ? document.location.hash.replace('#/','') : null);
            }
            
            window.addEventListener(_event, function () {
                return _global.hashChangeEvent(_global.settings.historyAPI ? document.location.pathname.replace(/^\//,'') : document.location.hash.replace('#/',''));
            }, false);
        },
        
        hashChangeEvent : function (route) {
            var locationRow = route ? route.split('/') : [];
            
            if (locationRow[1] && locationRow[1].match(/^\d{0,}$/g)) {
                locationRow[1] = parseInt(locationRow[1]);
            }
            this[this.findRouter(locationRow[0])](locationRow[1] ? locationRow[1] : null);
            return false;
        },
        
        findRouter : function (query) {
            var routerRow = [];
            
            for (var route in this.settings.routers) {
                routerRow = route.split('/');
                if (routerRow[0] == query) {
                    return this.settings.routers[route];
                }
            }
            return this.settings.routers[''];
        },
        
        drawAppLoader : function () {
            global.OBJ.innerHTML = "Loading...";
        },
        
        /*
        * Sorting method
        * @param {array} Array to sort
        * @param {key} Key to sort with
        * @param {dir} Direction of sorting: asc - a-z0-9, desc - z-a9-0
        */
        sortByKey : function (array, key, dir) {
            dir = dir || 'asc'
            return array.sort(function(a, b) {
                var x = a[key];
                var y = b[key];

                if (typeof x == "string") {
                    x = x.toLowerCase(); 
                    y = y.toLowerCase();
                }
                
                if (dir == 'desc') {
                    return ((x < y) ? 1 : ((x > y) ? -1 : 0));
                } else {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }
            });
        },
        
        /*
        * Template engine
        * Based on John Resig's JavaScript Micro-Templating
        * http://ejohn.org/blog/javascript-micro-templating/
        * @param {str} Template
        * @param {data} Data object
        */
        template : function tmpl(str, data) {            
            var fn = !/\W/.test(str) ?
            this.templatesCache[str] = this.templatesCache[str] ||
            tmpl(document.getElementById(str).innerHTML) : new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
            "with(obj){p.push('" +
            str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'")
            + "');}return p.join('');");
            global.OBJ.innerHTML = data ? fn( data ) : fn;
        },
        
        /*
        * Ajax requests
        * Method creates connection and returns JSON (supports only JSON's API)
        * @param {type} Method: POST or GET
        * @param {url} Address for request
        * @param {opts} Data to send if POST
        * @param {callback} Success function
        * @param {errorcallback} Error function
        */
        request : function (type, url, opts, callback, errorcallback) {

            if (typeof opts === 'function') {
                errorcallback = callback;
                callback = opts;
                opts = null;
            }
            
            if (this.settings.cache && this.requestsCache[url]) {
                callback(JSON.parse(this.requestsCache[url]));
                return;
            }
            
            var xhr = 'XDomainRequest' in global ? new XDomainRequest : new XMLHttpRequest(), fd;
            xhr.open(type, url);

            if (type === 'POST' && opts) {
                fd = new FormData();

                for (var key in opts) {
                    fd.append(key, JSON.stringify(opts[key]));
                }
            }

            xhr.onload = function () {
                
                if (_global.settings.cache) {
                    _global.requestsCache[url] = xhr.response;
                }
                callback(JSON.parse(xhr.responseText));
            };
            
            xhr.onerror = function () {
                errorcallback(xhr.response);
            }

            xhr.send(opts ? fd : null);
        }
    });
});