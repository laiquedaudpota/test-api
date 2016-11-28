var path = require('path');
var monk = require('monk');
var logger = require('morgan');
var express = require('express');
var mongodb = require('mongodb');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var dateFormatLite = require('date-format-lite');
var database = monk('localhost:27017/test_db');

var index = require('./routes/index');

var app = express();

/////////////////////////////////////////////
// Basic Configuration for Run Application //
/////////////////////////////////////////////
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'resources')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(session({
    secret: 'MyNameIsLaiqueAli',
    resave: false,
    saveUninitialized: true
}));

//////////////////////////////////////////////////
// Cross Origin Requests Handling Configuration //
//////////////////////////////////////////////////
app.all('*', function(req, res, next) {
    if (!req.get('Origin'))
        return next();
    // use "*" here to accept any origin
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    // res.set('Access-Control-Allow-Max-Age', 3600);
    if ('OPTIONS' == req.method)
        return res.send(200);
    next();
});

/////////////////////////////////////////////
// Database Configuring As Global Variable //
/////////////////////////////////////////////
app.use(function (req, res, next) {
    req.database = database;
    next();
});

////////////
// Routes //
////////////
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});

module.exports = app;
