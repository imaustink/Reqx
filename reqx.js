// Request class constructor
var ReqX = function(config){
    // Prevent instance collision
    if(!(this instanceof ReqX)) return new ReqX(config);
    // LOCALS
    // Global scope this
    var _self = this;
    // Pending request counter
    var count = 0;
    // Errors
    var errors = [];
    // synchronous request queue
    var synchronous_queue = [];
    // Config
    if(!config) config = {};
    // Request started
    var started = function () {
        // Incriment pending reqest counter
        count++;
    }
    // Request finished
    var finished = function (err) {
        // Decrement pending reqest counter
        count--;
        // Had an error
        if(err){
            // Reset errors array
            if(!errors) errors = [];
            // Save error
            errors.push(err);
            // Error callback
            if(_self.error_callback) _self.error_callback(err);
        } 
        // Last request
        if(count == 0){
            // Call next synchronous
            if(synchronous_queue.length > 0) next();
            // Remove last from the list
            synchronous_queue.splice(0, 1);
            // Done callback
            if(_self.callback && synchronous_queue.length < 1 && count < 1){
                // No errors, set to null for easy checking
                if(!errors || errors.length < 1) errors = null;
                // Callback
                _self.callback(errors);
                // Reset callback for next request
                _self.callback = null;
            }
        } 
    }
    // Next synchronous request
    var next = function(){
        // No more requests
        if(synchronous_queue.length < 1) return;
        // Next request
        var req = synchronous_queue[0];
        // Call next request
        _self.ajax(req.url, req.method, req.data, req.callback);
    }
    // Get applicable reqauet opbject
    function xmlhttp(){
        // Ancient  browers
        if(window.ActiveXObject) return new ActiveXObject("Microsoft.XMLHTTP");
        // Moder browser
        return new XMLHttpRequest();
    }
    // INSTANCE
    // Version
    this.version = 2.0+' (Beta)';
    // Done callback setter
    this.done = function(callback){
        if(typeof callback !== 'function') return console.warn('ReqX.done() only accepts functions');
        _self.callback = callback;
        return this;
    }
    // Error callback setter
    this.error = function(callback){
        if(typeof callback !== 'function') return console.warn('ReqX.errors() only accepts functions');
        _self.error_callback = callback;
        return this;
    }
    // Ajax handler
    this.ajax = function (url, method, data, callback) {
        // again
        var again = function(){
            if(config.sync && count > 0){
                synchronous_queue.unshift({
                    url: url,
                    method: method,
                    data: data,
                    callback: callback
                });
                return
            }
            _self.ajax(url, method, data, callback);
        }
        // synchronous mode
        if(config.sync && count > 0){
            // Objectify request
            var save = {
                url: url,
                method: method,
                data: data,
                callback: callback
            }
            // Save it for later
            synchronous_queue.push(save);
            return this;
        }
        //Only URL and callback
        if(typeof method  == 'function'){
            callback = method;
            data = method = undefined;
        }
        // No data
        if(typeof data == 'function'){
            callback = data;
            data = undefined;
        }
        started();
        // Make request
        this.request({url: url, method: (method || config.default_method || 'GET'), cache: (config.cache || true), data: (data || {}), dataType: config.dataType}, function(err, result, xmlhttp){
            if(callback) callback(err, result, xmlhttp, again);
            finished(err ? err : undefined);
        });
        return this;
    }
    // GET handler
    this.get = function(url, data, callback){
        if(!data){
            callback = data;
            data = undefined;
        }
        this.ajax(url, 'GET', data, callback);
        return this;
    };
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
    // POST handler
    this.post = function(url, data, callback){
        if(!data){
            callback = data;
            data = undefined;
        }
        this.ajax(url, 'POST', data, callback);
        return this;
    };
    // Spin a new ajax request
    this.request = function(options, callback){
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
    // TODO URL parser
    return this;
};
