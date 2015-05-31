
/*
	StyleSheetReloader v 0.5
	Author: Vlad Tokarev <vlad@tokarev.tk>
 */

(function() {
  var hasProp = {}.hasOwnProperty;

  window.StyleSheetReloader = function(options) {
    var defaultOptions, hotKeyPressed, optionDefaultValue, optionKey, runChange;
    defaultOptions = {
      cssUrl: false,
      hotKey: 'alt+r'
    };
    if (typeof options === 'string') {
      options = {
        cssUrl: options
      };
    }
    if (typeof options !== 'object') {
      options = {};
    }
    for (optionKey in defaultOptions) {
      if (!hasProp.call(defaultOptions, optionKey)) continue;
      optionDefaultValue = defaultOptions[optionKey];
      if (!options[optionKey]) {
        options[optionKey] = defaultOptions[optionKey];
      }
    }
    runChange = function(cssUrl) {
      var addParameter, href, hrefLastChar, i, len, link, links, replacedLinks, replacedVersion;
      replacedLinks = 0;
      links = document.querySelectorAll('link[rel=stylesheet][href]');
      for (i = 0, len = links.length; i < len; i++) {
        link = links[i];
        href = link.getAttribute('href');
        if (href && href.length && (!cssUrl || href.indexOf(cssUrl) !== -1)) {
          href = href.split('replacedVersion')[0];
          hrefLastChar = href.substr(href.length - 1);
          if (hrefLastChar === '?' || hrefLastChar === '&') {
            href = href.substr(0, href.length - 1);
          }
          replacedVersion = Date.now();
          addParameter = '?';
          if (href.indexOf('?') !== -1) {
            addParameter = '&';
          }
          href += addParameter + 'replacedVersion=' + replacedVersion;
          link.setAttribute('href', href);
          replacedLinks++;
        }
      }
      return replacedLinks;
    };
    hotKeyPressed = function(hotKey, event) {
      var i, key, len, result;
      hotKey = hotKey.split('+');
      result = true;
      for (i = 0, len = hotKey.length; i < len; i++) {
        key = hotKey[i];
        if (key.trim().length) {
          key = key.trim().toLowerCase();
          if (key === 'alt' || key === 'ctrl' || key === 'shift') {
            if (!event[key + 'Key']) {
              return false;
            }
          } else {
            if (event.keyCode !== key.toUpperCase().charCodeAt(0)) {
              return false;
            }
          }
        }
      }
      return result;
    };
    return document.onkeydown = function(e) {
      if (hotKeyPressed(options.hotKey, e)) {
        return runChange(options.cssUrl);
      }
    };
  };

}).call(this);
