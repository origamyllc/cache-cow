/**
 * Created by prashun on 9/24/16.
 */

const assert = require('assert');
const engine = require('../src/memoryEngine');
const expect = require('chai').expect;

beforeEach( () => {
    engine.set('key',{val:'value'});
    engine.setMulti([{key1:'key1'},{key2:'key2'}]);
})

describe('lru cache', function() {

    it('should set value in lru cache', function(done) {
        engine.set('key',{val:'value'}).then((obj) =>{
            let keys = Object.keys(obj);
            expect(keys[0]).to.equals('key');
            expect(obj[keys[0]]).to.equals(JSON.stringify({val:'value'}));
        });
        done()
    });

    it('should get value in lru cache', function(done) {
        engine.get('key').then((value) => {
            expect(value).to.equals(JSON.stringify({val:'value'}));
        });
        done()
    });

    it('should not have value in lru cache if not set ', function(done) {
        engine.get('key3').then((value) => {
            expect(value).not.to.equals(JSON.stringify({val:'value'}));
            expect(value).to.be.undefined;
        });
        done()
    });

    it('should set multiple values in lru cache  ', function(done) {
        engine.setMulti([{key1:'key1'},{key2:'key2'}]).then((value) => {
            var array = [{key1:'key1'}];
            expect(JSON.stringify(value[0])).to.equals(JSON.stringify(array[0]));
            expect(value).not.to.be.undefined;
        });
        done()
    });

    it('should get multiple values from  lru cache', function(done) {
        engine.getMulti(['key1','key2']).then((value) => {
            expect(value[0]).to.equals( '"key1"');
            expect(value).not.to.be.undefined;
            expect(value.length).to.equals(2);
        });
        done()
    });

    it('should be able to delete a key  from  lru cache', function(done) {
        engine.delete('key').then((value) => {
            expect(value).to.equals('key');
        });
        done()
    });

    it('should be able to reset  lru cache', function(done) {
        engine.clear().then((value) => {
            expect(value).to.equals(true);
        });
        done()
    });
});
