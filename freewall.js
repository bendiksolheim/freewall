(function() {

	var url = '';

	chrome.browserAction.onClicked.addListener(function(tab) {
		url = tab.url;
		chrome.tabs.reload(tab.id, {bypassCache: true}, function() {
		});
	});

	var handleRequest = function(details) {
		var blockingResponse = {};
		var headers = details.requestHeaders;
		
		if (url !== details.url)
			return {requestHeaders: headers};

		url = '';

		var found = false;
		for (var i = 0; i < headers.length; i++) {
			if (headers[i].name === 'Referer') {
				headers[i].value = 'https://www.facebook.com';
				found = true;
				break;
			}
		}

		if (!found)
			headers.push({name: 'Referer', value: 'https://www.facebook.com'});

		blockingResponse.requestHeaders = headers;
		return blockingResponse;
	}

	chrome.webRequest.onBeforeSendHeaders.addListener(handleRequest, {urls: ['*://*/*']}, ['requestHeaders', 'blocking']);

})();