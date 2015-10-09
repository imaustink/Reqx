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
        config.accepts = 'json';
    }
    // Default to GET
    if(!config.default_method) config.default_method = 'GET';
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
        };
        // synchronous mode
        if(config.sync && count > 0){
            // Objectify request
            var save = {
                url: url,
                method: method,
                data: data,
                callback: callback
            };
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
        if(config.json == true && typeof data === 'object' && method !== 'GET') data = JSON.stringify(data);
        start();
        // Make request
        $.ajax({
            url: url,
            cache: config.cache || true,
            type: method || config.default_method,
            data: data || {},
            dataType: config.dataType,
            contentType: config.contentType,
            accepts: config.accepts
        }).done(function(result) {
            // Success
            if(callback) callback(null, result, again);
            done();
        }).error(function(jqXHR, status, message){
            // Fail
            if(callback) callback(jqXHR, null, again);
            done(jqXHR);
        });
        return this;
    };
    // GET handler
    this.get = function(url, data, callback){
        if(!data){
            callback = data;
            data = undefined;
        }
        this.ajax(url, 'GET', data, callback);
        return this;
    };
    // POST handler
    this.post = function(url, data, callback){
        if(!data){
            callback = data;
            data = undefined;
        }
        this.ajax(url, 'POST', data, callback);
        return this;
    };
    // PUT handler
    this.put = function(url, data, callback){
        if(!data){
            callback = data;
            data = undefined;
        }
        this.ajax(url, 'PUT', data, callback);
        return this;
    };
    return this;
};