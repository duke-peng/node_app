

/**
 * Created by Administrator on 2017/8/31 0031.
 */
var express = require('express');
var router = express.Router();
var session = require("express-session");

router.use(session({
    secret: 'keyboard cat',  // sign the session ID cookie. 加密方式
    resave: false,  //无论有没有修改session 都保存
    saveUninitialized: true,  //当未初始化的时候也保存session
    //cookie: { secure: true }  //和刚才讲的cookie一样  secure: 应用在https
}))

var db=require('../../model/db.js');
var multiparty = require('multiparty');

var MongoClient = require('mongodb').MongoClient;   /*封装好的方法 用来连接数据库操作数据库的*/

var DbUrl='mongodb://60.205.226.107:27017/elm';

var ObjectID = require('mongodb').ObjectID;  /*匹配系统自己生成的_id*/


router.get('/',function(req,res){


    //连接数据库查询数据
    MongoClient.connect(DbUrl,function(err,db){

        if(err){

            console.log('数据库连接失败');
            return;
        }
        var result=db.collection('article').find();


        result.toArray(function(error,data){
            //console.log(data);


            res.render('admin/article/index',{
                adminname:session.userinfo,
                list:data
            });
        })

    })


})

router.get('/add',function(req,res){

    res.render('admin/article/add',{
        adminname:session.userinfo
    });
})


router.post('/doAdd',function(req,res){

    var form = new multiparty.Form();

    form.uploadDir='upload';  /*上传的目录*/
    form.parse(req, function(err, fields, files) {

        //console.log(fields);
        //console.log(files.pic[0].path);

        var title=fields.title[0];
        var author=fields.author[0];
        var content=fields.content[0];
        var addtime=fields.addtime[0];
        var status=fields.status[0];
        var description=fields.description[0];
        var pic=files.pic[0].path;

        MongoClient.connect(DbUrl,function(err,db){
            if(err){

                console.log('数据库连接失败');
                return;
            }
            db.collection('article').insertOne({
                title,
                author,
                content,
                addtime,
                status,
                description,
                pic
            },function(error,data){

                if(error){
                    console.log(error);
                    return;
                }
                res.redirect('./');

            })

        })

    });

})
router.post("/find",function(req,res){
    MongoClient.connect(DbUrl,function(err,db){

        if(err){

            console.log('数据库连接失败');
            return;
        }
        console.log(req.body._id)
        var result=db.collection('article').find({"_id":new ObjectID(req.body._id)});
        result.toArray(function(error,data){
            if(data.length>0){
                res.json({result:data,success:"true"})
            }else{
                res.json({result:"", success:"false"})
            }

        })
    })
})

router.get('/edit',function(req,res){

    //res.send('修改');

    console.log(req.query.id);


    MongoClient.connect(DbUrl,function(err,db){

        if(err){

            console.log('数据库连接失败');
            return;
        }
        var result=db.collection('article').find({"_id":new ObjectID(req.query.id)});


        result.toArray(function(error,data){

            res.render('admin/article/edit', {
                list: data[0],
                adminname: session.userinfo
            });
        })
    })
})


router.post('/doEdit',function(req,res) {



    //接收form表单提交的数据
    var form = new multiparty.Form();

    form.uploadDir = 'upload';
    form.parse(req, function (err, fields, files) {

        //console.log(fields);

        //console.log(files);
        var _id = fields.id[0];
        var title = fields.title[0];
        var author = fields.author[0];
        var content = fields.content[0];
        var addtime = fields.addtime[0];
        var status = fields.status[0];
        var description = fields.description[0];

        var pic = files.pic[0].path;


        var originalFilename = files.pic[0].originalFilename;

        if (originalFilename) {  /*更新了图片*/

            var setData = {
                /*没有需改图片的时候更新的数据*/
                title,
                author,
                content,
                addtime,
                status,
                description,
                pic
            }

        } else {
            var setData = {
                /*没有需改图片的时候更新的数据*/
                title,
                author,
                content,
                addtime,
                status,
                description
            }

        }
        MongoClient.connect(DbUrl, function (err, db) {

            if (err) {
                console.log('数据库连接失败');
                return;
            }
            db.collection('article').updateOne({"_id": new ObjectID(_id)}, {
                $set: setData
            }, function (error) {

                if (error) {

                    console.log('修改失败');
                    return;
                }

                res.redirect('./');

            })
        })


    });
})

router.get('/delete',function(req,res){

    var id = req.query.id;
    //console.log(id);

    MongoClient.connect(DbUrl, function (err, db) {

        if (err) {
            console.log('数据库连接失败');
            return;
        }
        db.collection('article').deleteOne({"_id": new ObjectID(id)}, {
            id:false
        })
        res.redirect('./');

    })
})
router.post('/upload',function(req,res){


    var form = new multiparty.Form();
    form.uploadDir='./upload'  /*设置图片上传的路径*/

    form.parse(req, function(err, fields, files) {

        //fields post过来的表单的文本内容
        //
        //files 包含吗了post过来的图片信息

        console.log(fields);

        console.log(files);

        var path=files.filedata[0].path;

        res.json({"err":"","msg":path})  /*给编辑器返回地址信息*/

    });
})




module.exports = router;






