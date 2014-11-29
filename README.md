Client-Express
==============

A lightweight library for simplifying jQuery AJAX calls while emulating the use of Express module for Node.js with built in synchronous and asynchronous request handlers.

Examples
==============

Basic use of .get()
```
// Store express in variable to avoid colisions when dealing with other request chains
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
// Store express in variable to avoid colisions when dealing with other request chains
var Request = Express;
Request.post('/resource', { data: 'example' }, function(err, result){
    // Handle error
    if(err) throw err;
    // Do something with result
    alert(result);
});
```

Chaining
```
Request.post('/stats', { 'auth': 'authorization-key' }, function(err, result){
    if(err) return alert(err);
    drawStats(result);
}).get('/template/heading.html', function(err, result){
    if(err) return alert(err);
    $('#Target').html(result);
});
```

Options

Arguments  | Required | Type 
------------- | ------------- | ------------- 
URL  | yes | string 
Data  | no | object 
Callback  | no | function 
