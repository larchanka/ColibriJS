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
                            "<li><a href=\"#/presenter/<%=presenters[i].accountId%>\"><%=presenters[i].firstName%> <%=presenters[i].lastName%></a></li>" +
                            "<% } %></ul>";
                this.drawAppLoader();
                this.request('GET', 'http://evbyminsd8734.minsk.epam.com/bin/epamsec/presenters.json', function (data) {
                    
                    data.presenters = _global.sortByKey(data.presenters, 'firstName');
                    
                    _global.template(template, data);
                }, function () {
                    _global.ajaxErrorTemplate();
                });
            },
        
            presenter : function (id) {
                var template = "<h1>Presenter <%=presenter.firstName%> <%=presenter.lastName%></h1>" +
                            "<ul>" +
                            "<li>Position: <%=presenter.position%></li>" +
                            "<li>Description: <br /><%=presenter.description%></li>" +
                            "</ul>";
                this.drawAppLoader();
                this.request('GET', 'http://evbyminsd8734.minsk.epam.com/bin/epamsec/presenter.json?presenter=' + id, function (data) {
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