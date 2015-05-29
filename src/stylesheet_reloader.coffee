###
	StyleSheetReloader v 0.5
	Author: Vlad Tokarev <vlad@tokarev.tk>
###
window.StyleSheetReloader = (options)->
	defaultOptions = {
		cssUrl: false
		,hotKey: 'alt+r'
	}
	if typeof options is 'string'
		options = {
			cssUrl:options
		}
	if typeof options != 'object'
		options = {}
	for own optionKey,optionDefaultValue of defaultOptions
		if !options[optionKey]
			options[optionKey] = defaultOptions[optionKey]
	# Changes links href with replacedVersion get parameter
	runChange = (cssUrl)->
		replacedLinks = 0
		links = document.querySelectorAll('link[rel=stylesheet][href]')
		for link in links
			href = link.getAttribute('href')
			if href && href.length && (!cssUrl || href.indexOf(cssUrl)!=-1)
				href = href.split('replacedVersion')[0]
				hrefLastChar = href.substr(href.length-1)
				if hrefLastChar=='?' || hrefLastChar=='&'
					href = href.substr(0,href.length-1)
				replacedVersion = Date.now()
				addParameter = '?'
				if href.indexOf('?')!=-1
					addParameter = '&'
				href+= addParameter + 'replacedVersion=' + replacedVersion;
				link.setAttribute('href',href)
				replacedLinks++
		return replacedLinks
	# Detects if HotKey is pressed
	hotKeyPressed = (hotKey,event)->
		hotKey = hotKey.split('+')
		result = true
		for key in hotKey
			if key.trim().length
				key = key.trim().toLowerCase()
				if key in ['alt','ctrl','shift']
					if !event[key+'Key']
						return false
				else
					if event.keyCode != key.toUpperCase().charCodeAt(0)
						return false
		return result
	# Listening key pressed event
	document.onkeydown = (e)->
		if hotKeyPressed(options.hotKey,e)
			runChange(options.cssUrl)