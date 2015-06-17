
/**
 * StyleSheetReloader v 1.5
 * Author: Vlad Tokarev <vlad@tokarev.tk>
 */

(function() {
  var hasProp = {}.hasOwnProperty;

  window.StyleSheetReloader = function(options) {
    var hotKeyPressed;
    options = window.StyleSheetReloader.prepareOptions(options);
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
    return document.addEventListener('keydown', function(e) {
      if (hotKeyPressed(options.hotKey, e)) {
        return window.StyleSheetReloader.reload(options.cssUrl);
      }
    });
  };

  window.StyleSheetReloader.prepareOptions = function(options, parseJson) {
    var defaultOptions, error, json, optionDefaultValue, optionKey;
    if (options == null) {
      options = false;
    }
    if (parseJson == null) {
      parseJson = false;
    }
    defaultOptions = {
      cssUrl: false,
      hotKey: 'alt+r'
    };
    if (parseJson && options && options.length) {
      try {
        json = JSON.parse(options);
        options = json;
      } catch (_error) {
        error = _error;
        console.log(error);
      }
    }
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
    if (options.cssUrl && !options.cssUrl.length) {
      options.cssUrl = false;
    }
    return options;
  };

  window.StyleSheetReloader.reload = function(cssUrl) {
    var addParameter, href, hrefLastChar, i, len, link, links, replacedLinks, replacedVersion;
    if (cssUrl == null) {
      cssUrl = false;
    }
    replacedLinks = 0;
    if (typeof cssUrl === 'string' && !cssUrl.length) {
      cssUrl = false;
    }
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

  window.StyleSheetReloader.runByTagParams = function() {
    var i, len, options, results, script, scripts;
    scripts = document.querySelectorAll('script[data-stylesheetReloader]');
    results = [];
    for (i = 0, len = scripts.length; i < len; i++) {
      script = scripts[i];
      options = window.StyleSheetReloader.prepareOptions(script.getAttribute('data-stylesheetReloader'), true);
      results.push(window.StyleSheetReloader(options));
    }
    return results;
  };

  window.StyleSheetReloader.listen = function(url, period) {
    var href, i, len, link, links, reloadIfRequired, urlString;
    if (url == null) {
      url = false;
    }
    if (period == null) {
      period = 1000;
    }
    if (typeof url === 'string' && !url.length) {
      url = false;
    }
    if (!url) {
      url = {};
      links = document.querySelectorAll('link[rel=stylesheet][href]');
      for (i = 0, len = links.length; i < len; i++) {
        link = links[i];
        href = link.getAttribute('href');
        if (href && href.length) {
          url[href] = 0;
        }
      }
    }
    if (typeof url === 'string') {
      urlString = url;
      url = {};
      url[urlString] = 0;
    }
    reloadIfRequired = function() {
      var lm, results, urlLastMod, urlLink;
      results = [];
      for (urlLink in url) {
        if (!hasProp.call(url, urlLink)) continue;
        urlLastMod = url[urlLink];
        lm = window.StyleSheetReloader.getLastModificationTime(urlLink);
        if (urlLastMod !== lm) {
          url[urlLink] = lm;
          results.push(window.StyleSheetReloader.reload(urlLink));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    setInterval(reloadIfRequired, period);
    return period;
  };

  window.StyleSheetReloader.getLastModificationTime = function(url) {
    var error, lastModified, request;
    request = new XMLHttpRequest();
    try {
      request.open('HEAD', url, false);
      request.send(null);
    } catch (_error) {
      error = _error;
      console.log(error);
      return false;
    }
    if (request.readyState < 3) {
      console.log("Server doesn't ready to answer");
      return false;
    }
    if (!request) {
      console.log("XMLHttpRequest doesn't supported by your browser");
      return false;
    }
    lastModified = request.getResponseHeader('Last-Modified');
    if (!lastModified) {
      console.log("Can't receive \"Last-Modified\" header from server");
      return false;
    }
    return lastModified;
  };

  window.StyleSheetReloader.runByTagParams();

}).call(this);
