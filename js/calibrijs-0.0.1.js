/* SmallFramework */

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

var Calibrijs = (function (settings) {
    
    return (1, {
        settings : {
            routers : settings.routers || {},
            cache : settings.cache !== undefined ? settings.cache : true,
            rewriteObject : settings.rewriteObject !== undefined ? settings.rewriteObject : true,
            historyAPI : settings.historyAPI == 'auto' ? (typeof history.pushState != 'undefined' ? true : false) : settings.historyAPI
        },
        templatesCache : {},
        requestsCache : {},
        
        init : function () {
            global.CJS = this;
            _event = this.settings.historyAPI ? 'popstate' : 'hashchange';
            global.CJSOBJ = document.querySelector('[data-app="true"]') || document.body;
            
            if ('extends' in settings) {
                
                for (var callback in settings.extends) {
                    this[callback] = settings.extends[callback];
                }
            }
            
            if (this.settings.historyAPI) {  

                [].forEach.call( document.querySelectorAll('a'), function(el) {
                    el.removeEventListener("click", CJS.bindHistory, false);
                    el.addEventListener('click', CJS.bindHistory, false);
                });
                this.hashChangeEvent(document.location.pathname.replace(/^\//,''));
            } else {
                this.fixLinks();
                this.hashChangeEvent(document.location.hash ? document.location.hash.replace('#/','') : null);
            }
            
            window.addEventListener(_event, function () {
                return CJS.hashChangeEvent(CJS.settings.historyAPI ? document.location.pathname.replace(/^\//,'') : document.location.hash.replace('#/',''));
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
            
            if (this.settings.rewriteObject) {
                global.CJSOBJ.innerHTML = "Loading...";
            }
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
            global.CJSOBJ.innerHTML = data ? fn( data ) : fn;
            
            if (this.settings.historyAPI) {  
                              
                [].forEach.call( document.querySelectorAll('a'), function(el) {
                    el.removeEventListener("click", CJS.bindHistory, false);
                    el.addEventListener('click', CJS.bindHistory, false);
                });
            } else {
                this.fixLinks();
            }
        },
        
        /*
        * Bind links to work with history API
        * @param {ev} Generates automaticaly
        */
        bindHistory : function(ev) {
            history.pushState(null, null, this.getAttribute('href'));
            CJS.hashChangeEvent(document.location.pathname.replace(/^\//,''));
            ev.preventDefault();
        },
        
        /*
        * Fix links to work with hash
        */
        fixLinks : function () {
            [].forEach.call( document.querySelectorAll('a'), function(el) {
                var href = el.getAttribute('href');
                if (href.indexOf('/') == 0) {
                    el.setAttribute('href', '#'+href);
                }
            });
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
                
                if (CJS.settings.cache) {
                    CJS.requestsCache[url] = xhr.response;
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