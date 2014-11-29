// Express class
var Express = function(){};
// Constructor
(function(){
    // Global scope this
    var _self = this;
    // Pending request counter
    var count = 0;
    // Errors
    var errors = [];
    // Syncronis request queue
    var syncronis_queue = [];
    // Request started
    var start = function () {
        // Incriment pending reqest counter
        count++;
    }
    // Request done
    var done = function (err) {
        // Decrement pending reqest counter
        count--;
        // Save error
        if(err) errors.push(err);
        // Last request
        if(count == 0){
            // Call next incase this is synchronous
            next();
            // Done callback
            if(_self.done){
                // No errors, set to null for easy checking
                if(errors.length < 1) errors = null;
                // Callback
                _self.done(errors);
                // Reset errors
                errors = [];
            }
        } 
    }
    // Next synchronous request
    var next = function(){
        // No more requests
        if(syncronis_queue.length < 1) return;
        // Next request
        var req = syncronis_queue[0];
        // Remove that from the list
        syncronis_queue.splice(0, 1);
        // Call next request
        _self.ajax(req.url, req.method, req.data, req.callback);
    }
    // Config
    this.config = {};
    // Ajax handler
    this.ajax = function (url, method, data, callback) {
        // Syncronis mode
        if(_self.config.sync && count > 0){
            // Objectify request
            var save = {
                url: url,
                method: method,
                data: data,
                callback: callback
            }
            // Save it for later
            syncronis_queue.push(save);
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
            if(callback) callback(message);
            done(message);
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
}).call(Request);
