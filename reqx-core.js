var Core = function(config){
	config = config || {};
	// LOCALS
	var _self = this;
	// Get applicable reqauet opbject
	function xmlhttp(){
		// Ancient  browers
		if(window.ActiveXObject) return new ActiveXObject("Microsoft.XMLHTTP");
		// Moder browser
		return new XMLHttpRequest();
	}
	// INSTANCE
	// Body parser
	this.parseIncoming = function(req){
		// To lower case for dummy proofing
		var ct = req.getResponseHeader('content-type') || req.getResponseHeader('Content-Type');
		// Disable parser, always returns a string
		if(config.parser == false || !ct) return req.responseText;
		// Dummy proof
		var ct = ct.toLowerCase();
		// Null response should return here
		if(!req.responseText) return '';
		// Parse based on content type header
		if(ct.indexOf('json') > -1 || ct.indexOf('javascript') > -1){
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
		// TODO Parse XML
		return req.responseText;
	}
	// Spin a new ajax request
	this.ajax = function(options, callback){
		var request = xmlhttp();
		// Done handler
		request.onreadystatechange = function(){
			switch(request.readyState){
					// server connection established
			    case 1:
			    	request.ReqX_status = 'Connected';
			        break; 
			        // request received
			    case 2:
			    	request.ReqX_status = 'Received';
			        break; 
			        // processing request
			    case 3:
			    	request.ReqX_status = 'Processing';
			        break;
			        // request finished and response is ready
			    case 4:
			    	request.ReqX_status = 'Completed';
			    	switch(request.status){
			    		// Successful
			    		case 200: case 201: case 202: case 203: case 204: case 205: case 206:
			    			if(callback) callback(null, _self.parseIncoming(request), request);
			    			break;
		    			// Fail
			    		case 301: case 302: case 303: case 304: case 305: case 307: case 400: case 401: case 402: case 403: case 404: case 405: case 406: case 407: case 408: case 409: case 410: case 411: case 412: case 413: case 414: case 415: case 416: case 417: case 418: case 500: case 501: case 502: case 503: case 504: case 505: default:
			    			if(callback) callback(_self.parseIncoming(request), null, request);
			    	}
			        break; 
			    default: 
			    	request.ReqX_status = 'Started';
			}
		}
		// Setup request
		request.open(options.method, options.url, true);
		// Set default header
		if(config.contentType != false) config.contentType ? request.setRequestHeader('Content-Type', config.contentType) : request.setRequestHeader('Content-Type', 'application/json');
		// Set custom headers
		if(options.headers) for(var header in headers) request.setRequestHeader(header, headers[header]);
		// Send request
		request.send(((options.method === 'POST') && options.data) ? options.data : undefined);
	}
	// Return consructed Core object
	return this;
};
