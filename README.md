Client-Express
==============

A lightweight library for simplifying jQuery AJAX calls while emulating the use of Express module for Node.js with built in synchronous and asynchronous request handlers.

Examples
==============

Basic get repest
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
