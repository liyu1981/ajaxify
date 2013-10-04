/*
  Original Copyright Info
  =======================
     Ajaxify
     v1.0.1 - 30 September, 2012
     https://github.com/browserstate/ajaxify

  Adapted by LI, Yu (liyu@clustertech.com)
*/
;(function($, _) {

	var History = window.History,
		  document = window.document;

	// Check to see if History.js is enabled for our Browser
	if (!History.enabled) {
    console.log('Error: No history.js support!');
		return false;
	}

  var isDisabled =
    (History.emulated.pushState || History.emulated.hasChange) ||
    (document.getElementsByTagName('html')[0].hasAttribute('disableAjaxify'));

  // help function to replace 'window.location.href = ...'
  window.location.go = function(url, title) {
    if (isDisabled) {
      // fallback to old stuff when ajaxify is disabled (thus no change of
      // existing app)
      window.location.href = url;
    } else {
      History.pushState(null, (title ? title : ''), url);
    }
  };

  // We simply do not use emualted mode of history.js, or force disabled
  if (isDisabled) {
    // early return, so we totally disable the ajaxify on this page
    return;
  }

  var ID_UI_STYLE = 'ajaxify-ui-style';
  var ID_UI_PROGERSS = 'ajaxify-ui-p';
  var defaultProgressIndicator = {
    enable: true,
    insertStyle: function() {
      if (!document.getElementById(ID_UI_STYLE)) {
        var styleNode = document.createElement('style');
        styleNode.id = ID_UI_STYLE;
        styleNode.appendChild(document.createTextNode(
          '@-webkit-keyframes ajaxify-ui-p-a {' +
          '  0% { left: -100%; }' +
          '  100% { left: -2%; } }' +
          '  body.ajaxify-loading .ajaxify-ui-p { display: block; }' +
          '  body .ajaxify-ui-p {' +
          '    display: none; position: fixed; top: 0px; left: 0px;' +
          '    height: 3px; width: 100%; left: -2%; z-index: 9999;' +
          '    background: #5bb75b;' +
          '    animation-name: ajaxify-ui-pa;' +
          '    -webkit-animation-name: ajaxify-ui-p-a;' +
          '    animation-duration: 1s;' +
          '    -webkit-animation-duration: 1s; }'
        ));
        $(document.head).append(styleNode);
      }
    },
    insertHtml: function() {
      if (!document.getElementById(ID_UI_PROGERSS)) {
        var divNode = document.createElement('div');
        divNode.id = ID_UI_PROGERSS;
        divNode.className = 'ajaxify-ui-p';
        $(document.body).prepend(divNode);
      }
    }
  };

  // our ajaxify object
  var a = window.ctAjaxify || { options: {} };

  _.defaults(a.options,
    {
			contentSelector: '#content,article:first,.article:first,.post:first',
 	    scrollOptions: {
				duration: 800,
				easing: 'swing'
			},
      effect: {
        fadeOut: 0,
        fadeIn: 0
      },
      progressIndicator: defaultProgressIndicator
    });

  // register to window
  window.ctAjaxify = a;

  // event support
  a._events = {};

  a.on = function(event, listener) {
    if (!(event in a._events)) {
      a._events[event] = undefined;
    }
    a._events[event] = listener;
  };

  function trigger(event, args) {
    if ((event in a._events) && (a._events[event])) {
      return a._events[event].apply(window.ctAjaxify, args ? args : []);
    }
    return undefined;
  }

  // HTML Helper
  function documentHtml(html) {
  	return $.trim(
            String(html)
              .replace(/<\!DOCTYPE[^>]*>/i, '')
              .replace(/<(html|head|body|title|meta|script)([\s\>])/gi,
                       '<div class="document-$1"$2')
              .replace(/<\/(html|head|body|title|meta|script)\>/gi, '</div>'));
  };

  function ensureAjaxifyUI() {
    // if not disable progress ui, insert it
    if (a.options.progressIndicator.enable) {
      a.options.progressIndicator.insertStyle();
      a.options.progressIndicator.insertHtml();
    }
  }

  // main procedure to ajax current page
  function ajaxifyLoad() {
    var $window = $(window),
        $body = $(document.body),
			  rootUrl = History.getRootUrl();

		var $content = $(a.options.contentSelector).filter(':first'),
			  contentNode = $content.get(0);

		// Ensure Content
		if ($content.length === 0) {
			$content = $body;
      contentNode = $content.get(0);
		}

		// jquery internal link selector helper
		$.expr[':'].internal = function(obj, index, meta, stack) {
			var url = $(obj).attr('href') || '';
			return (url.substring(0, rootUrl.length) === rootUrl ||
              url.indexOf(':') === -1);
		};

		// inject the jquery Ajaxify Helper
		$.fn.ajaxify = function() {
			var $this = $(this);
      // Hijack all links
			$this.delegate('a:internal:not(.no-ajaxify)', 'click',
        function(event) {
				  var $this = $(this),
				  	  url = $this.attr('href'),
				  	  title = $this.attr('title') || null;
				  if (event.which == 2 || event.metaKey) {
            // ctrl + click / meta + click will be the same
            return true;
          } else {
            // Ajaxify this link
            History.pushState(null, title, url);
            event.preventDefault();
            return false;
          }
        });
        return $this;
    };

		// Now hijack current internal links
		$body.ajaxify();

		// Hook into State Changes
    // Use on() instead of bind() for late binding
		$window.on('statechange',
      function() {
			// Prepare Variables
			var State = History.getState(),
				  url = State.url,
				  relativeUrl = url.replace(rootUrl, '');

			// Set Loading
			$body.addClass('ajaxify-loading');
      trigger('ajaxifyLoadingBegin');

      if (a.options.effect && a.options.effect.fadeOut) {
        if (_.isFunction(a.options.fadeOut)) {
          a.options.fadeOut($content);
        } else {
			    // Start Fade Out
			    // Animating to opacity to 0 still keeps the element's height intact
			    // Which prevents that annoying pop bang issue when loading in
          // new content
          $content.animate({ opacity: 0 }, a.options.effect.fadeOut);
        }
      }

			// Ajax Request the Traditional Page
			$.ajax({
				url: url,
        beforeSend: function(jqXHR, settings) {
          trigger('ajaxifyAjaxBeforeSend', [jqXHR, settings]);
        },
				success: function(data, textStatus, jqXHR){
					var $data = $(documentHtml(data));
          var $dataBody = $data.find('.document-body:first');
          var $dataContent = $dataBody.find(a.options.contentSelector)
                                      .filter(':first');

					// Fetch the scripts
					var $scripts = $dataContent.find('.document-script');
          if (!$scripts.length) {
            $scripts = $dataBody.find('.document-script')
          };
					if ($scripts.length) {
						$scripts.detach();
					}

					// Fetch the content
					var contentHtml = $dataContent.html();
          if (!contentHtml) {
            contentHtml = $dataBody.html()
          }
					if (!contentHtml) {
						document.location.href = url;
						return false;
					}

          trigger('ajaxifyBeforeUpdateContent', [contentHtml]);

					// Update the content
					$content.stop(true, true);
					$content.html(contentHtml).ajaxify();
          $content.show(0);
          if (a.options.effect && a.options.effect.fadeIn) {
            if (_.isFunction(a.options.effect.fadeIn)) {
              a.options.effect.fadeIn($content);
            } else {
              $content.animate({ opacity: 100}, a.options.effect.fadeIn);
            }
          }

					// Update the title
					document.title = $data.find('.document-title:first').text();
					try {
						document.getElementsByTagName('title')[0].innerHTML =
              document.title.replace('<','&lt;')
                            .replace('>','&gt;')
                            .replace(' & ',' &amp; ');
					}
					catch (Exception) {
            // just ignore the exception
          }

          trigger('ajaxifyAfterUpdateContent');

					// Add back the scripts
					$scripts.each(function() {
						var $script = $(this),
                scriptText = $script.text(),
                scriptNode = document.createElement('script');
						if ($script.attr('src')) {
							if ( !$script[0].async ) { scriptNode.async = false; }
							scriptNode.src = $script.attr('src');
						}
            scriptNode.appendChild(document.createTextNode(scriptText));
            trigger('ajaxifyBeforeInsertScript', [$(scriptNode), $script]);
            contentNode.appendChild(scriptNode);
					});

					// Complete the change
          /* http://balupton.com/projects/jquery-scrollto */
					if ($body.ScrollTo || false) {
            $body.ScrollTo(a.options.scrollOptions);
          }

          // ensure the UI
          ensureAjaxifyUI();

          trigger('ajaxifyLoadingEnd')
					$body.removeClass('ajaxify-loading');
          trigger('ajaxifyStateChangeComplete');
					$window.trigger('statechangecomplete');
				},
				error: function(jqXHR, textStatus, errorThrown) {
          trigger('ajaxifyAjaxError', [jqXHR, textStatus, errorThrown]);
					document.location.href = url;
					return false;
				}
			}); // end ajax
		}); // end onStateChange

    // bind beforeunload to notify user that this page goes to refresh
    $(window).on('beforeunload',
      function() {
        $body.addClass('ajaxify-loading');
      });

    ensureAjaxifyUI();
  };

	// now attach to document
	$(ajaxifyLoad);

})($, _);
