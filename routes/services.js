// this module handles all the GET and POST services to the DB.
// 1. get libraries
const express = require('express');
const router = express.Router();
const User = require("../modules/users")
const Cost = require("../modules/costs")
const {log} = require("debug");
const {json} = require("express");

router.post('/addUser', function(req, res, next){
    console.log("Current User ID: "+req.query.id);
    res.render('error');
})

router.get('/currentUser', function(req, res, next) {
    // res.send("current user: "+req.query.id);
    res.render('index');
});

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
