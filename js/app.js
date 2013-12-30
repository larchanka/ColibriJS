(function (window) {
    'use strict';
    
    // New app announcement 
    global.app = Colibrijs({
        
        // List of routes and callbacks
        routers : {
            "" : "home",
            "presenters" : "presenters",
            "presenter/:id" : "presenter"
        },
        
        // History API state
        // true | false | 'auto'
        historyAPI : 'auto',
        rewriteObject : true,
        
        // Extensions
        // All method are available in `this` object (global.CJS or CJS)
        extends : {
            
            // Callbacks for routes
            home : function () {
                var template = CJS.getTemplate('tplHome');
                this.template(template, {});
            },
        
            presenters : function () {
                var template = CJS.getTemplate('tplPresenters');
                this.drawAppLoader();
                this.request('GET', '/mock_data/presenters.json', function (data) {
                    
                    CJS.template(template, {presenters: CJS.sortByKey(data.presenters, 'firstName')});
                }, function () {
                    CJS.ajaxErrorTemplate();
                });
            },
        
            presenter : function (id) {
                var template = CJS.getTemplate('tplPresenter');
                this.drawAppLoader();
                this.request('GET', '/mock_data/' + id + '.json', function (data) {
                    CJS.template(template, data);
                }, function () {
                    CJS.ajaxErrorTemplate();
                });
            },
            
            
            // Method is called after AJAX error
            ajaxErrorTemplate : function () {
                var template = "<h3>Ajax error occured!</h3>";
                this.template(template, {});
            }
        }
    }).init();
    
}).call(this, global);