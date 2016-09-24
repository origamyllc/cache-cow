'use strict';


/**
 * Created by prashun on 9/16/16.
 */
const Promise = require('bluebird');
const  abstactCacheEngine = require('./abstractCacheEngine.js');
const LRUCache = require('lru-cache');


let options = {};

let defaults = {
    lru:{
        options : {
            max: 500,
            maxAge: 1000 * 60 * 60
        }
    }
}


let config = process.env.CONFIG_PATH || defaults ;

if(config &&  config.lru && config.lru.options){
    options = config.lru.options;
}
else{
    throw new Error('no redis config found please set the path for the config file')
}

const cache = LRUCache( options );

class memoryEngine extends abstactCacheEngine {

    get(key) {
        return new Promise((resolve) => {
           resolve(cache.get(key));
        });
    }

    set(key, value) {
        return new Promise( (resolve, reject) => {
            if (typeof key === 'undefined') {
                reject(new Error('Invalid key undefined'));
            }

            let encoded = JSON.stringify(value);
              cache.set(key, encoded )
              resolve({key: encoded });
        });
    }

    setMulti(values) {
        let client = this.client;

        return new Promise((resolve) => {

            for (var i = 0; i < values.length; i++) {
                let obj = values[i],
                    key = Object.keys(obj),

                    encoded = JSON.stringify(obj[key[0]]);
                    cache.set(key[0], encoded);
            }

            return resolve(values);
        });
    }

    getMulti(keys) {
        let results =[];
        return new Promise((resolve) => {
            for (var i = 0; i < keys.length; i++) {
                let key = keys[i];
                let val = cache.get(key)
                results.push(val)
            }
            return resolve(results);
        });
    }

    delete(key) {
        return new Promise((resolve) => {
            cache.del(key);
            resolve(key)
        });
    }

    clear() {
        return new Promise((resolve) => {
            cache.reset();
            resolve(true)
        });
    }

    size() {
        console.log("sizze");
    }

}

module.exports  =  new memoryEngine();
