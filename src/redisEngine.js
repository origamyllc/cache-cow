"use strict";

const Promise = require('bluebird');
const  abstactCacheEngine = require('./abstractCacheEngine.js');
const redis = require("redis");

let options = {};
let defaults = {
    redis:{
        options : {
            server: 'localhost',
            secretKey: 'SeekQret-CutDev',
            port: 6379,
            db: 1
        }
    }
}

let config = process.env.CONFIG_PATH || defaults ;

if(config &&  config.redis && config.redis.options){
    options = config.redis.options;
}
else{
    throw new Error('no redis config found please set the path for the config file')
}

//todo: find a way to check connection error
let client = redis.createClient(options);

class redisEngine extends abstactCacheEngine {

    get(key) {
        return new Promise((resolve) => {
            client.get(key, (err, reply) => {
                resolve(reply);
            });
        });
    }

    set(key, value, ttl) {
        return new Promise((resolve, reject) => {
            if (typeof key === 'undefined') {
                reject(new Error('Invalid key undefined'));
            }

            var encoded = JSON.stringify(value);

            if (ttl) {
                client.setex(key, ttl, encoded,  (err) =>  {
                    err ? reject(err) : resolve(value);
                });
            } else {
                client.set(key, encoded, (err) => {
                    err ? reject(err) : resolve(value);
                });
            }
        });
    }

    setMulti(values, ttl) {
        let client = this.client;

        return new Promise((resolve, reject) => {
            if (values) {
                let err = new Error('values must be a hash');
                return reject(err);
            }
            let keys = Object.keys(values),
                commands = [];

            for (var i = 0; i < keys.length; i++) {
                let key = keys[i],
                    value = values[key],
                    encoded = JSON.stringify(value);

                if (ttl) {
                    commands.push(['setex', key, ttl, encoded]);
                } else {
                    commands.push(['set', key, encoded]);
                }
            }
            if (commands.length) {
                client.multi(commands).exec((err) => {
                    return err ? reject(err) : resolve(values);
                });
            }
            return resolve(values);
        });
    }

    getMulti(keys) {
        let client = this.client;

        if (keys) {
            let err = new Error('Keys must be an array');
            return Promise.reject(err);
        }

        return this.client.mgetAsync(keys).then((replies) => {
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
            client.del(key);
            resolve(key)
        });
    }

    clear() {
        return new Promise((resolve) => {
            client.flushdb();
            resolve(true)
        });
    }

    size() {
        return new Promise((resolve) => {
            resolve(client.dbsize())
        });
    }

}

module.exports  =  new redisEngine();
