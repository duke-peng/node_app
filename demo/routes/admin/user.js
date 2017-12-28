/**
 * Created by Administrator on 2017/8/31 0031.
 */
var express = require('express');
var router = express.Router();
var DB=require('../../model/db.js');
var multiparty = require('multiparty');
var ObjectId = require('mongodb').ObjectID;
var session = require("express-session");

router.use(session({
    secret: 'keyboard cat',  // sign the session ID cookie. 加密方式
    resave: false,  //无论有没有修改session 都保存
    saveUninitialized: true,  //当未初始化的时候也保存session
    //cookie: { secure: true }  //和刚才讲的cookie一样  secure: 应用在https
}))

/* GET users listing. */
//用户管理列表获取数据
router.get('/', function(req, res, next) {

            DB.find("user", req.body, function(err, data) {
                res.render('./admin/user/index', {
                    list: data,
                    adminname:session.userinfo

                })

            })
});
            //增加用户
            router.get('/add', function(req, res, next) {


                res.render('./admin/user/add',{
                    adminname:session.userinfo
                });

            });
            router.post('/yhadd', function(req, res, next) {

                var form = new multiparty.Form();
                form.parse(req, function(err, fields, files) {
                    var username = fields.username[0];
                    var password = fields.password[0];
                    var sex = fields.sex[0];
                    var tel = fields.tel[0];
                    var addtime = fields.addtime[0];
                    var status = fields.status[0];

                    // console.log(username);

                    DB.insertOne("user", {
                        sex,
                        password,
                        username,
                        addtime,
                        tel,
                        status
                    }, function(err, data) {

                        res.render("./admin/user/add",{
                            adminname:session.userinfo
                        }) /*页面不跳转*/

                    })
                })

            });
            //修改用户
            router.post('/setlogin', function(req, res, next) {
                // console.log(req.body)
                var id = new ObjectId(req.body._id)
                    req.body._id=id
             DB.updateOne("user",{ "_id": id },{$set:req.body},function (err,data) {
                 if(err){console.log(err)
                 res.json({
                   msg: "数据库连接失败"
                 })}
                 else{
                     console
                     res.json({
                         success:"1",
                         result:data
                     })

                 }
             })

            });
            router.post('/yhxg', function(req, res, next) {

                var form = new multiparty.Form();

                form.parse(req, function(err, fields, files) {
                    var _id = fields.id[0];
                    var username = fields.username[0];
                    var password = fields.password[0];
                    var sex = fields.sex[0];
                    var tel = fields.tel[0];
                    var addtime = fields.addtime[0];
                    var status = fields.status[0];

                    // console.log(username);

                    DB.updateOne("user", { "_id": new ObjectId(_id) }, {
                        sex,
                        password,
                        username,
                        addtime,
                        tel,
                        status
                    }, function(err, data) {
                        // console.log(data);
                        if (err) {
                            console.log("修改失败");
                            return
                        }

                        res.redirect("./") /*跳转到首页*/

                    })
                })

            });
            //用户删除
            router.get('/yhdelete', function(req, res) {


                var id = req.query.id; //获取
                // console.log(req.query.id);

                DB.deleteMany("user", { "_id": new ObjectId(id) }, function(error, data) {

                    DB.find("user", { "_id": new ObjectId(id) }, function(err, data) {

                        res.redirect("./") /*跳转到首页*/

                    })

                })

                // res.send( "删除" )

            });
router.post('/login', function(req,res){
// console.log(req.body)
    DB.find("user",req.body,function (err,result) {
        if(err){
            console.log(err)
        }else {
            if(result.length>0){
                res.json({
                    success:1,
                    result:result
                })
            }else{
                DB.insertOne("user",req.body,function (p1, p2) {
                    if(p1){console.log(p1)}
                    else{
                        // console.log(p2.ops[0])
                        res.json({
                            success:0,
                            msg:"插入成功",
                            result:p2.ops
                        })
                    }
                })
            }
        }
    })
});

router.post('/loginpass', function(req,res){

    DB.find("user",{username:req.body.loginNumber,password:req.body.password},function (err,result) {
        if(err){
            console.log(err)
        }else {
            if(result.length>0){
                res.json({
                    success:1,
                    result:result
                })
            }else{
                DB.find("user",{phoneNumber:req.body.loginNumber,password:req.body.password},function (err,result) {
                    if(err){
                        console.log(err)
                    }else {
                        if (result.length > 0) {
                            res.json({
                                success: 1,
                                result: result
                            })
                        }else{
                            res.json({
                                result: result
                            })
                        }
                    }
                })
            }
        }
    })
});
// 手机用户注册

router.post('/enter', function(req, res, next) {
    console.log(123)
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        console.log(fields)
        var username = fields.username[0];
        var password = fields.password[0];


        console.log(username);



        DB.find("user",{"username":username},function(err,data){
            if(err){console.log(err)
                console.log("错误")
            }
            else{
                if(data.length>0){
                    console.log("数据库有相同数据")
                    res.jsonp(
                        { suess:"注册失败"}
                    )

                }else{
                    DB.insertOne("user", {
                        password,
                        username,

                    }, function(err, data) {
                        res.jsonp(
                            { suess:"注册成功"}
                        )

                    } )
                }
            }
        })
    })
})


        module.exports = router;