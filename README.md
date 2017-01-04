# Reqx
[![Build Status](https://travis-ci.org/imaustink/Reqx.svg?branch=master)](https://travis-ci.org/imaustink/Reqx)

A simple and lightweight AJAX request handler with no dependencies.

This library is a wrapper for the XHR (XMLHttpRequest) object in browsers to simplify using it with a clean and uniform interface.

## Examples
### Simple JSON GET
Reqx default's to [```mode:'json'```](#options), which will set JSON headers and parse the response accordingly.
```javascript
var r = new Reqx();
r.get('https://httpbin.org/get', function(err, result){
    if(err) return console.error(err);
    console.log(result);
});
```

### Form POST
When the [```mode:'form'```](#options) option is set, Reqx will accept a ```<form>``` element as it's second argument and it will set form headers.
```javascript
var someForm = document.getElementById('someForm');
var r = new Reqx({mode: 'form'});
r.post('https://httpbin.org/post', someForm, function(err, result){
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
}, function(err, result){
    if(err) return console.error(err);
    console.log(result);
});
```
### .get(String[, Object], Callback)
```javascript
var r = new Reqx();
r.get('https://httpbin.org/get', {foo: 'bar'}, function(err, result){
    if(err) return console.error(err);
    console.log(result);
});
```
### .post(String[, Object], Callback)
```javascript
var r = new Reqx();
r.post('https://httpbin.org/post', {foo: 'bar'}, function(err, result){
    if(err) return console.error(err);
    console.log(result);
});
```
### .get(), .post(), .head(), .put(), .patch(), .delete(), .trace(), .options()
| Argument | Type           | Description                              | Required |
|----------|----------------|------------------------------------------|----------|
| First    | ```String```   | Request URL                              | Yes      |
| Second   | ```Object```   | Request payload                          |  No      |
| Last     | ```Function``` | Callback with error and result arguments | Yes      |

## Static Methods
### .defineMethod()
Create new request method for any desired HTTP method.

```javascript
Reqx.defineMethod('MERGE');
var r = new Reqx();
r.merge('https://httpbin.org/post', {name: 'Bob'}, function(err, result){
    if(err) return console.error(err);
    console.log(result);
});
```
### .getXHR()
Returns new XHR object applicable to the browser.

### .preparePayload()
Takes an options object as it's argument and prepares it's data payload to be sent via XHR.

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

### .toFormData()
Takes an object as it's first argument and returns FormData object.
### .toQueryString()
Takes an object as it's first argument and returns a URL encoded string.
## Options
## Overwrite Defaults
### Reqx.defaults
An object that stores the default options used to construct each instance of Reqx.
```javascript
Reqx.defaults.mode = 'xml';
```
### Reqx.default_headers
An object that stores default headers for each mode.
```javascript
Reqx.default_headers.xml = {
    'Content-Type': 'application/html',
    Accept: 'application/html'
};
```