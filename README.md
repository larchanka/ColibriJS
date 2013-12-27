SmallFramework
===

About
---

**SmallFramework** is javascript library for building simple client-side web applications. It has no any dependencies and uses [pure javascript](http://pure-javascript.org/) to work.

How to start?
---

View `index.html` and `js/app.js` for example.
You need some server to be installed. Node.js server:

* install [Node.js](http://nodejs.org/)
* enter `npm install -g nws` in Terminal / Console / CMD
* enter `cd PATH/TO/FOLDER/WITH/SMALLFRAMEWORK && nws` in Terminal / Console / CMD
* open [`http://localhost:3030/`](http://localhost:3030/) in your browser

HTML5 pushstate (history) server-side support
---

Apache server:

```
<ifModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !index
    RewriteRule (.*) index.html [L]
</ifModule>
```

Nginx server:

```
location  index {
}

location / {
  if (!-e $request_filename){
    rewrite ^(.*)$ /index.html break;
  }
}
```

Jetty:

```
<Configure id="Server" class="org.eclipse.jetty.server.Server">

    <New id="Rewrite" class="org.eclipse.jetty.rewrite.handler.RewriteHandler">
      <Set name="rewriteRequestURI">true</Set>
      <Set name="rewritePathInfo">false</Set>
      <Set name="originalPathAttribute">requestedPath</Set>
      
      <!-- Write all rules for your URLs -->
      <Call name="addRule">
        <Arg>
          <New class="org.eclipse.jetty.rewrite.handler.RewriteRegexRule">
            <Set name="regex">/presenter/(.*)</Set>
            <Set name="replacement">/index.html</Set>
          </New>
        </Arg>
      </Call>
      
    </New>
    
    <Set name="handler"><Ref id="Rewrite" /></Set>
</Configure>
```

Browser support
---

* IE 9+
* FF 3.5 +
* Chrome
* Opera 11+
* Safari 4+

Licence
---

Code licensed under the [The MIT License](http://opensource.org/licenses/MIT).

Links
---

* [Pure JavaScript](http://pure-javascript.com)
* [Twitter](https://twitter.com/pure_javascript)




[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/larchanka/smallframework/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

