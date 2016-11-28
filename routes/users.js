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