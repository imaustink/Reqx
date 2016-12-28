// Closure so we can have private globals
(function(w){
    // Polly fill Error
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
            for(var f in arguments[i])
                if(arguments[i].hasOwnProperty(f))
                    out[f] = arguments[i][f];
        return out;
    }

    // Get applicable request object
    function getXMLHttp(){
        // Ancient browser
        if(window.ActiveXObject) return new ActiveXObject("Microsoft.XMLHTTP");
        // Moder browser
        return new XMLHttpRequest();
    }

    function getXMLParser(){
        // Ancient browser
        if(window.ActiveXObject) return new ActiveXObject("Microsoft.XMLDOM");
        // Moder browser
        return new DOMParser();
    }

    // Global RegExs
    var HEADER_REGEX = /([^:]*):\s?(.+)/;
    var LINE_RETURN_REGEX = /\r?\n|\r/gm;

    // Reqx constructor
    function Reqx(options){
        // Left merge options and save
        this.options = mergeObject(this.defaults, options);
        // Define methods
        this.defineMethod('GET');
        this.defineMethod('HEAD');
        this.defineMethod('POST');
        this.defineMethod('PUT');
        this.defineMethod('PATCH');
        this.defineMethod('DELETE');
        this.defineMethod('TRACE');
        this.defineMethod('OPTIONS');
        return this;
    }

    // Initate HTTP request
    Reqx.prototype.request = function(options, callback){
        var request = getXMLHttp();
        var method = options.method || this.options.method;
        
        request.addEventListener('load', function(){
            callback(null, this.responseText, this);
        });

        request.addEventListener('error', function(){
            callback(new Error('Request Failed'));
        });

        request.open(method, options.url, true);

        // Set custom headers
        if(options.headers || this.options.headers){
            var headers = mergeObject(this.options.headers, options.headers);
            for(var header in headers)
                if(headers.hasOwnProperty(header))
                    request.setRequestHeader(header, headers[header]);   
        }

        request.send(options.data);

        return request;
    };

    // Parse HTTP response
    Reqx.prototype.parseResponse = function(body, format){
        if(format.endsWith('json')) return JSON.parse(body);
        if(format.endsWith('xml')){
            var parser = getXMLParser();
            return parser.parseFromString(body, format);
        }
        return body;
    };

    // Parse raw headers
    Reqx.prototype.parseHeaders = function(raw){
        var out = {};
        var headers = raw.split(LINE_RETURN_REGEX);
        var length = headers.length;
        for(var i = 0; i < length; i++){
            var header = headers[i].match(HEADER_REGEX);
            out[header[1].toLowerCase()] = header[2];
        }
        return out;
    };

    // Define HTTP methods
    Reqx.prototype.defineMethod = function(method){
        this[method.toLowerCase()] = function(url, data, callback){
            this.request({url: url, data: data}, function(err, body, req){
                if(err) return callback(err);
                var headers = this.parseHeaders(req.getAllResponseHeaders());
                var content_type = ['content-type'];
                if(this.parse && content_type) body = this.parseResponse(body, content_type);
                callback(null, body);
            });
            return this;
        };
    };

    // Default options
    Reqx.prototype.defaults = {
        method: 'GET',
        //json: false,
        parse: true,
        //redirects: true
    };

    // Export to window
    w.Reqx = Reqx;
})(window);
