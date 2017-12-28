/**
 * Created by Administrator on 2017/8/31 0031.
 */
var express = require('express');
var router = express.Router();

var DB=require('../model/db.js');


var ObjectId = require('mongodb').ObjectID;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('api首页');
});

router.get('/business', function(req, res, next) {
    if(req.query){
        DB.find("merchant",{"_id": new ObjectId(req.query._id)},function (err,data) {
            res.json({"result":data});
        })
    }else{
        DB.find("merchant",{},function (err,data) {
            res.json({"result":data});
        })
    }

});
router.get('/article/:aid',function(req, res){
console.log("33")
        DB.find("article",{"_id": new ObjectId(req.params.aid)},function (err,data) {
            res.json({"result":data});
        })
})
router.get('/article',function(req, res){
    console.log("77")
    DB.find("article",{},function (err,data) {
            res.json({"result":data});
        })
})
router.get('/user',function(req, res, next) {
    DB.find("user",{},function (err,data) {
        res.json({"result":data});
    })
})
router.post('/user',function(req, res, next) {
    DB.find("user",{},function (err,data) {
        res.json({"result":data});
    })
})

module.exports = router;
