// Use a closure to get some privacy
(function(w){
    'use strict';
    // Private helpers
    function mergeObject(){
        var out = {};
        for(var i = 0; i < arguments.length; i++){
            for(var j in arguments[i]){
                if(arguments[i].hasOwnProperty(j)){
                    var k = arguments[i][j];
                    if(typeof k === 'object' && !Array.isArray(k)) k = mergeObject(out[j], k);
                    out[j] = k;
                }
            }
        }
        return out;
    }

    function endsWith(str, suffix) {
        return str.match(suffix+"$")==suffix;
    }

    // Reqx constructor
    function Reqx(options){
        // Left merge options and save
        this.options = mergeObject(Reqx.defaults, options);
        // Setup JSON request
        if(this.options.mode) this.options.headers = mergeObject(this.options.headers, Reqx.default_headers[this.options.mode]);

        return this;
    }

    // Initate HTTP request
    Reqx.prototype.request = function(options, callback){
        var xhr = Reqx.getXHR();
        
        xhr.addEventListener('load', function(){
            if(this.status >= 400) return callback({
                message: 'HTTP Error',
                name: 'Error'
            });
            callback(null, this.responseText, this);
        });

        xhr.addEventListener('error', function(){
            callback({
                message: 'Connection Failed',
                name: 'Error'
            });
        });

        options = mergeObject(this.options, options);

        if(options.data) Reqx.preparePayload(options);

        xhr.withCredentials = options.withCredentials;

        xhr.open(options.method, options.url, true);

        if(options.headers) Reqx.setHeaders(xhr, options.headers);

        xhr.send(options.data);

        return xhr;
    };

    // Define HTTP methods
    Reqx.defineMethod = function(method){
        Reqx.prototype[method.toLowerCase()] = function(url, data, callback){
            if(typeof data === 'function'){
                callback = data;
                data = undefined;
            }
            var _self = this;
            this.request({url: url, data: data, method: method}, function(err, body, req){
                if(err) return callback(Reqx.parseResponse(req));
                if(_self.options.parse) body = Reqx.parseResponse(req);
                callback(null, body);
            });
            return this;
        };
    };

    // Get applicable request object
    Reqx.getXHR = function(){
        // Ancient browser
        if(window.ActiveXObject) return new ActiveXObject("Microsoft.XMLHTTP");
        // Moder browser
        return new XMLHttpRequest();
    };

    Reqx.preparePayload = function(options){
        if(options.method === 'GET' && options.data)  options.url += ('?' + Reqx.toQueryString(options.data));
        if(options.mode === 'form'){
            if(options.data instanceof Element) options.data = new FormData(options.data);
            else if(typeof options.data === 'object') options.data = Reqx.toFormData(options.data);
            else if(options.method === 'POST') options.data = Reqx.toQueryString(options.data);
        }
        if(options.mode === 'json' && typeof options.data === 'object') options.data = JSON.stringify(options.data);
        return options;
    };

    // Parse HTTP response
    Reqx.parseResponse = function(xhr){
        var headers = Reqx.parseHeaders(xhr.getAllResponseHeaders());
        var contentType = headers['content-type'];
        var body = xhr.responseText;
        if(endsWith(contentType, 'json')) return JSON.parse(body);
        if(xhr.responseXML) return xhr.responseXML;
        return body;
    };

    // Parse raw headers
    Reqx.parseHeaders = function(rawHeaders){
        var out = {};
        var headers = rawHeaders.split(Reqx.regex.line_return);
        var length = headers.length;
        for(var i = 0; i < length; i++){
            var header = headers[i].match(Reqx.regex.header);
            if(header) out[header[1].toLowerCase()] = header[2];
        }
        return out;
    };

    Reqx.setHeaders = function(xhr, headers){
        // Set custom headers
        if(headers){
            for(var header in headers){
                if(headers.hasOwnProperty(header)) xhr.setRequestHeader(header, headers[header]);   
            }
        }
    };

    Reqx.toFormData = function(data){
        var form = new FormData();
        for(var i in data) if(data.hasOwnProperty(i)) form.append(i, data[i]);
        return form;
    };

    // Strinify query string variables
    Reqx.toQueryString = function(variables){
        var out = '';
        for(var i in variables){
            if(variables.hasOwnProperty(i)){
                if(out) out += '&';
                out += (encodeURIComponent(i) + '=' + encodeURIComponent(variables[i]));
            }
        }
        return out;
    };

    // Default options
    Reqx.defaults = {
        method: 'GET',
        mode: 'json',
        parse: true,
        redirects: true,
        withCredentials: false
    };

    // RegExs
    Reqx.regex = {
        header: /([^:]*):\s?(.+)/,
        line_return: /\r?\n|\r/gm
    };

    Reqx.default_headers = {
        json: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        xml: {
            'Content-Type': 'application/xml',
            Accept: 'application/xml' 
        },
        form: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'text/html'
        }
    };

    Reqx.default_methods = [
        'GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'TRACE', 'OPTIONS'
    ];

    Reqx.version = '2.0.0';

    // Define methods
    for(var i = 0; i < Reqx.default_methods.length; i++) Reqx.defineMethod(Reqx.default_methods[i]);

    // Export to window
    w.Reqx = Reqx;
})(window);
