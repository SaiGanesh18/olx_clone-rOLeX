//Redis
const redis = require('redis');
const redisURL = process.env.REDIS_URL || 'redis://localhost:6379'; // Use localhost as a fallback for local development
const redisclient = redis.createClient(redisURL);

redisclient.connect().then(() => {
    console.log("Connection to redis established")
})

class Redis {
    constructor() {

    }

    async setKey(key, value, exp = 0) {
        await redisclient.setEx(key, 3600, JSON.stringify(value));
    }

    async getKey(key) {
        let cacheData = await redisclient.get(key);

        return JSON.parse(cacheData);
    }

    async del(key) {
        await redisclient.del(key);
    }

}

module.exports = Redis;