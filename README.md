Client-Express
==============

A lightweight library for simplifying jQuery AJAX calls while emulating the use of Express module for Node.js with built in synchronous and asynchronous request handlers.

Examples
==============

Basic use of .get()
```
// Store express in variable to avoid colisions when dealing with other request chains
var Request = Express;
Express.get('/resource', function(err, result){
    // Handle error
    if(err) throw err;
    // Do something with result
    alert(result);
});
```

basic use of .post()
```
// Store express in variable to avoid colisions when dealing with other request chains
var Request = Express;
Express.post('/resource', { data: 'example' }, function(err, result){
    // Handle error
    if(err) throw err;
    // Do something with result
    alert(result);
});
```

post() and get() arguments

First Header  | Second Header | Third Heading 
------------- | ------------- | ------------- 
Content Cell  | Content Cell | Content Cell 
Content Cell  | Content Cell | Content Cell 
