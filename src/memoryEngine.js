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

    set(key, value, ttl) {
        return new Promise( (resolve, reject) => {
            if (typeof key === 'undefined') {
                reject(new Error('Invalid key undefined'));
            }

            console.log(value);

            let encoded = JSON.stringify(value);
              cache.set(key, encoded )
              resolve({key: encoded });
        });
    }

    setMulti(values, ttl) {
        let client = this.client;

        return new Promise((resolve) => {

            let keys = Object.keys(values),
                commands = [];

            for (var i = 0; i < keys.length; i++) {
                let key = keys[i],
                    value = values[key],
                    encoded = JSON.stringify(value);
                    cache.set(key,  encoded);
            }
            return resolve(values);
        });
    }

    getMulti(keys) {
        let client = this.client;

        if (!_.isArray(keys)) {
            let err = new Error('Keys must be an array');
            return Promise.reject(err);
        }

        return this.client.mgetAsync(keys).then(function (replies) {
            let results = {};
            for (let i = 0; i < replies.length; i++) {
                let key = keys[i],
                    value,
                    encoded = replies[i];

                if (typeof encoded === 'undefined') {
                    value = undefined;
                } else {
                    try {
                        value = JSON.parse(encoded);
                    } catch (err) {
                        value = undefined;
                    }
                }
                results[key] = value;
            }
            return results;
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
