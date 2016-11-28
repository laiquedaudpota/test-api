exports.isUndefined = function isUndefined(value) {
    return (value == undefined);
};

exports.isNotUndefined = function isNotUndefined(value) {
    return !this.isUndefined(value);
};

exports.isNull = function isNull(value) {
    return (value == null);
};

exports.isNotNull = function isNotNull(value) {
    return !this.isNull(value);
};

exports.isEmpty = function isEmpty(value) {
    return (value == '');
};

exports.isNotEmpty = function isNotEmpty(value) {
    return !this.isEmpty(value);
};

exports.isNotNullNorEmptyString = function isNotNullNorEmptyString(value) {
    return (this.isNotUndefined(value) && this.isNotNull(value) && this.isNotEmpty(value.trim()));
};

exports.failure = function () {
    return 'FAILURE';
};

exports.success = function () {
    return 'SUCCESS';
};

exports.response = {
    result: false,
    status: this.failure(),
    message: 'Testing'
};
