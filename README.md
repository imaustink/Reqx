# Reqx
[![Build Status](https://travis-ci.org/imaustink/Reqx.svg?branch=master)](https://travis-ci.org/imaustink/Reqx)

A simple and lightweight AJAX request handler.

## Example
```javascript
var r = new Reqx();
r.get('https://httpbin.org/get', function(err, result){
    if(err) return console.error(err);
    console.log(result);
});
```
## Instance Methods
### .request()
Create a new XML HTTP request.
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
### .get(), .head(), .post(), .put(), .patch(), .delete(), .trace(), .options()
A method that wraps ```.request()``` for each standard HTTP methods are attached to Reqx's prototype by default.
```javascript
var r = new Reqx();
r.post('https://httpbin.org/post', {name: 'Bob'}, function(err, result){
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