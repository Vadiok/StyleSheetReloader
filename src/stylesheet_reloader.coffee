###*
 * StyleSheetReloader v 1.5
 * Author: Vlad Tokarev <vlad@tokarev.tk>
###
window.StyleSheetReloader = (options)->
	options = window.StyleSheetReloader.prepareOptions(options)
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
	# Adds key pressed event listener
	document.addEventListener('keydown', (e)->
		if hotKeyPressed(options.hotKey,e)
			window.StyleSheetReloader.reload(options.cssUrl)
	)

# Prepare options
window.StyleSheetReloader.prepareOptions = (options=false, parseJson=false)->
	defaultOptions = {
		cssUrl: false
		,hotKey: 'alt+r'
	}
	if parseJson && options && options.length
		try
			json = JSON.parse(options)
			options = json
		catch error
			console.log(error)
	if typeof options is 'string'
		options = {
			cssUrl: options
		}
	if typeof options != 'object'
		options = {}
	for own optionKey,optionDefaultValue of defaultOptions
		if !options[optionKey]
			options[optionKey] = defaultOptions[optionKey]
	if options.cssUrl && !options.cssUrl.length
		options.cssUrl = false
	return options

# Changes links href with replacedVersion get parameter
window.StyleSheetReloader.reload = (cssUrl=false)->
	replacedLinks = 0
	if typeof cssUrl is 'string' && !cssUrl.length
		cssUrl = false
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
			href+= addParameter + 'replacedVersion=' + replacedVersion
			link.setAttribute('href',href)
			replacedLinks++
	return replacedLinks

# Searching for running by tag parameters
window.StyleSheetReloader.runByTagParams = ()->
	scripts = document.querySelectorAll('script[data-stylesheetReloader]')
	for script in scripts
		options = window.StyleSheetReloader.prepareOptions(script.getAttribute('data-stylesheetReloader'),true)
		window.StyleSheetReloader(options)

# Running Live Reloading
window.StyleSheetReloader.listen = (url=false, period=1000)->
	if typeof url is 'string' && !url.length
		url = false
	if !url
		url = {}
		links = document.querySelectorAll('link[rel=stylesheet][href]')
		for link in links
			href = link.getAttribute('href')
			if href && href.length
				url[href] = 0
	if typeof url is 'string'
		urlString = url
		url = {}
		url[urlString] = 0
	reloadIfRequired = ()->
		for own urlLink,urlLastMod of url
			lm = window.StyleSheetReloader.getLastModificationTime(urlLink)
			if urlLastMod != lm
				url[urlLink] = lm
				window.StyleSheetReloader.reload(urlLink)
	setInterval(reloadIfRequired,period)
	return period

# Get modification time response from server
window.StyleSheetReloader.getLastModificationTime = (url)->
	request = new XMLHttpRequest()
	try
		request.open('HEAD',url, false)
		request.send(null)
	catch error
		console.log(error)
		return false
	if request.readyState<3
		console.log("Server doesn't ready to answer")
		return false
	if !request
		console.log("XMLHttpRequest doesn't supported by your browser")
		return false
	lastModified = request.getResponseHeader('Last-Modified')
	if !lastModified
		console.log("Can't receive \"Last-Modified\" header from server")
		return false
	return lastModified

window.StyleSheetReloader.runByTagParams()