var Core = function(config){
	config = config || {};
	// LOCALS
	var _self = this;
	// Get applicable request object
	function xmlhttp(){
		// Ancient browser
		if(window.ActiveXObject) return new ActiveXObject("Microsoft.XMLHTTP");
		// Moder browser
		return new XMLHttpRequest();
	}
	// XML parser
	function parseXML(){
		// Ancient browser
		if(ActiveXObject) return new ActiveXObject("Microsoft.XMLDOM");
		// Moder browser
		return new DOMParser();
	}
	// INSTANCE
	// Body parser
	this.parseResponse = function(req){
		// To lower case for dummy proofing
		var ct = req.getResponseHeader('content-type') || req.getResponseHeader('Content-Type');
		// Disable parser, always returns a string
		if(config.parser == false || !ct) return req.responseText;
		// Dummy proof
		ct = ct.toLowerCase();
		// Null response should return here with null string
		if(!req.responseText) return '';
		// Parse based on content type header
		if(ct.indexOf('json') > -1 || ct.indexOf('application/json') > -1){
			// Try to parse it
			try{
				// All good, it's JSON!
				return JSON.parse(req.responseText);
			}catch(e){
				// Bad! It's not JSON
				var err = new Error('ReqX Error: The request header implied a JSON response. However, the response was not valid JSON.');
				err.additional = e;
				// Log a nice warning for devs
				console.error(err);
				// Return plain text
				return req.responseText;
			}
		}
		return req.responseText;
	};
	// Spin a new ajax request
	this.ajax = function(options, callback){
		var request = xmlhttp();
		// Done handler
		request.onreadystatechange = function(){
			if(this.readyState === 4){
				switch(this.status){
					// Successful
					case 200: case 201: case 202: case 203: case 204: case 205: case 206:
						if(callback) callback(null, _self.parseResponse(this), this);
					break;
					// Fail
					case 301: case 302: case 303: case 304: case 305: case 307: case 400: case 401: case 402: case 403: case 404: case 405: case 406: case 407: case 408: case 409: case 410: case 411: case 412: case 413: case 414: case 415: case 416: case 417: case 418: case 500: case 501: case 502: case 503: case 504: case 505: default:
						if(callback) callback(_self.parseResponse(this), null, this);
					break;
				}
			}
		};
		// Setup request
		request.open(options.method, options.url, true);
		// Set custom headers
		if(options.headers)
			for(var header in options.headers)
				if(options.headers.hasOwnProperty(header))
					request.setRequestHeader(header, options.headers[header]);
		// Send request
		request.send(((options.method !== 'GET') && options.data) ? options.data : undefined);
		
		return request;
	};
	// Return constructed Core object
	return this;
};
