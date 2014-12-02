AJAX-Express
==============

A lightweight library for simplifying jQuery AJAX calls while emulating the syntax of Express module for Node.js with built in synchronous and asynchronous request handlers.

Examples
==============

Basic use of .get()
```
// Store express in variable to avoid collisions when dealing with other request chains
var Request = Express;
Request.get('/resource', function(err, result){
    // Handle error
    if(err) throw err;
    // Do something with result
    alert(result);
});
```

Basic use of .post()
```
// Store express in variable to avoid collisions when dealing with other request chains
var Request = Express;
Request.post('/resource', { data: 'example' }, function(err, result){
    // Handle error
    if(err) throw err;
    // Do something with result
    alert(result);
});
```

Chaining requests with a done callback
```
// Store express in variable to avoid collisions when dealing with other request chains
var Request = Express;
Request.post('/stats', { 'auth': 'authorization-key' }, function(err, result){
    // handle error
    if(err) return alert(err);
    // Send response to handler
    drawStats(result);
}).get('/template/heading.html', function(err, result){
    // Handle error
    if(err) return alert(err);
    // Append response to target
    $('#Target').html(result);
}).done(function(err){
    $('#Conatainer').show();
});
```

Syncronis request
```
// Store express in variable to avoid collisions when dealing with other request chains
var Request = Express;
Request.config.sync = true;
Request.post('/test').get('/test').post('/test').get('/test').post('/test').get('/test');
```
When ```Request.config.sync``` is set to ```true``` each request in the chain will be handled synchronously.

Docs
==============

Express.post(url, data, callback);
--------------

Make a post request.

Arguments  | Required | Type 
------------- | ------------- | ------------- 
URL  | no | string 
Data  | no | object 
Callback  | no | function 

Example:
```
var Request = Express;
Request.get('/resource', function(err, result){
    // Handle error
    if(err) throw err;
    // Do something with result
    alert(result);
});
```

Express.get(url, data, callback);
--------------

Make a get request.

Arguments  | Required | Type 
------------- | ------------- | ------------- 
URL  | no | string 
Data  | no | object 
Callback  | no | function 

Example:
```
// Store express in variable to avoid collisions when dealing with other request chains
var Request = Express;
Request.post('/resource', { data: 'example' }, function(err, result){
    // Handle error
    if(err) throw err;
    // Do something with result
    alert(result);
});
```

Express.ajax(url, method, data, callback);
--------------

Make an AJAX request.

Arguments  | Required | Type | default 
------------- | ------------- | ------------- | ------------- 
URL  | no | string | ```window.location.href``` 
Method  | no | string | ```'GET'``` 
Data  | no | object | ```{}``` 
Callback  | no | function | ```null```

Example:
```
var Request = Express;
Express.ajax('/resource', 'GET', { data: 'example' }, function(err, result){
    // Handle error
    if(err) throw err;
    // Do something with result
    alert(result);
});
```

Express.done(callback);
--------------

Create done callback on chained request(s)

Arguments  | Required | Type 
------------- | ------------- | ------------- 
Callback  | yes | function 

Example:
```
// Store express in variable to avoid collisions when dealing with other request chains
var Request = Express;
Request.post('/resource', { data: 'example' }, function(err, result){
    if(err) throw err;
    handleResult(result);
}).get('/template', function(err, result){
    if(err) throw err;
    append(result);
}).done(function(errors){
    if(error) return handleErrors(errors);
    $('#Template').show();
});
```

Express.error(callback);
--------------

Create error callback on chained request(s)

Arguments  | Required | Type 
------------- | ------------- | ------------- 
Callback  | yes | function 

Example:

```
// Store express in variable to avoid collisions when dealing with other request chains
var Request = Express;
Request.post('/resource', { data: 'example' }, function(err, result){
    if(err) throw err;
    handleResult(result);
}).get('/template', function(err, result){
    if(err) throw err;
    append(result);
}).error(function(err){
    handleError(err);
}).done(function(){
    $('#Template').show();
});
```
