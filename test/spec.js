describe('Reqx()', function(){
    it('should overwrite options', function(){
        var r = new Reqx({method: 'POST', mode: 'xml'});
        expect(r.options.method).to.equal('POST');
        expect(r.options.mode).to.equal('xml');
    });
    it('.get() should get JSON', function(done){
        var r = new Reqx();
        r.get('https://httpbin.org/get', function(err, result){
            if(err) return done(err);
            expect(result).to.be.an('object');
            done();
        });
    });
    it('.get() should convert object to query string', function(done){
        var r = new Reqx();
        r.get('https://httpbin.org/get', {foo: 'bar'}, function(err, result){
            if(err) return done(err);
            expect(result.args.foo).to.equal('bar');
            done();
        });
    });
});
