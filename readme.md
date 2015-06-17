# StyleSheetReloader
Simple JavaScript function uses to refresh CSS styles without page reloading. Supports refreshing by
* using of **HotKeys**
* running function on **event** (for example ``onclick``)
* listening changes of **Last-Modified** answer of server

## Installation
By Bower usage:
```
bower i stylesheet-reloader
```
By simple downloading of [zip archive](https://github.com/Vadiok/StyleSheetReloader/archive/master.zip)

## Usage
Add JavaScript file to html page
```html
<script src="some_path/dist/stylesheet_reloader.min.js" type="text/javascript"></script>
```

Add function call to your code
```js
// Reloads all stylesheet files on Alt+R (default HotKey)
StyleSheetReloader();

// Reloads only specified stylesheet
// (or stylesheets which contains specified string in their href parameter)
StyleSheetReloader('/styles/some_style.css');

// Reloads all stylesheets with specified HotKey
// Accepts 'alt', 'ctrl', 'shift' modifiers (optional) and letters 
StyleSheetReloader({hotKey:'alt+e'});

// Reloads style1.css on Alt+1 & style1.css on Alt+2
StyleSheetReloader({'cssUrl':'style1.css',hotKey:'alt+1'});
StyleSheetReloader({'cssUrl':'style2.css',hotKey:'alt+2'});

// Reloads all changed styles every second
StyleSheetReloader.listen()
```

Or you can call function by passing to ``script`` tag ``data-stylesheetReloader`` parameter with options in its value (options are optional and the same as uses in js function call)
```html
<script src="https://cdn.rawgit.com/Vadiok/StyleSheetReloader/77033a4eceb89424160493719d72d5fa6def1b41/dist/stylesheet_reloader.min.js" data-stylesheetReloader='{"hotKey":"alt+e"}' type="text/javascript"></script>
```

If you want to add some link or button which will refresh styles on its click you can do something like this
```html
<a href="#" onclick="StyleSheetReloader.reload(); return false;">Click to reload CSS!</a>
```

### About changes listening
``StyleSheetReloader.listen()`` will work properly only if your server sends *"Last-Modified"* headers.

This function has 2 params:
```js
StyleSheetReloader.listen(url,refreshingInterval)
```

``url`` - specified which urls must be listening for changes; can be ``false`` (default), ``string`` or ``array``:
* ``false`` - StyleSheetReloader will listen about changes of all stylesheets
* ``string`` - StyleSheetReloader will listen for changes of specified url
* ``array`` - StyleSheetReloader will listen for changes of specified list of urls, example ``[["style1.css", "styles/style2.css"]]``

``refreshingInterval`` - interval between connections in ms, default 1000 ms (1 second).