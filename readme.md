This gist will ajaxify your website with the HTML5 History API using History.js and ScrollTo.


## Installation

``` html
<!-- jQuery --> 
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script> 
 
<!-- History.js --> 
<script defer src="http://github.com/balupton/history.js/raw/master/scripts/compressed/history.adapter.jquery.js"></script> 
<script defer src="http://github.com/balupton/history.js/raw/master/scripts/compressed/history.js"></script> 
<script defer src="http://github.com/balupton/jquery-scrollto/raw/master/scripts/jquery.scrollto.min.js"></script> 
<script defer src="http://gist.github.com/raw/854622/ajaxify-html5.js"></script> 
```


## Explanation

This will:

1. Load in jQuery
2. Load in the jQuery History.js Adapter
3. Load in [History.js](https://github.com/balupton/history.js)
4. Load in the [jQuery ScrollTo Plugin](https://github.com/balupton/jquery-scrollto) allowing our ajaxify gist to scroll nicely and smoothly to the new loaded in content
5. Load in this gist :-)


## Further Reading

- [The History.js Readme: Your guide to History.js](https://github.com/balupton/history.js)
- [Intelligent State Handling: The evolution from hashes, to hashbangs to the HTML5 History API](https://github.com/balupton/history.js/wiki/Intelligent-State-Handling)
- [The state of the HTML5 History API, why it isn't good enough and why we need History.js](https://github.com/balupton/history.js/wiki/The-State-of-the-HTML5-History-API)