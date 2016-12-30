// Use a closure to get some privacy
(function(w){
    // Polly fills
    if(!Error){
        var Error = function(message){
            this.message = message;
            this.name = 'Error';
            // Consider generating stack trace
            this.stack = null;
            return this;
        };
    }

    // Global helpers
    function mergeObject(){
        var out = {};
        for(var i = 0; i < arguments.length; i++)
            for(var j in arguments[i])
                if(arguments[i].hasOwnProperty(j))
                    out[j] = arguments[i][j];
        return out;
    }

    // Global RegExs
    var HEADER_REGEX = /([^:]*):\s?(.+)/;
    var LINE_RETURN_REGEX = /\r?\n|\r/gm;

    // Reqx constructor
    function Reqx(options){
        // Left merge options and save
        this.options = mergeObject(this.defaults, options);
        // Setup JSON request
        if(this.options.json){
            this.options.headers = mergeObject(this.options.headers, {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            });
        }
        return this;
    }

    // Initate HTTP request
    Reqx.prototype.request = function(options, callback){
        options = mergeObject(this.options, options);
        var request = Reqx.getXHR();
        
        request.addEventListener('load', function(){
            callback(null, this.responseText, this);
        });

        request.addEventListener('error', function(){
            callback(new Error('Request Failed'));
        });

        if(options.method === 'GET' && options.data){
            options.url += ('?' + Reqx.toQueryString(options.data));
            delete options.data;
        }

        request.open(options.method, options.url, true);

        // Set custom headers
        if(this.options.headers || options.headers){
            var headers = mergeObject(this.options.headers, options.headers);
            for(var header in headers)
                if(headers.hasOwnProperty(header))
                    request.setRequestHeader(header, headers[header]);   
        }

        if(this.options.json && typeof options.data === 'object')
            options.data = JSON.stringify(options.data);

        request.withCredentials = options.withCredentials;

        request.send(options.data);

        return request;
    };

    // Default options
    Reqx.prototype.defaults = {
        method: 'GET',
        json: true,
        parse: true,
        redirects: true,
        withCredentials: false
    };

    // Get applicable request object
    Reqx.getXHR = function(){
        // Ancient browser
        if(window.ActiveXObject) return new ActiveXObject("Microsoft.XMLHTTP");
        // Moder browser
        return new XMLHttpRequest();
    };

    Reqx.getXMLParser = function(){
        // Ancient browser
        if(window.ActiveXObject) return new ActiveXObject("Microsoft.XMLDOM");
        // Moder browser
        return new DOMParser();
    };

    // Parse HTTP response
    Reqx.parseResponse = function(body, format){
        if(format.endsWith('json')) return JSON.parse(body);
        if(format.endsWith('xml')){
            var parser = Reqx.getXMLParser();
            return parser.parseFromString(body, format);
        }
        return body;
    };

    // Parse raw headers
    Reqx.parseHeaders = function(raw){
        var out = {};
        var headers = raw.split(LINE_RETURN_REGEX);
        var length = headers.length;
        for(var i = 0; i < length; i++){
            var header = headers[i].match(HEADER_REGEX);
            if(header) out[header[1].toLowerCase()] = header[2];
        }
        return out;
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

    // Define HTTP methods
    Reqx.defineMethod = function(method){
        this.prototype[method.toLowerCase()] = function(url, data, callback){
            var _self = this;
            this.request({url: url, data: data, method: method}, function(err, body, req){
                if(err) return callback(err);
                var headers = Reqx.parseHeaders(req.getAllResponseHeaders());
                var content_type = headers['content-type'];
                if(_self.options.parse && content_type) body = Reqx.parseResponse(body, content_type);
                callback(null, body);
            });
            return this;
        };
    };

    Reqx.default_methods = [
        'GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'TRACE', 'OPTIONS'
    ];

    // Define methods
    for(var i = 0; i < Reqx.default_methods.length; i++) Reqx.defineMethod(Reqx.default_methods[i]);

    // Export to window
    w.Reqx = Reqx;
})(window);
