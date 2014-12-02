AJAX-Express
==============

A lightweight library for simplifying jQuery AJAX calls while emulating the syntax of Express module for Node.js with built in synchronous and asynchronous request handlers.

Examples
==============

Make a GET request
--------------
```javascript
// Store express in variable to avoid collisions when dealing with other request chains
var Request = Express;
// Start GET request
Request.get('/resource', function(err, result){
    // Check for error
    if(err) return alert(err);
    // Alert response
    alert(result);
});
```

Make a POST request
--------------
```javascript
var Request = Express;
// Start POST request
Request.post('/resource', { data: 'example' }, function(err, result){
    // Check for error
    if(err) return alert(err);
    // Alert response
    alert(result);
});
```

Chaining requests with a done callback
--------------
```javascript
var Request = Express;
// Start a POST request
Request.post('/stats', { 'auth': 'authorization-key' }, function(err, result){
    if(err) return;
    drawStats(result);
// Start a GET request
}).get('/template/heading.html', function(err, result){
    if(err) return;
    $('#Target').html(result);
// Setup done callback
}).done(function(errors){
    // Check errors array
    if(errors) return handleErrors(errors);
    // Do something when it's all done
    $('#Conatainer').show();
});
```

Synchronous request
--------------
```javascript
var Request = Express;
// Setup synchronous mode
Request.config.sync = true;
Request.post('/stats', { 'auth': 'authorization-key' }, function(err, result){
    if(err) return;
    drawStats(result);
// Start a GET request
}).get('/template/heading.html', function(err, result){
    if(err) return;
    $('#Target').html(result);
// Setup done callback
}).done(function(errors){
    // Check errors array
    if(errors) return handleErrors(errors);
    // Do something when it's all done
    $('#Conatainer').show();
});
```
When javascriptRequest.config.sync is set to true each request in the chain will be handled synchronously.

Docs
==============

Express.post()
--------------

.post() is a simple POST request handler designed to be easy and fast to program, much like .get().

Arguments  | Required | Type 
------------- | ------------- | ------------- 
URL  | no | string 
Data  | no | object 
Callback  | no | function 
```javascript
Express.post(url, data, callback);
```

Example:
```javascript
var Request = Express;
Request.get('/resource', function(err, result){
    // Handle error
    if(err) return alert(err);
    // Do something with result
    alert(result);
});
```

Express.get();
--------------

.get() is a simple GET request handler designed to be easy and fast to program, much like .post().

Arguments  | Required | Type 
------------- | ------------- | ------------- 
URL  | no | string 
Data  | no | object 
Callback  | no | function 
```javascript
Express.get(url, data, callback);
```

Example:
```javascript
var Request = Express;
Request.post('/resource', { data: 'example' }, function(err, result){
    // Handle error
    if(err) return alert(err);
    // Do something with result
    alert(result);
});
```

Express.ajax();
--------------

.ajax is versatile request handler designed to be more programmable and support all methods, a little more advanced than .post() or .get().

Arguments  | Required | Type | default 
------------- | ------------- | ------------- | ------------- 
URL  | no | string | window.location.href 
Method  | no | string | 'GET' 
Data  | no | object | {} 
Callback  | no | function | null
```javascript
Express.ajax(url, method, data, callback);
```

Example:
```javascript
var Request = Express;
Express.ajax('/resource', 'GET', { data: 'example' }, function(err, result){
    // Handle error
    if(err) return alert(err);
    // Do something with result
    alert(result);
});
```

Express.done();
--------------
.done() is a callback setter ready to attach to any request chain.

Arguments  | Required | Type 
------------- | ------------- | ------------- 
Callback  | yes | function 
```javascript
Express.done(callback);
```

Example:
```javascript
var Request = Express;
Request.post('/resource', { data: 'example' }, function(err, result){
    if(err) return alert(err);
    handleResult(result);
}).get('/template', function(err, result){
    if(err) return alert(err);
    append(result);
}).done(function(errors){
    if(error) return handleErrors(errors);
    $('#Template').show();
});
```

Express.error();
--------------

.error() is a error callback setter ready to attach to any request chain.

Arguments  | Required | Type 
------------- | ------------- | ------------- 
Callback  | yes | function 
```javascript
Express.error(callback);
```

Example:
```javascript
var Request = Express;
Request.post('/resource', { data: 'example' }, function(err, result){
    if(err) return alert(err);
    handleResult(result);
}).get('/template', function(err, result){
    if(err) return alert(err);
    append(result);
}).error(function(err){
    handleError(err);
}).done(function(){
    $('#Template').show();
});
```
