const TEST_DATA = {
    foo: 'bar',
    baz: 'qux'
};
const METHODS = [
    'GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'TRACE', 'OPTIONS'
];
const NOT_JSON = 'this is not JSON';

const XHR = (window.ActiveXObject ? window.ActiveXObject : window.XMLHttpRequest);

describe('Reqx.defineMethod()', function(){
    it('should attach method to prototype', function(){
        Reqx.defineMethod('TEST');
        expect(Reqx.prototype.test).to.be.a('function');
    });
});
describe('Reqx.getXHR()', function(){
    it('should return XHR object', function(){
        var xhr = Reqx.getXHR();
        expect(xhr).to.be.an.instanceof(XHR);
    });
    it('should return ActiveXObject', function(){
        window.ActiveXObject = function(){};
        var xhr = Reqx.getXHR();
        expect(xhr).to.be.an.instanceof(window.ActiveXObject);
        delete window.ActiveXObject;
    });
});
describe('Reqx.preparePayload()', function(){
    it('should add query string to URL', function(){
        var opts = {
            url: 'example.com',
            method: 'GET',
            data: TEST_DATA
        };
        Reqx.preparePayload(opts);
        var parsed = Reqx.parseQueryString(opts.url);
        expect(parsed.foo).to.equal('bar');
        expect(parsed.baz).to.equal('qux');
    });
    it('should convert form element to FormData object', function(){
        var opts = {
            method: 'POST',
            data: document.createElement('form'),
            mode: 'form'
        };
        Reqx.preparePayload(opts);
        expect(opts.data).to.be.an.instanceof(FormData);
    });
    it('should convert object to FormData object', function(){
        var opts = {
            method: 'POST',
            data: TEST_DATA,
            mode: 'form'
        };
        Reqx.preparePayload(opts);
        expect(opts.data).to.be.an.instanceof(FormData);
    });
    it('should convert object to JSON string', function(){
        var opts = {
            method: 'POST',
            data: TEST_DATA,
            mode: 'json'
        };
        Reqx.preparePayload(opts);
        expect(opts.data).to.be.a('string');
        var parsed = JSON.parse(opts.data);
        expect(parsed).to.be.a('object');
        expect(parsed.foo).to.equal('bar');
        expect(parsed.baz).to.equal('qux');
    });
    it('should convert object to query string', function(){
        var opts = {
            method: 'POST',
            data: TEST_DATA,
            mode: 'urlencoded'
        };
        Reqx.preparePayload(opts);
        expect(opts.data).to.be.a('string');
        var parsed = Reqx.parseQueryString(opts.data);
        expect(parsed.foo).to.equal('bar');
        expect(parsed.baz).to.equal('qux');
    });

});
describe('Reqx.parseResponse()', function(){
    it('fail to parse JSON', function(){
        var xhr = new XHRMock({
            headers: {
                'Content-Type': 'application/json'
            },
            responseText: NOT_JSON
        });
        var parsed = Reqx.parseResponse(xhr);
        expect(parsed).to.equal(NOT_JSON);
    });
    it('should detect and parse json', function(){
        var xhr = new XHRMock({
            headers: {
                'Content-Type': 'application/json'
            },
            responseText: JSON.stringify(TEST_DATA)
        });
        var parsed = Reqx.parseResponse(xhr);
        expect(parsed).to.be.a('object');
        expect(parsed.foo).to.equal('bar');
        expect(parsed.baz).to.equal('qux');
    });
    it('should return text', function(){
        var xhr = new XHRMock({
            responseText: 'text'
        });
        var parsed = Reqx.parseResponse(xhr);
        expect(parsed).to.be.a('string');
        expect(parsed).to.equal('text');
    });
    it('should return xml', function(){
        var parser = new DOMParser();
        var doc = parser.parseFromString('<test><val>test</val></test>', 'application/xml');
        var xhr = new XHRMock({
            responseXML: doc
        });
        var parsed = Reqx.parseResponse(xhr);
        expect(parsed).to.equal(doc);
    });
});
describe('Reqx.parseHeaders()', function(){
    it('should parse raw headers and return an object', function(){
        var parsed = Reqx.parseHeaders('foo:bar\nbaz:qux');
        expect(parsed.foo).to.equal('bar');
        expect(parsed.baz).to.equal('qux');
    });
});
describe('Reqx.parseQueryString()', function(){
    it('should parse query string with 1 item', function(){
        var parsed = Reqx.parseQueryString('?foo=bar');
        expect(parsed.foo).to.equal('bar');
    });
    it('should parse query string with 2 items', function(){
        var parsed = Reqx.parseQueryString('?foo=bar&baz=qux');
        expect(parsed.foo).to.equal('bar');
        expect(parsed.baz).to.equal('qux');
    });
});
describe('Reqx.setHeaders()', function(){
    it('should set headers on XHR object', function(){
        var xhr = new XHRMock();
        Reqx.setHeaders(xhr, {foo: 'bar', baz: 'qux'});
        var parsed = Reqx.parseHeaders(xhr.getAllResponseHeaders());
        expect(parsed.foo).to.equal('bar');
        expect(parsed.baz).to.equal('qux');
    });
});
describe('Reqx.toFormData()', function(){
    it('should convert object to FormData object', function(){
        var data = Reqx.toFormData(TEST_DATA);
        expect(data).to.be.an.instanceof(FormData);
    });
});
describe('Reqx.toQueryString()', function(){
    it('should convert object to query string', function(){
        var qs = Reqx.toQueryString(TEST_DATA);
        var parsed = Reqx.parseQueryString(qs);
        expect(parsed.foo).to.equal('bar');
        expect(parsed.baz).to.equal('qux');
    });
});
describe('Reqx()', function(){
    it('should overwrite options', function(){
        var r = new Reqx({method: 'POST', mode: 'xml'});
        expect(r.opts.method).to.equal('POST');
        expect(r.opts.mode).to.equal('xml');
    });
    it('should add headers', function(){
        var r = new Reqx({
            headers: {
                foo: 'bar'
            }
        });
        expect(r.opts.headers.foo).to.equal('bar');
    });
    it('should have standard methods', function(){
        var r = new Reqx();
        for(var i = 0; i < METHODS.length; i++) expect(r[METHODS[i].toLowerCase()]).to.be.a('function');
    });
});
/*
TODO needs mock to test properly
describe('Reqx().request()', function(){
    it('should return string', function(done){
        var r = new Reqx();
        r.request({
            method: 'GET',
            url: 'https://httpbin.org/get'
        }, function(err, result){
            if(err) return done(err);
            expect(result).to.be.a('string');
            done();
        });
    });
});

describe('Reqx().get()', function(){
    it('should return connection error', function(done){
        var r = new Reqx();
        r.get('http://fuck fuck fuck', function(err, result){
            expect(err).to.be.an('object');
            done();
        });
    });
    it('should return HTTP error', function(done){
        var r = new Reqx();
        r.get('https://httpbin.org/post', function(err, result){
            expect(err).to.be.an('string');
            done();
        });
    });
    it('should accept 2 arguments', function(done){
        var r = new Reqx();
        r.get('https://httpbin.org/get', function(err, result){
            if(err) return done(err);
            expect(result).to.be.a('object');
            done();
        });
    });
    it('should accept 2 arguments', function(done){
        var r = new Reqx();
        r.get('https://httpbin.org/get', function(err, result){
            if(err) return done(err);
            expect(result).to.be.a('object');
            done();
        });
    });
    it('should accept 3 arguments and create query string', function(done){
        var r = new Reqx();
        r.get('https://httpbin.org/get', {foo: 'bar'}, function(err, result){
            if(err) return done(err);
            expect(result).to.be.a('object');
            expect(result.args.foo).to.equal('bar');
            done();
        });
    });
});
*/
function XHRMock(opts){
    opts = opts || {};
    opts.headers = opts.headers || {};
    this.getAllResponseHeaders = function(){
        var headers = '';
        for(var header in opts.headers){
            if(headers) headers += '\n';
            headers += (header + ': ' + opts.headers[header]);
        }
        return headers;
    };

    this.setRequestHeader = function(key, val){
        opts.headers[key] = val;
    };

    this.responseText = opts.responseText;
    this.responseXML = opts.responseXML;
}