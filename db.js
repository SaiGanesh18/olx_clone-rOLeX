const { Client } = require('pg');
require("dotenv").config();

const proConfig = {
    connectionString: process.env.DATABASE_URL
}

const devConfig = {
    user: 'postgres',
    password: 'samsung@135',
    host: 'localhost',
    port: 5432,
    database: 'project_userdetails'
}

const client = new Client(process.env.NODE_ENV === "production" ? proConfig : devConfig);

//client.connect();



class DBAccessor {
    constructor() {
        client.connect();
    }
    async checkemail(email) {
        return await client.query(
            'SELECT * FROM userdetails WHERE useremail = $1',
            [email]
        );
    }
    async insertUserData(userDetails, userData) {
        return await client.query(
            'INSERT INTO userdetails (useremail, userpassword, userdata) VALUES ($1, $2, $3)',
            [userDetails.useremail, userDetails.hasheduserpassword, userData]
        );
    }

    async insertLoginDetails(loginDetails) {
        return await client.query(
            'SELECT * FROM userdetails WHERE useremail = $1', // AND userpassword = $2',
            [loginDetails.useremail] //, loginDetails.hasheduserpassword]
        );
    }

    async displayProductDetails(temp) {
        return await client.query(
            'SELECT * FROM productdetails WHERE productid NOT IN (SELECT productid FROM biddetails WHERE buyeremail = $1) AND productid NOT IN (SELECT productid FROM productdetails pd INNER JOIN userdetails ud ON pd.sellerid = ud.userid WHERE ud.useremail = $2) AND productstatus <>1 ORDER BY producttimestamp DESC', [temp, temp]
        );
    }

    async postProduct(temp, jsonData) {
        return await client.query(
            `INSERT INTO productdetails (productdata,sellerid) VALUES($1,(SELECT userid FROM userdetails WHERE useremail = $2))`, [jsonData, temp]
        );
    }

    async getSpecificProduct(id) {
        return await client.query(
            'SELECT * FROM productdetails WHERE productid = $1', [id]
        );
    }

    async raiseBid(pid, temp, data) {
        return await client.query(
            `INSERT INTO biddetails (productid,bidprice,buyeremail,sellerid) VALUES ($1,$2,$3,(SELECT sellerid FROM productdetails WHERE productid = $1))`, [pid, data, temp]
        );
    }

    async bidHistory(temp) {
        return await client.query(
            `SELECT pd.* FROM productdetails pd JOIN biddetails bd ON pd.productid = bd.productid WHERE bd.buyeremail = $1`, [temp]

        );
    }

    async sellHistory(temp) {
        return await client.query(
            `SELECT pd.* FROM productdetails pd JOIN userdetails ud ON pd.sellerid = ud.userid WHERE ud.useremail = 'example@email.com' OR pd.sellerid = (SELECT userid FROM userdetails WHERE useremail = $1)`, [temp]
        );
    }

    async cancelBid(bidid) {
        return await client.query(
            'DELETE FROM biddetails WHERE bidid = $1', [bidid]
        );
    }

    async deleteProduct(pid) {
        return await client.query(
            'DELETE FROM productdetails WHERE productid = $1', [pid]
        );
    }

    async updateBid(bidid, bp) {
        return await client.query(
            'UPDATE biddetails SET bidprice = $1 WHERE bidid = $2', [bp.bidprice, bidid]
        );
    }

    async showAllBids(pid) {
        return await client.query(
            `SELECT * FROM biddetails WHERE productid = $1 AND bidstatus = 0`, [pid]
        );
    }

    async acceptBid1(bidid) {
        return await client.query(
            `UPDATE biddetails SET bidstatus = 1 where productid = (SELECT productid FROM biddetails WHERE bidid = $1)`, [bidid]
        );
    }

    async acceptBid2(bidid) {
        return await client.query(
            `UPDATE biddetails SET bidstatus = 2 where bidid = $1`, [bidid]
        );
    }

    async acceptBid3(bidid) {
        return await client.query(
            `UPDATE productdetails SET productstatus = 1 WHERE productid = (SELECT productid FROM biddetails WHERE bidid = $1)`, [bidid]
        );
    }

    async acceptBid4(bidid) {
        return await client.query(
            `UPDATE productdetails SET productstatus = 1 WHERE productid = (SELECT productid FROM biddetails WHERE bidid = $1)`, [bidid]
        );
    }

    async checkBidStatus(productid, temp) {
        return await client.query(
            `SELECT bidstatus FROM biddetails WHERE bidid = (SELECT bidid from biddetails WHERE productid = $1 AND buyeremail = $2) ORDER BY bidprice
            LIMIT 1`, [productid, temp]
        );
    }

    async checkProductStatus(productid, temp) {
        return await client.query(
            `SELECT productstatus FROM productdetails WHERE productid = $1`, [productid]
        );
    }

    async getBestSeller() {
        return await client.query(
            'SELECT pd.*, bd.bid_count FROM productdetails pd JOIN ( SELECT productid, COUNT(*) AS bid_count FROM biddetails GROUP BY productid ORDER BY bid_count DESC LIMIT 5) bd ON pd.productid = bd.productid WHERE pd.productid IN (SELECT productid    FROM productdetails WHERE productstatus = 0  ) ORDER BY bd.bid_count DESC'            // 'SELECT * FROM userdetails'
        );
    }
}

module.exports = DBAccessor;



//ALTER TABLE userdetails ALTER COLUMN userdata SET DEFAULT '{"key1": "value1", "key2": "value2", "key3": "value3"}';