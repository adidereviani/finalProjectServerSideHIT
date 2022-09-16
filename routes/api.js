// this module handles all the GET and POST services to the DB.
// 1. get libraries
const express = require('express');
const router = express.Router();
const User = require("../modules/users")
const Cost = require("../modules/costs")
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
    User.create(req.body).then(function (cost){
        console.log(cost);
        res.render('DoneAddCost', {product_id:cost.product_id, product_name:cost.name})
    }).catch(next);
})

// 3. Make Purchases Mechanism
router.get('/makePurchase', function(req, res, next){
    res.render('makePurchase');
})

// TODO: check in the cost DB if the product id exist OR/AND user ID exist in the users DB
router.post('/makePurchase/done', function(req, res, next){
    // add current date:
    let currentDate = new Date();
    req.body['year'] = currentDate.getFullYear();
    req.body['month'] = currentDate.getMonth();

    Purchase.create(req.body).then(function (purchase){
        console.log(purchase);
        res.render('DoneMakePurchase', {product_id:purchase.product_id, product_name:purchase.product_name})
    }).catch(next);
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

    // TODO: check if the user exists in the database (lines 71-77 is the find function - find function return empty list if the user not found)
    function checkExistanceOfData()
    {
        return new Promise(resolve => {
            if ((month >= 1 && month <= 12) && (year >= 2000))
            {
                User.find({"id":current_user_id}).then(function(result)
                {
                    resolve();
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
        // Purchase.find({"customer_id": req.body.customer_id}).then (function(cost)
        // {
        //     console.log(cost);
        //     res.render('index');
        // }).catch(next)

        User.find({"id":current_user_id}).then(function(result)
        {
            // resolve();
            console.log(result)
            if (result.length === 0)
            {
                res.render('error', {message: "NO USER"});
            }
            else
            {
                res.render('error', {message: "ITS OK"});
            }

        }).catch((data) =>
        {
            res.render('error', {message: "user not found in database"});
        });
    }
    getData().catch(next);
        // 1. check validity of data
        // if ((report.month >= 1 && report.month <= 12) && (report.year >= 2000))
        // {
        //     // 1.1 search for the relevent data in this time for this user
        //     // need to fetch data from purchases DB
        //
        // }



        // Purchase.find({"purchase.year": report.year,
        //                     "purchase.month": report.month,
        //                     "purchase.customer_id": report.id}).toArray(function)
        // Purchase.find({"purchase.customer_id": report.id}).to
    // Purchase.find({"customer_id": req.body.customer_id}).then (function(cost)
    // {
    //     console.log(cost)
    //     res.render('index');
    // }).catch(next)


    //     res.render('DoneMakePurchase', {product_id:purchase.product_id, product_name:purchase.product_name})
    // }).catch(next);
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