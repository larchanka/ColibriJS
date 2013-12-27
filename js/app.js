(function (window) {
    'use strict';
    
    global.app = SmallFramework({
        routers : {
            "" : "home",
            "presenters" : "presenters",
            "presenter/:id" : "presenter"
        },
        historyAPI : false,
        
        extends : {
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
                    
                    _global.template(template, {presenters: _global.sortByKey(data.presenters, 'firstName')});
                }, function () {
                    _global.ajaxErrorTemplate();
                });
            },
        
            presenter : function (id) {
                var template = "<h1>Presenter <%=presenter.firstName%> <%=presenter.lastName%></h1>" +
                            "<p>" +
                            "<br /><%=presenter.description%>" +
                            "</p>";
                this.drawAppLoader();
                this.request('GET', '/mock_data/' + id + '.json', function (data) {
                    _global.template(template, data);
                }, function () {
                    _global.ajaxErrorTemplate();
                });
            },
            
            ajaxErrorTemplate : function () {
                var template = "<h3>Ajax error occured!</h3>";
                this.template(template, {});
            }
        }
    }).init();
    
}).call(this, global);