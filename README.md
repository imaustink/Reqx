# Reqx
[![Build Status](https://travis-ci.org/imaustink/Reqx.svg?branch=master)](https://travis-ci.org/imaustink/Reqx)

A simple and lightweight AJAX request handler with no dependencies.

This library is a wrapper for the XHR (XMLHttpRequest) object in browsers to simplify using it with a clean and uniform interface.

## Examples
### Simple JSON GET
Reqx default's to [```mode:'json'```](#options), which will set JSON headers and parse the response accordingly.
```javascript
var r = new Reqx();
r.get('https://httpbin.org/get', function(err, result, xhr){
    if(err) return console.error(err);
    console.log(result);
});
```

### Form POST
When the [```mode:'form'```](#options) option is set, Reqx will accept a ```<form>``` element as it's second argument and it will set form headers.
```javascript
var someForm = document.getElementById('someForm');
var r = new Reqx({mode: 'form'});
r.post('https://httpbin.org/post', someForm, function(err, result, xhr){
    if(err) return console.error(err);
    console.log(result);
});
```

## Instance Methods
### .request(Object, Callback)

```javascript
var r = new Reqx();
r.request({
    url: 'https://httpbin.org/post',
    method: 'POST',
    data: {
        name: 'Bob'
    },
    headers: {
        'X-Client': 'Reqx '+Reqx.version
    }
}, function(err, result, xhr){
    if(err) return console.error(err);
    console.log(result);
});
```
### .get(String[, Object], Callback)
The second argument will be converted to a query string.
```javascript
var r = new Reqx();
r.get('https://httpbin.org/get', {foo: 'bar'}, function(err, result, xhr){
    if(err) return console.error(err);
    console.log(result);
});
```
### .post(String[, Object], Callback)
```javascript
var r = new Reqx();
r.post('https://httpbin.org/post', {foo: 'bar'}, function(err, result, xhr){
    if(err) return console.error(err);
    console.log(result);
});
```
### .put(String[, Object], Callback)
```javascript
var r = new Reqx();
r.put('https://httpbin.org/put', {foo: 'bar'}, function(err, result, xhr){
    if(err) return console.error(err);
    console.log(result);
});
```
### .patch(String[, Object], Callback)
```javascript
var r = new Reqx();
r.patch('https://httpbin.org/patch', {foo: 'bar'}, function(err, result, xhr){
    if(err) return console.error(err);
    console.log(result);
});
```
### .delete(String[, Object], Callback)
```javascript
var r = new Reqx();
r.delete('https://httpbin.org/delete', {foo: 'bar'}, function(err, result, xhr){
    if(err) return console.error(err);
    console.log(result);
});
```
### .option(String[, Object], Callback)
```javascript
var r = new Reqx();
r.option('https://httpbin.org/', function(err, result, xhr){
    if(err) return console.error(err);
    console.log(result);
});
```
### .head(String[, Object], Callback)
```javascript
var r = new Reqx();
r.head('https://httpbin.org/', function(err, result, xhr){
    if(err) return console.error(err);
    console.log(result);
});
```
### .trace(String[, Object], Callback)
```javascript
var r = new Reqx();
r.trace('https://httpbin.org/', function(err, result, xhr){
    if(err) return console.error(err);
    console.log(result);
});
```
## Static Methods
### .defineMethod()
Create new request method for any desired HTTP method.

```javascript
Reqx.defineMethod('MERGE');
var r = new Reqx();
r.merge('https://httpbin.org/post', {name: 'Bob'}, function(err, result, xhr){
    if(err) return console.error(err);
    console.log(result);
});
```
### .getXHR()
Returns new XHR object applicable to the browser.
```javascript
var xhr = Reqx.getXHR();
xhr.open('GET', 'https://httpbin.org/get', true);
xhr.send();
```

### .preparePayload(Object)
Takes an options object as it's argument and prepares it's data payload to be sent via XHR based on the mode provided.

The following example will stringify the data object.
```javascript
var opts = {
    url: 'https://httpbin.org/get',
    method: 'POST',
    data: {
        foo: 'bar'
    },
    mode: 'json'
};
Reqx.preparePayload(opts);
var xhr = Reqx.getXHR();
xhr.open(opts.method, opts.url, true);
xhr.send(opts.data);
```
### .parseResponse()

```javascript
var r = new Reqx();
r.request({
    url: 'https://httpbin.org/get'
}, function(err, result, xhr){
    if(err) return console.error(err);
    console.log(Reqx.parseResponse(xhr));
});
```
### .parseHeaders()
Takes raw headers string as it's argument and returns an object of parsed response headers.

```javascript
var r = new Reqx();
r.request({
    url: 'https://httpbin.org/get'
}, function(err, result, xhr){
    if(err) return console.error(err);
    console.log(Reqx.parseHeaders(xhr.getAllResponseHeaders()));
});
```
### .setHeaders()
Takes an XHR object as first argument and object of headers to set as it's second argument.
```javascript
var xhr = Reqx.getXHR();
xhr.open('GET', 'https://httpbin.org/get', true);
Reqx.setHeaders(xhr, {
    'Content-Type': 'application/json'
});
xhr.send();
```

### .toFormData()
Takes an object as it's first argument and returns FormData object.
```javascript
var form = Reqx.toFormData({foo: bar});
```
### .toQueryString()
Takes an object as it's first argument and returns a URL encoded string.
```javascript
var queryString = Reqx.object({foo: bar});
```
## Options
Options for each instance of Reqx can be set like so.
```javascript
var r = Reqx({mode: 'xml'});
```
| Name            | Type          | Default      | description            |
|-----------------|---------------|--------------|------------------------|
| mode            | ```String```  | ```'json'``` | [See modes](#modes)              |
| method          | ```String```  | ```'GET'```  | Default request method |
| parse           | ```Boolean``` | ```true```   | Enable response parser |
| withCredentials | ```Boolean``` | ```false```  | Enable CORS            |
## Modes
Reqx has several modes built in, each mode sets up an instance of Reqx for a certain type of request.
### json
Sets standard JSON headers and stringifies payload.
### xml
Sets standard XML headers and stringifies payload.
### form
Sets standard url encoded headers and URL encodes the object from the data argument.

Allows request methods to accept an ```Object```,  ```<form>``` element or an instance of ```FormData``` as the data argument.
### urlencoded
Sets standard url encoded headers and URL encodes data from a provided object.

## Overwrite Defaults

### Reqx.defaults_options
An object that stores the default options used to construct each instance of Reqx.
```javascript
Reqx.defaults_options.mode = 'xml';
```
### Reqx.default_headers
An object that stores default headers for each mode.
```javascript
Reqx.default_headers.xml = {
    'Content-Type': 'application/html',
    Accept: 'application/html'
};
```