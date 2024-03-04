const Hapi = require('@hapi/hapi');
const H2o2 = require('@hapi/h2o2');
const path = require('path');
const Inert = require('@hapi/inert'); // Import the 'inert' plugin

const RouteHandler = require('./route-handler');

const routeHandler = new RouteHandler();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000, // process.env.PORT
        host: 'localhost',
        "routes": {
            "cors": {
                "origin": ["https://olx-clone-r-o-le-x-35kv.vercel.app/"], // Replace with your frontend's URL
                "headers": ["Accept", "Content-Type"],
                "additionalHeaders": ["X-Requested-With"],
                "credentials": true, // If your frontend sends cookies or authentication headers
            },
        },
    });

    // Manually set up CORS headers
    server.ext('onPreResponse', (request, h) => {
        const response = request.response;

        if (response.isBoom) {
            return h.continue;
        }

        response.header('Access-Control-Allow-Origin', 'https://olx-clone-r-o-le-x-35kv.vercel.app/'); // Replace with your frontend's URL
        response.header('Access-Control-Expose-Headers', 'Authorization'); // Expose any custom headers you need
        response.header('Access-Control-Allow-Headers', '*');

        return h.continue;
    });

    await server.register(Inert);

    //register API

    server.route({
        method: 'POST',
        path: '/register',
        handler: routeHandler.register
    });

    //Login API

    server.route({
        method: 'POST',
        path: '/login',
        handler: routeHandler.login
    });

    //home page that displays all products API

    server.route({
        method: 'GET',
        path: '/products',
        handler: routeHandler.products
    });

    //post product details page for seller

    server.route({
        method: 'POST',
        path: '/product',
        handler: routeHandler.product
    });


    //API to display specific product details

    server.route({
        method: 'GET',
        path: '/products/{id}',
        handler: routeHandler.specificproduct
    });

    //API to place BID

    server.route({
        method: 'POST',
        path: '/bid/{pid}',
        handler: routeHandler.placeBid
    });

    //API that shows buy history for user

    server.route({
        method: 'GET',
        path: '/bid/history',
        handler: routeHandler.showBidHistory
    });

    //API that shows sell history for user

    server.route({
        method: 'GET',
        path: '/sell/history',
        handler: routeHandler.showSellHistory
    });

    //API to cancel bid

    server.route({
        method: 'DELETE',
        path: '/bid/cancel/{bidid}',
        handler: routeHandler.cancelBid
    });

    //API to delete product posts

    server.route({
        method: 'DELETE',
        path: '/product/cancel/{pid}',
        handler: routeHandler.deleteProduct
    });

    //API to update BID raised by user

    server.route({
        method: 'PUT',
        path: '/bid/update/{bidid}',
        handler: routeHandler.updateBid
    });

    //API to show all bids for a product 

    server.route({
        method: 'GET',
        path: '/allbids/{pid}',
        handler: routeHandler.showAllBids
    });

    //API to accept a bid

    server.route({
        method: 'POST',
        path: '/bid/accept/{bidid}',
        handler: routeHandler.acceptBid
    });


    //API server to check buystatus

    server.route({
        method: 'GET',
        path: '/bidstatus/{productid}',
        handler: routeHandler.checkBidStatus
    })


    //API server to check sellstatus

    server.route({
        method: 'GET',
        path: '/productstatus/{productid}',
        handler: routeHandler.checkProductStatus
    });


    //API server to show this week's best on demand products

    server.route({
        method: 'GET',
        path: '/ondemandproducts',
        handler: routeHandler.onDemandProducts
    })


    await server.start();
    console.log('Server running on', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.error('Unhandled promise rejection:', err);
    process.exit(1);
});

init();


