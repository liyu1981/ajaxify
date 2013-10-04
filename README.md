Copyright Info
=======================

Ajaxify
v1.0.1 - 30 September, 2012
https://github.com/browserstate/ajaxify

Adapted by LI, Yu (liyu@clustertech.com)

Dependency
==========

* jquery.js
* underscore.js

Build in lib
============

(check versions in the lib dir)

* jquery.history.js
* jquery-scorllto.js

Usage
=====

normally:

```html
    <script src="jquery.min.js"></script>
    <script src="underscore-min.js"></script>
    <script>
      var ctAjaxify = {
        options: {
          // ...options...
        }
      };
    </script>
    <script src="ctAjaxify.min.js"></script>
    // now you can bind events like
    //   window.ctAjaxify.on(<event>, function() { ... });
```

if you want to disable this, just

```html
    <html disableAjaxify>
```

Events
======

Bind events as 

```javascript
   window.ctAjaxify.on('event', func)
```

Event lists

* ajaxifyLoadingBegin
* ajaxifyAjaxBeforeSend
    param: [jqXHR, settings]
* ajaxifyBeforeUpdateContent
    param: [contentHtml]
* ajaxifyAfterUpdateContent
* ajaxifyBeforeInsertScript
    param: [$newScriptNode, $originScriptNode]
* ajaxifyLoadingEnd
* ajaxifyStateChangeComplete
* ajaxifyAjaxError
    param: [jqXHR, textStatus, errorThrown]

