/**
 * Created by prashun on 9/24/16.
 */

const assert = require('assert');
const engine = require('../src/redisEngine');
const expect = require('chai').expect;

beforeEach( () => {

});

describe('redis', function() {

    it('should set value in redis', function(done) {
        engine.set('key',JSON.stringify({val:'value'})).then((obj) =>{
            expect(obj).to.equals(JSON.stringify({val:'value'}));
        });
        done()
    });

    it('should get value in redis', function(done) {
        engine.get('key').then((value) => {
            expect(value).to.equals('"{\\"val\\":\\"value\\"}"');
        });
        done()
    });

    it('should not have value in redis if not set ', function(done) {
        engine.get('key3').then((value) => {
            expect(value).not.to.equals(JSON.stringify({val:'value'}));
            expect(value).to.equals(null);
        });
        done()
    });

    it('should set multiple values in redis  ', function(done) {
        engine.setMulti(["key", "test keys 1", "test val 1", "test keys 2", "test val 2"]).then((value) => {
            expect(value).to.equals(true);
        });
        done()
    });

    it('should get multiple values from redis ', function(done) {
       engine.getMulti(["key"]).then((val)=>{
           expect(val["key"]).to.equals(JSON.stringify({val:'value'}));
       })
        done()
    });

    it('should be able to delete a key  from  redis', function(done) {
        engine.delete('key').then((value) => {
            expect(value).to.equals('key');
        });
        done()
    });

    it('should be able to reset redis', function(done) {
        engine.clear().then((value) => {
            expect(value).to.equals(true);
        });
        done()
    });

});
