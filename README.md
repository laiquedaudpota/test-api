# test-api
#### Simple Demo Project for Dummy Test APIs


-------------------- app.js --------------------
```javascript
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

// Basic Configuration for Run Application //
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

// Cross Origin Requests Handling Configuration //
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

// Database Configuring As Global Variable //
app.use(function (req, res, next) {
    req.database = database;
    next();
});

// Routes //
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});

module.exports = app;
```

-------------------- routes/users.js --------------------
```javascript
var utils = require('../utils/app-utils');
var dateFormatLite = require('date-format-lite');

exports.index = function(request, response, next) {
    response.send(utils.response);
}

/*** Sign In User ***/
exports.signIn = function(request, response, next) {
    var responseData = utils.response;

    if (!utils.isNotNullNorEmptyString(request.body.username)) {
        responseData.message = 'Username is required';
        response.send(responseData);

    } else if (!utils.isNotNullNorEmptyString(request.body.password)) {
        responseData.message = 'Password is required';
        response.send(responseData);

    } else {
        var database = request.database;
        var collection = database.get('users');

        var username = request.body.username.toLowerCase();

        collection.findOne({username: username, password: request.body.password}, ['_id'], function (error, data) {
            if (error) {
                response.send({error: error});
            } else {
                if (data != null) {
                    responseData.result = true;
                    responseData.status = utils.success();
                    responseData.message = 'Welcome Dear User ' + request.body.username;

                    response.send(responseData);
                } else {
                    responseData.message = 'Username or Password is invalid';
                    response.send(responseData);
                }
            }
        });
    }
};

/*** Sign Up User ***/
exports.signUp = function(request, response, next) {
    var responseData = utils.response;

    if (!utils.isNotNullNorEmptyString(request.body.username)) {
        responseData.message = 'Username is required';
        response.send(responseData);

    } else if (!utils.isNotNullNorEmptyString(request.body.password)) {
        responseData.message = 'Password is required';
        response.send(responseData);

    } else if (!utils.isNotNullNorEmptyString(request.body.firstName)) {
        responseData.message = 'First Name is required';
        response.send(responseData);

    } else if (!utils.isNotNullNorEmptyString(request.body.lastName)) {
        responseData.message = 'Last Name is required';
        response.send(responseData);

    } else {
        var database = request.database;
        var collection = database.get('users');

        var username = request.body.username.toLowerCase();

        collection.findOne({username: username}, ['_id'], function (error1, data1) {
            if (error1) {
                console.log(error1);
                response.send({error: error1});
            } else {
                if (utils.isNotNull(data1)) {
                    responseData.message = request.body.username + ', user already exist, please choose other one';
                    response.send(responseData);

                } else {
                    var dateFormat = 'DDD, DD/MM/YYYY, HH:mm:ss A';

                    var userData = {
                        username: username,
                        password: request.body.password,
                        firstName: request.body.firstName,
                        lastName: request.body.lastName,
                        createdOn: new Date().format(dateFormat),
                        updatedOn: new Date().format(dateFormat),
                    };

                    collection.insert(userData, function(error2, data2) {
                        if (error2) {
                            response.send({error: error1});
                        } else {
                            responseData.result = true;
                            responseData.status = utils.success();
                            responseData.message = 'Successfully!! Your account has been created';

                            response.send(responseData);
                        }
                    });
                }
            }
        });
    }
};

/*** View User Profile ***/
exports.viewProfile = function(request, response, next) {
    var responseData = utils.response;

    if (!utils.isNotNullNorEmptyString(request.query.username)) {
        responseData.message = 'Username is required';
        response.send(responseData);

    } else if (!utils.isNotNullNorEmptyString(request.query.password)) {
        responseData.message = 'Password is required';
        response.send(responseData);

    } else {
        var database = request.database;
        var collection = database.get('users');

        var username = request.query.username.toLowerCase();

        collection.findOne({username: username, password: request.query.password}, [], function (error, data) {
            if (error) {
                response.send({error: error});
            } else {
                if (data != null) {

                    console.log(data);

                    responseData.result = true;
                    responseData.status = utils.success();
                    responseData.message = undefined;
                    responseData.user = {
                        username: request.query.username,
                        password: 'XxXxXxX',
                        firstName: data.firstName,
                        lastName: data.lastName,
                        createdOn: data.createdOn
                    };

                    response.send(responseData);
                } else {
                    responseData.message = 'Username or Password is invalid';
                    response.send(responseData);
                }
            }
        });
    }
};
``` 
-------------------- sample-request.txt --------------------
```javascript
/*** Request for Sign In ***/
$.ajax({
    url: 'https://test-api-laique.c9users.io/signIn',
    type: 'post',
    data: {
        username: 'laique',
        password: 'daudpota'
    },
    success: function(response) {
        console.log(response);
    }
});


/*** Request for Sign Up ***/
$.ajax({
    url: 'https://test-api-laique.c9users.io/signUp',
    type: 'post',
    data: {
        username: 'laique123',
        password: 'daudpota',
        firstName: 'Laique Ali',
        lastName: 'Daudpota'
    },
    success: function(response) {
        console.log(response);
    }
});

/*** Request for View Valid User Profile ***/
#1 Request -> https://test-api-laique.c9users.io/viewProfile?username=laique&password=daudpota

#2 Request -> 
$.ajax({
    url: 'https://test-api-laique.c9users.io/viewProfile',
    data: {
        username: 'laique123',
        password: 'daudpota'
    },
    success: function(response) {
        console.log(response);
    }
});
```
