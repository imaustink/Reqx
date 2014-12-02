// Client Express beta 1
// Request class
var Express = function(){};
// Constructor
(function(){
    // Global scope this
    var _self = this;
    // Pending request counter
    var count = 0;
    // Errors
    var errors = [];
    // synchronous request queue
    var synchronous_queue = [];
    // Version
    this.version = 'Alpha '+1.0;
    // Config
    this.config = {};
    // Request started
    var start = function () {
        // Incriment pending reqest counter
        count++;
    }
    // Request done
    var done = function (err) {
        // Decrement pending reqest counter
        count--;
        // Had an error
        if(err){
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
            if(_self.callback && synchronous_queue.length < 1){
                // No errors, set to null for easy checking
                if(errors.length < 1) errors = null;
                // Callback
                _self.callback(errors);
                // Reset callback for next request
                _self.callback = null;
                // Reset errors
                errors = [];
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
    // Done callback setter
    this.done = function(callback){
        if(typeof callback !== 'function') return console.warn('Express.done() only accepts functions');
        _self.callback = callback;
        return this;
    }
    // Error callback setter
    this.error = function(callback){
        if(typeof callback !== 'function') return console.warn('Express.errors() only accepts functions');
        _self.error_callback = callback;
        return this;
    }
    // Ajax handler
    this.ajax = function (url, method, data, callback) {
        // synchronous mode
        if(_self.config.sync && count > 0){
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
        start();
        // Make request
        $.ajax({
            url: url,
            cache: _self.config.cache || false,
            type: method || _self.config.default_method || 'GET',
            data: data || {}
        }).done(function(result) {
            // Success
            if(callback) callback(null, result);
            done();
        }).error(function(jqXHR, status, message){
            // Fail
            if(callback) callback(jqXHR);
            done(jqXHR);
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
    // POST handler
    this.post = function(url, data, callback){
        if(!data){
            callback = data;
            data = undefined;
        }
        this.ajax(url, 'POST', data, callback);
        return this;
    };
}).call(Express);