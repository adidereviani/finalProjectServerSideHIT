// this module handles all the GET and POST services to the DB.
// 1. get libraries
const express = require('express');
const router = express.Router();
const User = require("../modules/users")
const Cost = require("../modules/cost")
const Purchase = require("../modules/purchases")
const {log} = require("debug");
const {json} = require("express");

// 1. Add User Mechanism
router.get('/addUser', function(req, res, next){
    res.render('addUser');
})

router.post('/addUser/done', function(req, res, next){
    User.create(req.body).then(function (user){
        console.log(user);
        res.render('DoneAddUser', {first_name:user.first_name, last_name:user.last_name})
    }).catch(next);
})

// 2. Add Cost Mechanism
router.get('/addCost', function(req, res, next){
    res.render('addCost');
})

router.post('/addCost/done', function(req, res, next){

    Cost.create(req.body).then(function (cost){
        console.log(cost);
        res.render('DoneAddCost', {product_id:cost.product_id, name:cost.name})
    }).catch(next);
})

// 3. Make Purchases Mechanism
router.get('/makePurchase', function(req, res, next){
    res.render('makePurchase');
})

router.post('/makePurchase/done', function(req, res, next){
    const form_product_id = Number(req.body.product_id)
    const form_customer_id = Number(req.body.customer_id)
    console.log("form_customer_id " + form_customer_id + " typeof "+ typeof form_customer_id)
    console.log("form_product_id " + form_product_id + " typeof "+ typeof form_product_id)

    // 1. check if product exist in the DB(costs):
    function checkExistanceOfProduct()
    {
        return new Promise(resolve => {
            Cost.findOne({"product_id":Number(form_product_id)}).then(function(result)
            {
                console.log("found product " + result + " bla bla")
                resolve(result);
            }).catch((data) =>
            {
                res.render('error', {message: "Product not found in database"});
            });
        });
    }

    // 2. check if customer id exist in users DB:
    function checkExistanceOfCustomer()
    {
        return new Promise(resolve => {
            User.findOne({"id":Number(form_customer_id)}).then(function(result)
            {
                console.log("found customer " + result + " bla bla")
                resolve(result);
            }).catch((data) =>
            {
                res.render('error', {message: "Product not found in database"});
            });
        });
    }

    async function makePurchase()
    {
        const foundProduct = await checkExistanceOfProduct();
        const foundCustomer = await checkExistanceOfCustomer();

        if (foundProduct == null) // Product or customer not found
        {
            res.render('error', {message: "Product not exist in the database"});
        }
        else if (foundCustomer == null) // Product or customer not found
        {
            res.render('error', {message: "Customer not exist in the database"});
        }
        else // Customer and Product exists
        {
            // add current date:
            let currentDate = new Date();
            req.body['year'] = currentDate.getFullYear();
            req.body['month'] = currentDate.getMonth() + 1; // return values between 0 - 11
            req.body['total_sum'] = Number(req.body.quantity) * Number(foundProduct.sum)

            Purchase.create(req.body).then(function (purchase){
                console.log(purchase);
                res.render('DoneMakePurchase', {customer_id:purchase.customer_id,
                    year:purchase.year,
                    month:purchase.month,
                    product_id:purchase.product_id,
                    product_name:purchase.product_name,
                    quantity:purchase.quantity,
                    total_sum:purchase.total_sum})
            }).catch(next);
        }


    }
    makePurchase().catch(next);
})

// 4. Report
router.get('/report', function(req, res, next){
    res.render('Report');
})

router.post('/report/done', function(req, res, next){
    // Purchase.create(req.body).then(function (report){
    //     console.log(report);
    const month = req.body.month;
    const year = req.body.year;
    const current_user_id = req.body.customer_id;

    function checkExistanceOfData()
    {
        return new Promise(resolve => {
            if ((month >= 1 && month <= 12) && (year >= 2000))
            {
                User.findOne({"id":current_user_id}).then(function(result)
                {
                    resolve(result);
                }).catch((data) =>
                {
                    res.render('error', {message: "user not found in database"});
                });
            }
            else
            {
                res.render('error', {message: "Year or Month not valid"});
            }

        });
    }

    async function getData()
    {
        const asyncResult = await checkExistanceOfData();
        console.log("asyncResult: "+asyncResult)
        if (asyncResult == null) // user not found
        {
            res.render('error', {message: "User was not found in the database"});
        }
        else
        {
            const first_name = asyncResult.first_name
            const last_name = asyncResult.last_name
            console.log(first_name + " " + last_name);
            Purchase.find({"customer_id":current_user_id,
                                "year":year,
                                "month": month}).then(function(result)
            {
                // sum all purchases of this customer:
                let all_purchases_sum = 0
                result.forEach(function(value)
                {
                    all_purchases_sum+=Number(value.total_sum)
                })

                    res.render('ShowReport', {customer_id: current_user_id,
                                                        year:year,
                                                        month:month,
                                                        first_name: first_name,
                                                        last_name: last_name,
                                                        all_purchases_sum: all_purchases_sum,
                                                        dictionary: result});
            }).catch((data) =>
            {
                res.render('error', {message: "Data not found in database: " + data}); // TODO: is it okay to add 'data' variable to the message?
            });
        }

    }
    getData().catch(next);
})

// Test:
router.get('/currentUser', function(req, res, next) {
    // res.send("current user: "+req.query.id);
    res.render('index');
});

// TODO: Make this a central HTML page with menu to all sub pages/forms
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;