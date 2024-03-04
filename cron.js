const redisClient = require('./redis');
const redisHelper = new redisClient();

const cron = require('node-cron');

const RouteHandler = require('./route-handler');
const routeHandler = new RouteHandler();


const cronJob = cron.schedule('0 * * * *', async () => {

    const data = await routeHandler.getBestSeller(); // Call the function to fetch new data
    console.log('sai');

    await redisHelper.setKey('bestseller', JSON.stringify(data), -1); // Cache for 1 hour
    console.log('Best-seller data updated.');
});

cronJob.start();