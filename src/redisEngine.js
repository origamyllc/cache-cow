"use strict";

const Promise = require('bluebird');
const  abstactCacheEngine = require('./abstractCacheEngine.js');
const redis = require("redis");
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

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
        return new Promise((resolve, reject) => {
           client.hmset(key,values, function (err, res) {
                    if(!err) {
                        resolve(res);
                    } else {
                        resolve(err);
                    }
                });
            return resolve(true);
        });
    }

    getMulti(keys) {
       return new Promise(function (resolve) {
           client.hget(keys, function (err, obj) {
              if(!err) {
                  resolve(obj);
              } else {
                  resolve(err);
              }
           });
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
