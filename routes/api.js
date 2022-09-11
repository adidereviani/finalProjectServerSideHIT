// this module handles all the GET and POST services to the DB.
// 1. get libraries
const express = require('express');
const router = express.Router();
const User = require("../modules/users")
const Cost = require("../modules/costs")
const {log} = require("debug");
const {json} = require("express");

// Add User Mechanism
router.get('/addUser', function(req, res, next){
    res.render('addUser');
})

router.post('/addUser/done', function(req, res, next){
    User.create(req.body).then(function (user){
        console.log(user.id);
        console.log(user);
        res.render('index', {title:user.id})
    }).catch(next);
    // res.render('addUser');
})

router.get('/currentUser', function(req, res, next) {
    // res.send("current user: "+req.query.id);
    res.render('index');
});

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;