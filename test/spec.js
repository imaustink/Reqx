const TEST_DATA = {
    foo: 'bar',
    baz: 'qux'
};

describe('Reqx()', function(){
    it('should overwrite options', function(){
        var r = new Reqx({method: 'POST', mode: 'xml'});
        expect(r.options.method).to.equal('POST');
        expect(r.options.mode).to.equal('xml');
    });
});
describe('.defineMethod()', function(){
    it('should attach method to prototype', function(){
        Reqx.defineMethod('TEST');
        expect(Reqx.prototype.test).to.be.a('function');
    });
});
describe('.getXHR()', function(){
    it('should return XHR object', function(){
        var xhr = Reqx.getXHR();
        if(window.ActiveXObject) expect(xhr).to.be.an.instanceof(ActiveXObject);
        else expect(xhr).to.be.an.instanceof(XMLHttpRequest);
    });
});
describe('.preparePayload()', function(){
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
describe('.parseResponse()', function(){
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
});
describe('.parseHeaders()', function(){
    it('should parse raw headers and return an object', function(){
        var parsed = Reqx.parseHeaders('foo:bar\nbaz:qux');
        expect(parsed.foo).to.equal('bar');
        expect(parsed.baz).to.equal('qux');
    });
});
describe('.parseQueryString()', function(){
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
describe('.setHeaders()', function(){
    it('should set headers on XHR object', function(){
        var xhr = new XHRMock();
        Reqx.setHeaders(xhr, {foo: 'bar', baz: 'qux'});
        var parsed = Reqx.parseHeaders(xhr.getAllResponseHeaders());
        expect(parsed.foo).to.equal('bar');
        expect(parsed.baz).to.equal('qux');
    });
});
describe('.toFormData()', function(){
    it('should convert object to FormData object', function(){
        var data = Reqx.toFormData(TEST_DATA);
        expect(data).to.be.an.instanceof(FormData);
    });
});
describe('.toQueryString()', function(){
    it('should convert object to query string', function(){
        var qs = Reqx.toQueryString(TEST_DATA);
        var parsed = Reqx.parseQueryString(qs);
        expect(parsed.foo).to.equal('bar');
        expect(parsed.baz).to.equal('qux');
    });
});


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
}