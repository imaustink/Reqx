// Request class constructor
var ReqX = function(config){
    // Prevent instance collision
    if(!(this instanceof ReqX)) return new ReqX(config);
    // Version
    this.version = '0.3.1 (beta)';
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
    // JSON mode
    if(config.json === true){
        config.contentType = 'application/json';
        config.dataType = 'json';
        config.accept = 'json';
    }
    // Default to GET
    if(!config.default_method) config.default_method = 'GET';
    var Core = function(){};
    (function(config){
        config = config || {};
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
            if(window.ActiveXObject) return new ActiveXObject("Microsoft.XMLDOM");
            // Moder browser
            return new DOMParser();
        }
        function parseRawHeaders(headers){
            headers = headers.split(/\r?\n/);
            var output = {};
            headers.forEach(function(header){
                header = header.toLowerCase().split(':');
                var key = header[0];
                var val = header[1];
                if(key && val) output[key.trim()] = val.trim();
            });
            return output;
        }
        // Body parser
        this.parseResponse = function(req){
            var headers = parseRawHeaders(req.getAllResponseHeaders());
            // To lower case for dummy proofing
            var ct = headers['content-type'];
            // Disable parser, always returns a string
            if(config.parser == false || !ct) return req.responseText;
            // Parse based on content type header

            if(ct.indexOf('json') > -1) return JSON.parse(req.responseText);

            if(ct.indexOf('xml') > -1) return parseXML(req.responseText);
            // Null response should return here with null string
            if(!req.responseText) return '';
            // Return response text
            return req.responseText;
        };
        // Spin up a new ajax request
        this.request = function(options, callback){
            var request = xmlhttp();
            // Done handler
            request.onreadystatechange = function(){
                if(this.readyState === 4){
                    switch(this.status){
                        // Successful
                        case 200: case 201: case 202: case 203: case 204: case 205: case 206:
                        try{
                            if(callback) callback(null, _self.parseResponse(this), this);
                        }catch(e){
                            e.message = 'Failed to parse response!';
                            if(callback) callback(e, undefined, this);
                        }
                        break;
                        // Fail
                        case 301: case 302: case 303: case 304: case 305: case 307: case 400: case 401: case 402: case 403: case 404: case 405: case 406: case 407: case 408: case 409: case 410: case 411: case 412: case 413: case 414: case 415: case 416: case 417: case 418: case 500: case 501: case 502: case 503: case 504: case 505: default:
                        try{
                            if(callback) callback(_self.parseResponse(this), undefined, this);
                        }catch(e){
                            e.message = 'Failed to parse response!';
                            if(callback) callback(e, undefined, this);
                        }
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
    }).call(Core, config);
    // Validate URL
    function validateURL(url){
        // Default to current root
        if(!url || typeof url != 'string') url = window.location.href;
        var s = url.indexOf('/');
        var ss = url.indexOf('//');
        var d = url.indexOf('.');
        var p = url.indexOf('http');
        // Subdirectory
        if(s < 0 && d < 0 && p < 0) return window.location.href + '/' + url;
        if(ss < 0 && (s == 0 || d < 0)) return window.location.href + (s > 0 ? '/' : '') + url;
        // Protocal
        if(url.indexOf('http') < 0) return window.location.protocol + (ss < 0 ? '//' : '') + url;
        return url;
    }
    // Query
    function queryString(url, vars){
        if(!vars) return url;
        if(url.indexOf('?') < 0){
            url += '?';
        }else{
            if(url.lastIndexOf('?') != url.length - 1) url += '&';
        }
        var qs = '';
        for(var v in vars){
            if(vars.hasOwnProperty(v)){
                if(qs) qs += '&';
                qs += v + '=' + vars[v];
            }
        }
        return url+qs;
    }
    // Request started
    var start = function () {
        // Incriment pending reqest counter
        count++;
    };
    // Request done
    var done = function (err) {
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
    };
    // Next synchronous request
    var next = function(){
        // No more requests
        if(synchronous_queue.length < 1) return;
        // Next request
        var req = synchronous_queue[0];
        // Call next request
        _self.ajax(req.url, req.method, req.data, req.callback);
    };
    // Done callback setter
    this.done = function(callback){
        if(typeof callback !== 'function') return console.warn('ReqX.done() only accepts functions');
        _self.callback = callback;
        return this;
    };
    // Error callback setter
    this.error = function(callback){
        if(typeof callback !== 'function') return console.warn('ReqX.errors() only accepts functions');
        _self.error_callback = callback;
        return this;
    };
    // Ajax handler
    this.ajax = function (options, callback) {
        // FIXME
        // again
        var again = function(){
            if(config.sync && count > 0){
                synchronous_queue.unshift(options);
                return
            }
            _self.ajax(options);
        };
        // synchronous mode
        if(config.sync && count > 0){
            // Save it for later
            synchronous_queue.push(options);
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
        // FIXME this seems heavy handed
        if(config.json == true && typeof data === 'object' && method !== 'GET') data = JSON.stringify(data);
        start();
        // Make request
        Core.request(options, function(err, result, xmlhttp){
            if(callback) callback(err, result, xmlhttp, again);
        });
        return this;
    };
    // Define request metthod
    this.defineMethod = function(method){
        this[method] = function(url, data, callback){
            if(!data){
                callback = data;
                data = undefined;
            }
            self.ajax(url, 'GET', data, callback);
            return this;
        }
    };
    // Methods
    this.defineMethod('GET');
    this.defineMethod('HEAD');
    this.defineMethod('POST');
    this.defineMethod('PUT');
    this.defineMethod('PATCH');
    this.defineMethod('DELETE');
    this.defineMethod('TRACE');
    this.defineMethod('OPTIONS');
    
    return this;
};
