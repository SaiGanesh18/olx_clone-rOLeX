const DBAccessor = require('./db')
const dBAccessor = new DBAccessor();
const cron = require('node-cron');
const shell = require('shelljs');
const bcrypt = require('bcryptjs');

//Rabbitmq
const sendToQueue = require('./sendtoqueue');
const getFromQueue = require('./getfromqueue');

//Redis
const redisClient = require('./redis');
const redisHelper = new redisClient();

//const client = redis.createClient({
//    host: '127.0.0.1',
//   port: 6379,
//})

class RouteHandler {
    constructor() {
    }

    async register(req, res) {
        const userDetails = req.payload;

        // Insert user data
        const userData = {
            "name": userDetails.username,
            "phonenumber": userDetails.userphonenumber,
            "address": userDetails.useraddress
        };

        try {
            // Check if email already exists
            const check = await dBAccessor.checkemail(userDetails.useremail);

            if (check.rows.length > 0) {
                return res.response('Email already exists').code(401);
            }


            const emailCheckResult = await dBAccessor.insertUserData(userDetails, userData);
            sendToQueue.sendEmailToQueue(userDetails.useremail);
            getFromQueue.consumeMessagesFromQueue();

            return { message: 'Registration successful' };
        } catch (error) {
            console.error('Error during registration:', error);
            return res.response('Registration failed').code(500);
        }
    }

    async login(req, res) {
        const loginDetails = req.payload;

        try {
            // Check if email and password match
            const result = await dBAccessor.insertLoginDetails(loginDetails);

            if (result.rows.length === 0) {
                return res.response('Invalid credentials').code(401);
            }

            const passwordMatch = await bcrypt.compare(loginDetails.userpassword, result.rows[0].userpassword);


            if (passwordMatch) {

                const useremail = loginDetails.useremail; // Replace with actual user ID

                return { useremail };

            }
            return res.response('Login failed').code(500);

            //return { message: 'Login successful' };
        } catch (error) {
            console.error('Error during login:', error);
            return res.response('Login failed').code(500);
        }
    }

    //return res.JSON.parse(val)


    async products(req, res) {
        const me = this;
        try {
            const temp = req.headers.userid;
            if (!temp)
                return res.response('Unauthorized').code(401);

            /*        let val = await redisHelper.getKey(temp);
                    console.log(val);
                    if (val) {
                        console.log('saii');
                        return JSON.parse(val);
                    }
                    else {
                        console.log('it is null');
                        const data = await dBAccessor.displayProductDetails(temp);
                        console.log('saii');
                        await redisHelper.setKey(temp, JSON.stringify(data), 3600); // Cache for 1 hour
                        return data
                    }
            */
            const data = await dBAccessor.displayProductDetails(temp);
            return data;

        } catch (error) {
            console.error('Error fetching data:', error);

            return res.response('Internal server error').code(500);
        }
    }


    async product(req, res) {
        try {
            const temp = req.headers.userid;
            console.log(typeof (temp));
            const productDetails = req.payload;

            const jsonData = {
                "pname": productDetails.pname,
                "sprice": productDetails.sprice,
                "eprice": productDetails.eprice,
                "yop": productDetails.yop
            }

            if (temp) {
                return await dBAccessor.postProduct(temp, jsonData);
            }

            return res.response('Unauthorized').code(401);

        }
        catch (error) {
            console.error('Error fetching data:', error);
            return res.response('Internal server error').code(500);
        }
    }

    async specificproduct(req, res) {
        try {
            const id = req.params.id;
            console.log('hi');
            const temp = req.headers.userid;

            if (temp) {
                return await dBAccessor.getSpecificProduct(id);
            }
            return res.response('Unauthorized').code(401);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return res.response('Internal server error').code(500);
        }
    }

    async placeBid(req, res) {
        const me = this;
        try {
            const pid = req.params.pid;

            const temp = req.headers.userid;
            const data = req.headers.bidprice;


            if (!temp)
                return res.response('Unauthorized').code(401);
            // await redisHelper.del(temp);
            return await dBAccessor.raiseBid(pid, temp, data);
            // Close the Redis connection
            // client.quit();
        }

        //  if (temp) {
        //      return await dBAccessor.raiseBid(pid, temp, bidDetails);
        //  }
        // return res.response('Unauthorized').code(401);
        catch (error) {
            console.error('Error fetching data:', error);
            return res.response('Internal server error').code(500);
        }
    }

