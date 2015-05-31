# StyleSheetReloader
Simple JavaScript function uses to refresh CSS styles without page reloading.

## Installation
By Bower usage:
```
bower i git://github.com/Vadiok/StyleSheetReloader.git
```
By simple downloading of [zip archive](https://github.com/Vadiok/StyleSheetReloader/archive/master.zip)

## Usage
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