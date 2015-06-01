# StyleSheetReloader
Simple JavaScript function uses to refresh CSS styles without page reloading.

## Installation
By Bower usage:
```
bower i git://github.com/Vadiok/StyleSheetReloader.git
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
```

Or you can call function by passing to ``script`` tag ``data-stylesheetReloader`` parameter with options in its value (options are optional and the same as uses in js function call)
```html
<script src="some_path/dist/stylesheet_reloader.min.js" data-stylesheetReloader="{hotKey:'alt+e'}" type="text/javascript"></script>
```