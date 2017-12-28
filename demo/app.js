var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var admin = require('./routes/admin');
var api = require('./routes/api');
var _index = require('./routes/_index');
var DB=require("./model/db.js")
var app = express();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use("/upload",express.static("upload"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/admin/article/upload',express.static(path.join(__dirname, 'upload')));
app.use(express.static(path.join(__dirname, 'public')));
//app.use("/admin",express.static("admin"));
app.use('/admin', admin);
app.use('/api', api);
app.get("/",function(req,res){
    res.render("default/queen")
})


app.listen(80)