    async showBidHistory(req, res) {
        try {
            const temp = req.headers.userid;

            if (temp) {
                return await dBAccessor.bidHistory(temp);
            }
            return res.response('Unauthorized').code(401);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return res.response('Internal server error').code(500);
        }
    }

    async showSellHistory(req, res) {
        try {
            const temp = req.headers.userid;

            if (temp) {
                return await dBAccessor.sellHistory(temp);
            }
            return res.response('Unauthorized').code(401);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return res.response('Internal server error').code(500);
        }
    }

    async cancelBid(req, res) {
        try {
            const temp = req.headers.userid;
            const bidid = req.params.bidid;
            if (temp) {
                return await dBAccessor.cancelBid(bidid);
            }
            return res.response('Unauthorized').code(401);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return res.response('Internal server error').code(500);
        }
    }

    async deleteProduct(req, res) {
        try {
            const temp = req.headers.userid;
            const pid = req.params.pid;
            if (temp) {
                return await dBAccessor.deleteProduct(pid);
            }
            return res.response('Unauthorized').code(401);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return res.response('Internal server error').code(500);
        }
    }

    async updateBid(req, res) {
        try {
            console.log(req.payload);
            const bp = req.payload;
            const temp = req.headers.userid;
            const bidid = req.params.bidid;
            if (temp) {
                return await dBAccessor.updateBid(bidid, bp);
            }
            return res.response('Unauthorized').code(401);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return res.response('Internal server error').code(500);
        }
    }

    async showAllBids(req, res) {
        try {
            //console.log(req.payload);
            const temp = req.headers.userid;
            const pid = req.params.pid;
            if (temp) {
                return await dBAccessor.showAllBids(pid);
            }
            return res.response('Unauthorized').code(401);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return res.response('Internal server error').code(500);
        }
    }

    async acceptBid(req, res) {
        try {
            //console.log(req.payload);
            const temp = req.headers.userid;
            const bidid = req.params.bidid;
            console.log(bidid);

            if (!temp)
                return res.response('Unauthorized').code(401);


            if (temp) {
                await dBAccessor.acceptBid1(bidid);
                await dBAccessor.acceptBid2(bidid);
                await dBAccessor.acceptBid3(bidid);
                await dBAccessor.acceptBid4(bidid);

                return res.response('Success').code(200)

                // client.flushDb(async (err, reply) => {
                //     if (err) {
                //         console.error('Error clearing cache:', err);
                //     } else {
                //         console.log('Cache cleared:', reply); // This will usually be "OK"
                //         return res.response('Success').code(200);
                //     }

                //     // Close the Redis connection
                //     //  client.quit();
                // });

                //return res.response('Success').code(200);
            }
            //      return res.response('Unauthorized').code(401);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return res.response('Internal server error').code(500);
        }
    }

    async checkBidStatus(req, res) {
        try {
            const temp = req.headers.userid;
            const productid = req.params.productid;

            if (temp) {
                const data = await dBAccessor.checkBidStatus(productid, temp);
                console.log(data);
                return data;

            }
            return res.response('Unauthorized').code(401);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return res.response('Internal server error').code(500);
        }
    }

    async checkProductStatus(req, res) {
        try {
            const temp = req.headers.userid;
            const productid = req.params.productid;

            if (temp) {
                const data = await dBAccessor.checkProductStatus(productid, temp);
                console.log(data);
                return data;
            }
            return res.response('Unauthorized').code(401);
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return res.response('Internal server error').code(500);
        }
    }

    async getBestSeller(req, res) {
        return await dBAccessor.getBestSeller();
    }

    async onDemandProducts(req, res) {
        const temp = req.headers.userid;

        if (!temp)
            return res.response('Unauthorized').code(401);

        let val = await redisHelper.getKey('bestseller');

        return val;
    }
}



module.exports = RouteHandler