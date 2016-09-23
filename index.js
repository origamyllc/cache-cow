const redis = require("./src/redisEngine.js");
const memory = require("./src/memoryEngine.js");
module.exports = memory;
if ( process.env.CACHE_TYPE &&  process.env.CACHE_TYPE === "redis" ){
    module.exports = redis;
}




