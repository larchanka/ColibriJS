(function (window) {
    'use strict';
    
    // New app announcement 
    global.app = Colibrijs({
        
        // List of routes and callbacks
        routers : {
            "" : "home",S
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
                var template = "<h1>Home</h1>";
                this.template(template, {});
            },
        
            presenters : function () {
                var template = "<h1>Presenters</h1>" +
                            "<ul><% for (var i in presenters) { %>" +
                            "<li><a href=\"/presenter/<%=presenters[i].accountId%>\"><%=presenters[i].firstName%> <%=presenters[i].lastName%></a></li>" +
                            "<% } %></ul>";
                this.drawAppLoader();
                this.request('GET', '/mock_data/presenters.json', function (data) {
                    
                    CJS.template(template, {presenters: CJS.sortByKey(data.presenters, 'firstName')});
                }, function () {
                    CJS.ajaxErrorTemplate();
                });
            },
        
            presenter : function (id) {
                var template = "<h1>Presenter <%=presenter.firstName%> <%=presenter.lastName%></h1>" +
                            "<p>" +
                            "<br /><%=presenter.description%>" +
                            "</p>";
                this.drawAppLoader();
                this.request('GET', '/mock_data/' + id + '.json', function (data) {
                    CJS.template(template, data);
                }, function () {
                    CJS.ajaxErrorTemplate();
                });
            },
            
            
            // Method that is called after AJAX error
            ajaxErrorTemplate : function () {
                var template = "<h3>Ajax error occured!</h3>";
                this.template(template, {});
            }
        }
    }).init();
    
}).call(this, global);