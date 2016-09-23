const redis = require("./redisEngine.js");
const memory = require("./memoryEngine.js");
module.exports = memory;
if ( process.env.CACHE_TYPE &&  process.env.CACHE_TYPE === "redis" ){
    module.exports = redis;
}




