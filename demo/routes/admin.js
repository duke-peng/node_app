/**
 * Created by Administrator on 2017/8/31 0031.
 */
var express = require('express');
var router = express.Router();
var user = require('./admin/user');
var DB=require("../model/db.js");
var multiparty = require('multiparty');
var business = require('./admin/business');
var ObjectId = require('mongodb').ObjectID;
var article = require('./admin/article');
var session = require("express-session");

router.use(session({
    secret: 'keyboard cat',  // sign the session ID cookie. 加密方式
    resave: false,  //无论有没有修改session 都保存
    saveUninitialized: true,  //当未初始化的时候也保存session
    //cookie: { secure: true }  //和刚才讲的cookie一样  secure: 应用在https
}))
// localStorage.setItem('myKey', JSON.stringify(myValue));
// myValue = localStorage.getItem('myKey');


router.get("/",function(req,res){
    if( session.userinfo){


        DB.find("admin",{},function (err,data) {
            res.render("default/index_one",{
                adminname:session.userinfo,
                list:data
            })
        })
    }else{
        res.redirect("/admin/login")
    }
})

router.get("/add",function (req,res) {
    res.render("default/add",{
        adminname:session.userinfo
    })
});
router.post("/doAdd",function(req,res) {
    var form = new multiparty.Form();

    form.uploadDir = 'upload';
    /*上传的目录*/
    form.parse(req, function (err, fields, files) {
        if(err){
            console.log("333")
            console.log(err)
            return
        }
        var  oobj={};
        for(var i in fields){
            oobj[i]=fields[i][0]
        }
        oobj.img=files.img[0].path
        DB.find("admin",{"username":oobj.username},function(err,data){
            if(err){console.log(err)
            console.log("999")
            }
            else{
                if(data.length>0){
                    res.send('<script>alert("该用户名已经被注册过，请重新输入");location.href="./default/add"</script>')
                    // res.send('<script>alert("用户名或者密码错误");location.href="/login"</script>)
                }else{
                    DB.insertOne("admin",oobj,function (err,result) {
                        res.redirect("/admin")
                    })
                }
            }
        })

    })
});
router.get("/edit",function (req,res) {

    DB.find("admin",{"_id":new ObjectId(req.query.id)},function (err,data) {
    if(err){
        console.log(err);}
        else{

        res.render("default/edit",{
            list:data[0],
            adminname:session.userinfo
        })
    }
})


});
router.post("/doEdit",function(req,res) {
    var form = new multiparty.Form();
    form.uploadDir = 'upload';
    /*上传的目录*/
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err)
            console.log("错误");
            return
        }
        console.log(JSON.stringify(fields)+"99")
        var  originalFilename=files.img[0].originalFilename;
        var oobj = {};
        for (var i in fields) {
            oobj[i] = fields[i][0]
        }
        console.log(JSON.stringify(oobj)+"00");
        DB.find("admin",{"_id":new ObjectId(oobj.id)},function(err,data){
            if(err){
                console.log(err);}
                else{
                if (originalFilename) {
                    oobj.img=files.img[0].path;
                }else{
                    oobj.img=data.img
                }

                DB.updateOne("admin",{"_id":new ObjectId(oobj.id)},oobj,function (err,result) {
                    DB.find("admin",{"_id":new ObjectId(oobj.id)},function(err,data){
                        console.log(oobj.id)
                    })
                    res.redirect("/admin")
                })
            }
        })


    })
})
router.get("/delete",function (req,res) {
     DB.deleteMany("admin",{"_id":new ObjectId(req.query.id)},function (err,data) {
         if(err){
             console.log(err);
     }
    else{
        res.redirect("/admin")

    }

    })

});
router.get('/login', function(req,res){
    res.render("admin/login")
});
router.get("/scu",function(req,res){

    session.userinfo=null
    res.redirect("/admin")
})
router.post('/doLogin', function(req,res){
    DB.find("admin",req.body,function (err,result) {
        console.log(result)
        if(err){
            console.log(err)
        }else {
            if(result.length>0){
                session.userinfo= result[0].username;
                res.redirect("/admin")
            }else{
                res.send('<script>alert("密码或者用户名错误");location.href="admin/login"</script>')
                // res.send('<script>alert("用户名或者密码错误");location.href="/login"</script>)
            }
        }
    })
});



router.use('/user', user);

router.use('/business', business);



router.use('/article', article);



module.exports = router;