/**
 * Created by Administrator on 2017/8/31 0031.
 */
var express = require('express');
var router = express.Router();
var user = require('./admin/user');
// var DB=require("../model/db.js");
// var multiparty = require('multiparty');
// var business = require('./admin/business');
// var ObjectId = require('mongodb').ObjectID;
// var article = require('./admin/article');
// var session = require("express-session");
// router.use(session({
//     secret: 'keyboard cat',  // sign the session ID cookie. 加密方式
//     resave: false,  //无论有没有修改session 都保存
//     saveUninitialized: true,  //当未初始化的时候也保存session
//     //cookie: { secure: true }  //和刚才讲的cookie一样  secure: 应用在https
// }))
//
// router.get("/",function(req,res){
//     res.render("default/queen")
// })