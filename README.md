AJAX-Express
==============

A lightweight library for simplifying jQuery AJAX calls while emulating the syntax of Express module for Node.js with built in synchronous and asynchronous request handlers.

Examples
==============

Basic use of .get()
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

Basic use of .post()
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

Syncronis request
```javascript
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
```javascript
var Request = Express;
Request.get('/resource', function(err, result){
    // Handle error
    if(err) return alert(err);
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
```javascript
var Request = Express;
Request.post('/resource', { data: 'example' }, function(err, result){
    // Handle error
    if(err) return alert(err);
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
```javascript
var Request = Express;
Express.ajax('/resource', 'GET', { data: 'example' }, function(err, result){
    // Handle error
    if(err) return alert(err);
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

Express.error(callback);
--------------

Create error callback on chained request(s)

Arguments  | Required | Type 
------------- | ------------- | ------------- 
Callback  | yes | function 

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
