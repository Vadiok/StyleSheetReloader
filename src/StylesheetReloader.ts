class StylesheetReloader {
	protected options = {
		cssUrl: <string> null,
		hotKey: <string> "alt+r",
	};

	public constructor(options: string|Object = null) {
		this.setOptions(options);
		this.setHotKeyEvent();
	}

	// Static function to reload style(s)
	public static reload(cssUrl: string = null) {
		let updatedLinks = 0;
		if (typeof cssUrl === "string" && !cssUrl.length) {
			cssUrl = null;
		}
		let links = document.querySelectorAll("link[rel=stylesheet][href]");
		for (let link of links) {
			let href = link.getAttribute("href");
			if (href && href.length && (!cssUrl || href.indexOf(cssUrl) !== -1)) {
				href = href.split("replacedVersion")[0];
				let hrefLastChar = href.substr(href.length - 1);
				if (hrefLastChar === "?" || hrefLastChar === "&") {
					href = href.substr(0, href.length - 1);
				}
				let replacedVersion = Date.now();
				let addParameter = "?";
				if (href.indexOf("?") !== -1) {
					addParameter = "&";
				}
				href += addParameter + "replacedVersion=" + replacedVersion;
				link.setAttribute("href", href);
				updatedLinks++;
			}
		}
		return updatedLinks;
	}

	public static listen(url: string|Array = null, period: number = 1000) {
		let urls = {};
		if (Array.isArray(url)) {
			for (let urlItem of url) {
				urls[urlItem] = 0;
			}
		} else {
			if (typeof url !== "string" || !url.length) {
				url = null;
			}
			if (url) {
				urls[url] = 0;
			} else {
				let links = document.querySelectorAll("link[rel=stylesheet][href]");
				for (let link of links) {
					let href = link.getAttribute("href");
					if (href && href.length) {
						urls[href] = 0;
					}
				}
			}
		}
		let reloadIfRequired = function () {
			for (let urlKey in urls) {
				let lastMod = StylesheetReloader.getLastModificationTime(urlKey);
				if (lastMod && urls[urlKey] < lastMod) {
					urls[urlKey] = lastMod;
					StylesheetReloader.reload(urlKey);
				}
			}
		};
		setInterval(reloadIfRequired, period);
		return period;
	}

	// Creates new instances by tag params
	public static runByTagParams() {
		let scripts = document.querySelectorAll("script[data-stylesheetReloader]");
		let noOptionsWas = false;
		for (let script of scripts) {
			let optionsString = script.getAttribute("data-stylesheetReloader").trim();
			if (!optionsString.length) {
				// Prevent of creation several instances with default params
				if (!noOptionsWas) {
					noOptionsWas = true;
					new StylesheetReloader();
				}
			} else {
				try {
					let options = JSON.parse(optionsString);
					new StylesheetReloader(options);
				} catch (error) {
					new StylesheetReloader(optionsString);
				}
			}
		}
	}

	protected setOptions(options: string|Object = null) {
		if (!options) return;
		if (typeof options === "string") {
			if (!options["length"]) return;
			options = {
				cssUrl: options,
			};
		}
		if (typeof options !== "object") return;
		for (let key in this.options) {
			if (options.hasOwnProperty(key)) {
				this.options[key] = options[key];
			}
		}
	}

	// Adding of HotKey event listener
	protected setHotKeyEvent() {
		let options = this.options;
		let event = function (e: KeyboardEvent) {
			function isHotKeyPressed() {
				let keys = options.hotKey.split("+");
				if (!keys.length) return false;
				for (let key of keys) {
					if (key.trim().length) {
						key = key.trim().toLowerCase();
						if (key in ["alt", "ctrl", "shift"]) {
							if (!e[key + "Key"]) {
								return false;
							}
						} else {
							if (e.keyCode !== key.toUpperCase().charCodeAt(0)) {
								return false;
							}
						}
					}
				}
				return true;
			}
			if (isHotKeyPressed()) {
				StylesheetReloader.reload(options.cssUrl);
			}
		};
		document.addEventListener("keydown", event);
	}

	// Getting last modification time response from server
	protected static getLastModificationTime(url) {
		let request = new XMLHttpRequest();
		if (!request) {
			console.log("XMLHttpRequest doesn't supported by your browser");
			return null;
		}
		try {
			request.open("HEAD", url, false);
			request.send(null);
		} catch (error) {
			console.log(error);
			return null;
		}
		if (request.readyState < 3) {
			console.log("Server doesn't ready to answer");
			return null;
		}
		let lastModified = request.getResponseHeader("Last-Modified");
		if (!lastModified) {
			console.log(`Can't receive "Last-Modified" header from server`);
			return null;
		}
		return lastModified;
	}
}

StylesheetReloader.runByTagParams();
